import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useCallback, useEffect, useLayoutEffect,
} from 'react';
import { useMakulaVisionTestLogic } from '@kuatsu/sehcheck-common/hooks';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import ExitButton from '../../../components/ExitButton';
import VoiceCommands from '../../../config/voice_commands';
import { RootStackParamList } from '../../../types/global';
import Helpers from '../../../utils/helpers';
import useAudio from '../../useAudio';
import useVoice from '../../useVoice';

const voiceCommands = VoiceCommands.visionTests.makula;

const useMakulaVisionTestController = (
  navigation: NativeStackNavigationProp<RootStackParamList, 'MakulaVisionTest'>,
) => {
  const {
    countdownReason,
    countdownTime,
    currentEye,
    highlightedButton,
    handleButtonPressed: handleButtonPressedLogic,
    handleCountdownFinished: handleCountdownFinishedLogic,
    shouldGoToResults,
    calculateResults,
  } = useMakulaVisionTestLogic();
  const audio = useAudio();
  const [setListening, { transcript, lastTranscriptTimestamp }] = useVoice();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
    });
  }, [navigation, audio]);

  useEffect(() => {
    activateKeepAwake('visiontest');
    audio.playTTS('makulaLeftHand');

    return () => deactivateKeepAwake('visiontest');
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (countdownReason === null) {
        setListening(true);
      }

      return () => setListening(false);
    }, [countdownReason]),
  );

  useEffect(() => {
    if (!shouldGoToResults) return;
    const { result, details } = calculateResults();

    navigation.reset({
      index: 0,
      routes: [{
        name: 'Results',
        params: {
          result,
          details,
        },
      }],
    });
  }, [shouldGoToResults]);

  const handleButtonPressed = (testPassed: boolean) => {
    if (countdownReason) return;
    handleButtonPressedLogic(testPassed);
    setListening(false);
    audio.playSoundEffect(testPassed ? 'correctAnswer' : 'wrongAnswer');
  };

  useEffect(() => {
    if (transcript) {
      const parsedCommand = Helpers.checkVoiceCommand(transcript, voiceCommands);
      if (parsedCommand === 'buttonYes') {
        handleButtonPressed(true);
      } else if (parsedCommand === 'buttonNo') {
        handleButtonPressed(false);
      }
    }
  }, [lastTranscriptTimestamp]);

  const handleCountdownFinished = () => {
    handleCountdownFinishedLogic();
    if (countdownReason === 'hand') {
      setListening(true);
    } else if (countdownReason === 'break' && currentEye === 'right') {
      audio.playTTS('makulaRightHand');
    }
  };

  return {
    countdownReason,
    countdownTime,
    currentEye,
    highlightedButton,
    handleButtonPressed,
    handleCountdownFinished,
  };
};

export default useMakulaVisionTestController;
