import { useEffect, useState } from 'react';

import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
  // SpeechVolumeChangeEvent,
} from '@react-native-voice/voice';
import { Platform } from 'react-native';
import dayjs from 'dayjs';
import shallow from 'zustand/shallow';
import Bugsnag from '@bugsnag/expo';
import Helpers from '../utils/helpers';
import useStore from './useStore';

/**
 * Hook for the react-native-voice library (speech recognition).
 * @param listenInitially Whether or not to start listening as soon as the hook is called.
 * @returns A tuple consisting of a function to start/stop listening, and an object containing additional data including
 * the currently processed, full transcript (reset to null after every fire), a timestamp of the last full transcript,
 * the partial transcript, the currently detected speech volume as well as a speechError object passed through from the
 * library.
 */
const useVoice = (listenInitially?: boolean): [
  (listen: boolean) => void,
  {
    transcript: string | null,
    lastTranscriptTimestamp: number,
    partialTranscript: string | null,
    // speechVolume: number | null,
    speechError: SpeechErrorEvent | null,
    destroyed: boolean,
  },
] => {
  const [currentTranscript, setCurrentTranscript] = useState<string | null>(null);
  const [processedTranscript, setProcessedTranscript] = useState<string | null>(null);
  const [lastTranscriptTimestamp, setLastTranscriptTimestamp] = useState(0);
  const [partialTranscript, setPartialTranscript] = useState<string | null>(null);
  // const [volume, setVolume] = useState<number | null>(null);
  const [_shouldRestartListening, setShouldRestartListening] = useState(false);
  const [error, setError] = useState<SpeechErrorEvent | null>(null);
  const [destroyed, setDestroyed] = useState(true);
  const { listening, setListening, speechRecognitionActivated } = useStore((state) => ({
    listening: state.listening,
    setListening: state.setListening,
    speechRecognitionActivated: state.speechRecognitionActivated,
  }), shallow);

  useEffect(() => {
    if (listenInitially && speechRecognitionActivated) setListening(true);
    else setListening(false);
  }, [listenInitially]);

  const onSpeechResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechResults: ', e);
    if (e.value) {
      // receivedTranscript is always the "freshest" transcript the system marked as complete.
      const receivedTranscript = e.value[0];
      if (Platform.OS === 'ios') {
        /* onSpeechResults is called prematurely on iOS (as soon as one single word has been processed). Therefore,
        wait for some time and check if the user has stopped speaking, and only then mark the transcript as
        processed and return it. */
        setCurrentTranscript(receivedTranscript);
        setTimeout(() => {
          setCurrentTranscript((previousTranscript) => {
            // Check if the transcript from 1 second ago equals to the current transcript from the system
            if (receivedTranscript === previousTranscript) {
              // They match! The user seems to have stopped speaking. Set the processed transcript accordingly.
              console.log('Processed transcript (iOS): ', receivedTranscript);
              setProcessedTranscript(receivedTranscript);
              setLastTranscriptTimestamp(dayjs().valueOf());
              // Reset the transcript
              Voice.stop();
              Voice.destroy().then(() => {
                const prevListening = useStore.getState().listening;
                if (prevListening) setShouldRestartListening(true);
                setListening(false);
              });
              return null;
            }
            // They don't match - check again later
            return previousTranscript;
          });
        }, 1000);
      } else {
        setCurrentTranscript(receivedTranscript);
        setLastTranscriptTimestamp(dayjs().valueOf());
      }
    } else {
      setCurrentTranscript(null);
      setLastTranscriptTimestamp(dayjs().valueOf());
    }
  };

  const onSpeechPartialResults = (e: SpeechResultsEvent) => {
    console.log('onSpeechPartialResult', e);
    if (e.value) setPartialTranscript(e.value[0]);
    else setPartialTranscript(null);
  };

  /* const onSpeechVolumeChanged = (e: SpeechVolumeChangeEvent) => {
    if (e.value) setVolume(e.value);
    else setVolume(null);
  }; */

  const onSpeechError = (e: SpeechErrorEvent) => {
    console.log('onSpeechError: ', e);
    if (e.error) setError(e);
    else setError(null);
  };

  const startListening = async () => {
    if (!speechRecognitionActivated) return;
    console.log('Listening started.');
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    // Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechStart = () => {
      setDestroyed(false);
      console.log('Speech Started.');
    };
    Voice.onSpeechEnd = () => console.log('Speech ended');
    try {
      await Voice.start('en-US');
    } catch (e: any) {
      console.warn(e);
      Bugsnag.notify(e, (event) => {
        event.severity = 'warning';
      });
    }
  };

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    Voice.isAvailable();
    return () => {
      Voice.destroy().then(() => {
        setDestroyed(true);
        Voice.removeAllListeners();
      });
    };
  }, []);

  useEffect(() => {
    if (listening) {
      startListening();
    } else {
      Voice.destroy().then(() => {
        console.log('Listening stopped.');
        setDestroyed(true);
      }).catch((e) => console.error(e));
    }
  }, [listening]);

  return [
    setListening,
    {
      transcript: Helpers.sanitizeTranscript(Platform.OS === 'ios' ? processedTranscript : currentTranscript),
      lastTranscriptTimestamp,
      partialTranscript: Helpers.sanitizeTranscript(partialTranscript),
      // speechVolume: volume,
      destroyed,
      speechError: error,
    },
  ];
};

export default useVoice;
