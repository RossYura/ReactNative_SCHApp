import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  useCallback, useEffect, useLayoutEffect,
} from 'react';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { useColorVisionTestLogic } from '@kuatsu/sehcheck-common/hooks';
import ExitButton from '../../../components/ExitButton';
import VisionTests from '../../../config/vision_tests';
import VoiceCommands from '../../../config/voice_commands';
import {
  ColorTestConfig, RootStackParamList, VisionTest,
} from '../../../types/global';
import Helpers from '../../../utils/helpers';
import useAudio from '../../useAudio';
import useVoice from '../../useVoice';

const visionTest = VisionTests.color as VisionTest<ColorTestConfig>;
const voiceCommands = VoiceCommands.visionTests.color;

const useColorVisionTestController = (
  navigation: NativeStackNavigationProp<RootStackParamList, 'ColorVisionTest'>,
) => {
  const {
    currentTestId,
    possibleAnswers,
    countdownTime,
    highlightedButton,
    handleButtonPressed: handleButtonPressedLogic,
    handleCountdownFinished,
    calculateResults,
    shouldGoToResults,
  } = useColorVisionTestLogic(visionTest.testConfig, visionTest.results, {
    afterGetNextTest: () => setListening(true),
  });
  const audio = useAudio();
  const [setListening, { transcript, lastTranscriptTimestamp }] = useVoice();

  useEffect(() => {
    activateKeepAwake('visiontest');

    return () => deactivateKeepAwake('visiontest');
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
    });
  }, [navigation, audio]);

  useFocusEffect(useCallback(() => {
    if (countdownTime === undefined) {
      setListening(true);
    }
    return () => {
      setListening(false);
    };
  }, [countdownTime]));

  const handleButtonPressed = (answer: number | null) => {
    handleButtonPressedLogic(
      answer,
      (points) => audio.playSoundEffect(points === 2 ? 'correctAnswer' : 'wrongAnswer'),
    );
    setListening(false);
  };

  useEffect(() => {
    if (transcript) {
      const parsedCommand = Helpers.checkVoiceCommand(transcript, voiceCommands);
      if (parsedCommand !== null) {
        if (parsedCommand === 'buttonNone') handleButtonPressed(null);
        return;
      }

      const parsedNumber = Helpers.checkVoiceCommandForNumbers(transcript);
      if (parsedNumber !== null && possibleAnswers.includes(parsedNumber)) {
        handleButtonPressed(parsedNumber);
      }
    }
  }, [lastTranscriptTimestamp]);

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

  return {
    currentTestId,
    possibleAnswers,
    countdownTime,
    highlightedButton,
    handleButtonPressed,
    handleCountdownFinished,
  };
};

export default useColorVisionTestController;
