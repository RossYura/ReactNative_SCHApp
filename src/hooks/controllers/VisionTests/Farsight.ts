import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import ExitButton from '../../../components/ExitButton';
import AppConfig from '../../../config/app_config';
import VisionTests from '../../../config/vision_tests';
import VoiceCommands from '../../../config/voice_commands';
import { Colors } from '../../../styles';
import {
  FarsightTestConfig, Result, RootStackParamList, VisionTest,
} from '../../../types/global';
import Helpers from '../../../utils/helpers';
import useAudio from '../../useAudio';
import useVoice from '../../useVoice';

const visionTest = VisionTests.farsight as VisionTest<FarsightTestConfig>;
const voiceCommands = VoiceCommands.visionTests.farsight;

const useFarsightVisionTestController = (
  navigation: NativeStackNavigationProp<RootStackParamList, 'FarsightVisionTest'>,
) => {
  const audio = useAudio();
  const [setListening, { transcript, lastTranscriptTimestamp }] = useVoice();
  const [testHistory, setTestHistory] = useState<{
    testId: number,
    passed: boolean
  }[]>([]);
  const [_fails, setFails] = useState(0);
  const [currentTestId, setCurrentTestId] = useState<number | null>(null);
  const [testedStartTestId, setTestedStartTestId] = useState(false);
  const [currentSentence, setCurrentSentence] = useState('');
  const [
    highlightedButton,
    setHighlightedButton,
  ] = useState<null | number>(null);
  const [shouldGoToResults, setShouldGoToResults] = useState(false);
  const [countdownReason, setCountdownReason] = useState<'break' | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
    });
  }, [navigation, audio]);

  // Start/stop listening when app is fore-/backgrounded (needed only when countdown was changed).
  useFocusEffect(useCallback(() => {
    if (countdownReason === null) {
      setListening(true);
    }
    return () => setListening(false);
  }, [countdownReason]));

  const getNextTest = () => {
    let nextTestId = 0;
    if (currentTestId === null) {
      // User didn't test the start test id yet
      nextTestId = visionTest.testConfig.startTestId;
    } else if (currentTestId === visionTest.testConfig.startTestId && !testedStartTestId) {
      // User just tested the start test id for this test - continue if he passed, or fallback to testId 0 otherwise
      let passedLastTest = false;
      if (testHistory[0]) {
        passedLastTest = testHistory[0].passed;
      }
      if (passedLastTest) nextTestId = currentTestId + 1;
      else nextTestId = 0;
      setTestedStartTestId(true);
    } else {
      nextTestId = currentTestId + 1;
    }

    const nextSentenceId = Helpers.randomIntFromInterval(
      0,
      visionTest.testConfig.tests[nextTestId].sentences.length - 1,
    );

    setCurrentTestId(nextTestId);
    setCurrentSentence(visionTest.testConfig.tests[nextTestId].sentences[nextSentenceId].sentence);
    setCountdownReason(null);
    setHighlightedButton(null);
    setListening(true);
  };

  useEffect(() => {
    activateKeepAwake('visiontest');
    getNextTest();

    return () => deactivateKeepAwake('visiontest');
  }, []);

  const handleButtonPressed = (passed: boolean) => {
    if (currentTestId === null || countdownReason) return;

    if (testedStartTestId || currentTestId !== visionTest.testConfig.startTestId || passed) {
      // Don't record this result if this is the starting test and the user failed
      setTestHistory((prevTestHistory) => ([
        ...prevTestHistory,
        { testId: currentTestId, passed },
      ]));
    }

    // Highlight clicked button in green / red (depending on if the user was able to read the sentence / passed)
    setHighlightedButton(passed ? 0 : 1);

    if (!passed) {
      setFails((prevFails) => {
        const nextFails = prevFails + 1;
        if (nextFails === 2) {
          // If user failed two times already, go to results
          setShouldGoToResults(true);
        }
        setCountdownReason('break');
        setListening(false);
        return nextFails;
      });
    }

    if (currentTestId === visionTest.testConfig.tests.length - 1) {
      // When we're at the end of the test number list, go to results
      setShouldGoToResults(true);
    }
    setCountdownReason('break');
    setListening(false);
    audio.playSoundEffect(passed ? 'correctAnswer' : 'wrongAnswer');
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
    if (shouldGoToResults) {
      // Gets the successful test, sorted descending by the test id
      const lastSuccessfulTest = testHistory
        .filter((test) => test.passed)
        .sort((a, b) => b.testId - a.testId)[0];

      // Get corresponding result from config
      let result = Result.Bad;
      if (lastSuccessfulTest) {
        const sortedDescendingResults = visionTest.results
          .filter((res) => res.minScore !== undefined)
          .sort((a, b) => b.minScore! - a.minScore!);
        for (const possibleResult of sortedDescendingResults) {
          if (lastSuccessfulTest.testId + 1 >= possibleResult.minScore!) {
            result = possibleResult.result;
            break;
          }
        }
      }

      navigation.reset({
        index: 0,
        routes: [{
          name: 'Results',
          params: {
            result,
            details: [
              {
                results: new Array(8).fill(null).map((_v, idx) => {
                  let testLetter = 'G';
                  switch (idx) {
                    case 1:
                      testLetter = 'F';
                      break;
                    case 2:
                      testLetter = 'E';
                      break;
                    case 3:
                      testLetter = 'D';
                      break;
                    case 4:
                      testLetter = 'C';
                      break;
                    case 5:
                      testLetter = 'B';
                      break;
                    case 6:
                      testLetter = 'A';
                      break;
                    case 7:
                      testLetter = 'A+';
                      break;
                    default:
                      testLetter = 'G';
                  }

                  const test = testHistory.filter((item) => item.testId === idx)[0];
                  const element = {
                    description: testLetter,
                    descriptionColor: Helpers.getColorForResultLetter(testLetter),
                  };
                  if (test) {
                    return {
                      ...element,
                      rightColumn: test.passed ? '✓ Bestanden' : 'X Nicht bestanden',
                      rightColumnColor: test.passed ? Colors.green : Colors.red,
                    };
                  }
                  const startTest = testHistory.filter(
                    (item) => item.testId === visionTest.testConfig.startTestId,
                  )[0];
                  if (idx < visionTest.testConfig.startTestId
                    && startTest
                    && startTest.passed
                  ) {
                    // This test wasn't tested because the user passed the start test id
                    return {
                      ...element,
                      rightColumn: '✓ Bestanden', // not tested
                      rightColumnColor: Colors.green,
                    };
                  }
                  return {
                    ...element,
                    rightColumn: 'X Nicht bestanden', // not tested
                    rightColumnColor: Colors.red,
                  };
                }),
              },
            ],
          },
        }],
      });
    } else getNextTest();
  };

  const testNumberSize = currentTestId === null ? 0 : visionTest.testConfig.tests[currentTestId].size; // millimeters
  let countdownTime: number | undefined;
  if (countdownReason === 'break') countdownTime = AppConfig.countdownTimes.visionTestBreak;

  return {
    currentTestId,
    testNumberSize,
    countdownTime,
    highlightedButton,
    handleButtonPressed,
    handleCountdownFinished,
    currentSentence,
  };
};

export default useFarsightVisionTestController;
