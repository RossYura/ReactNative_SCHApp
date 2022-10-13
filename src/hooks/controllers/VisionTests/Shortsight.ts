import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import ExitButton from '../../../components/ExitButton';
import AppConfig from '../../../config/app_config';
import VisionTests from '../../../config/vision_tests';
import { Colors } from '../../../styles';
import {
  ShortsightTestConfig, Result, ResultDetails, RootStackParamList, VisionTest,
} from '../../../types/global';
import Helpers from '../../../utils/helpers';
import useAudio from '../../useAudio';
import useVoice from '../../useVoice';
// import useSound from '../../useSound';

const visionTest = VisionTests.shortsight as VisionTest<ShortsightTestConfig>;
const testNumbers = Helpers.generateTestNumbers();

const useShortsightVisionTestController = (
  navigation: NativeStackNavigationProp<RootStackParamList, 'ShortsightVisionTest'>,
) => {
  const audio = useAudio();
  // const sound = useSound();
  const [setListening, { transcript, lastTranscriptTimestamp, destroyed }] = useVoice();
  type TestHistoryItem = {
    testId: number,
    correctAnswer: number,
    userAnswer: number
  };
  const [testHistory, setTestHistory] = useState<{
    right: TestHistoryItem[],
    left: TestHistoryItem[],
  }>({ right: [], left: [] });
  const [fails, setFails] = useState(0);
  const [currentTestId, setCurrentTestId] = useState<number | null>(null);
  const [testedStartTestId, setTestedStartTestId] = useState(false);
  const [testedAPlus, setTestedAPlus] = useState(false);
  const [possibleAnswers, setPossibleAnswers] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [
    highlightedButton,
    setHighlightedButton,
  ] = useState<null | { buttonId: number, highlight: 'red' | 'green' }>(null);
  const [shouldGoToResults, setShouldGoToResults] = useState(false);
  const [currentEye, setCurrentEye] = useState<'right' | 'left'>('right');
  const [countdownReason, setCountdownReason] = useState<'hand' | 'break' | null>('hand');
  const [needPlay, setNeedPlay] = useState<{
    required: boolean,
    value?: boolean,
  }>({
    required: false,
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
    });
  }, [navigation, audio]);

  useEffect(() => {
    if (destroyed && needPlay.required) {
      audio.playSoundEffect(needPlay.value ? 'correctAnswer' : 'wrongAnswer');
    }
  }, [destroyed, needPlay]);

  useEffect(() => {
    audio.playTTS('shortsightLeftHand');
    activateKeepAwake('visiontest');

    return () => deactivateKeepAwake('visiontest');
  }, []);

  // Start/stop listening when app is fore-/backgrounded (needed only when countdown was changed).
  useFocusEffect(useCallback(() => {
    if (countdownReason === null) {
      setListening(true);
    }
    return () => setListening(false);
  }, [countdownReason]));

  const getNextTest = () => {
    let nextTestId = 0;
    let isNextAPlusTest = false;
    if (currentTestId === null) {
      // User didn't test the start test id yet
      nextTestId = visionTest.testConfig.startTestId;
    } else if (currentTestId === visionTest.testConfig.startTestId && !testedStartTestId) {
      // User just tested the start test id for this test - continue if he passed, or fallback to testId 0 otherwise
      let passedLastTest = false;
      if (testHistory[currentEye][0]) {
        passedLastTest = testHistory[currentEye][0].correctAnswer === testHistory[currentEye][0].userAnswer;
      }
      if (passedLastTest) nextTestId = currentTestId + 1;
      else nextTestId = 0;
      setTestedStartTestId(true);
    } else if (currentTestId === visionTest.testConfig.sizes.length - 1 && !testedAPlus) {
      nextTestId = currentTestId;
      setTestedAPlus(true);
      isNextAPlusTest = true;
    } else {
      nextTestId = currentTestId + 1;
    }

    const nextPossibleAnswers: [number, number, number, number] = [
      testNumbers[nextTestId + (isNextAPlusTest ? 1 : 0)],
      ...Helpers.generateRemainingTestAnswerNumbers(testNumbers[nextTestId + (isNextAPlusTest ? 1 : 0)]),
    ];

    setCurrentTestId(nextTestId);
    setPossibleAnswers(Helpers.shuffleArray(nextPossibleAnswers));
    setCountdownReason(null);
    setHighlightedButton(null);
    setListening(true);
  };

  const handleButtonPressed = (answer: number) => {
    if (currentTestId === null || countdownReason) return;

    let correctAnswer = testNumbers[currentTestId];
    if (currentTestId === visionTest.testConfig.sizes.length - 1 && testedAPlus) {
      correctAnswer = testNumbers[currentTestId + 1];
    }

    if (testedStartTestId || currentTestId !== visionTest.testConfig.startTestId || correctAnswer === answer) {
      // Don't record this result if this is the starting test and the user failed
      setTestHistory((prevTestHistory) => ({
        left: currentEye === 'left'
          ? [...prevTestHistory.left, { testId: currentTestId, correctAnswer, userAnswer: answer }]
          : prevTestHistory.left,
        right: currentEye === 'right'
          ? [...prevTestHistory.right, { testId: currentTestId, correctAnswer, userAnswer: answer }]
          : prevTestHistory.right,
      }));
    }

    // Highlight clicked button in green / red for user to see if the given answer was correct
    let answerId = 0;
    if (answer !== null) answerId = possibleAnswers.indexOf(answer);
    setHighlightedButton({
      buttonId: answerId,
      highlight: answer === correctAnswer ? 'green' : 'red',
    });

    if (answer !== correctAnswer) {
      setFails((prevFails) => {
        const nextFails = prevFails + 1;
        if (nextFails === 2) {
          // If user failed two times already, go to next eye / results
          if (currentEye === 'left') {
            setShouldGoToResults(true);
          }
          // Next eye handled by countdown finished function
        }
        setCountdownReason('break');
        setListening(false);
        return nextFails;
      });
    }

    if (currentTestId === visionTest.testConfig.sizes.length - 1) {
      if (!testedAPlus) {
        // User needs to test A Plus again (handled by countdown handler)
      } else {
        // When we're at the end of the test number list, go to next eye / results
        // eslint-disable-next-line no-lonely-if
        if (currentEye === 'left') {
          setShouldGoToResults(true);
        }
        // Next eye handled by countdown finished function
      }
    }
    setCountdownReason('break');
    setListening(false);
    setNeedPlay({
      required: true,
      value: answer === correctAnswer,
    });
    setTimeout(() => {
      setNeedPlay({ required: false });
    }, 100);
  };

  useEffect(() => {
    if (transcript) {
      const parsedNumber = Helpers.checkVoiceCommandForNumbers(transcript);
      if (parsedNumber !== null && possibleAnswers.includes(parsedNumber)) {
        handleButtonPressed(parsedNumber);
      }
    }
  }, [lastTranscriptTimestamp]);

  const handleCountdownFinished = () => {
    if (shouldGoToResults) {
      // Gets all successful tests for both eyes, sorted descending by the test id
      const lastSuccessfulTests = {
        right: testHistory.right
          .filter((test) => test.correctAnswer === test.userAnswer)
          .sort((a, b) => b.testId - a.testId),
        left: testHistory.left
          .filter((test) => test.correctAnswer === test.userAnswer)
          .sort((a, b) => b.testId - a.testId),
      };
      let lastSuccessfulTest: TestHistoryItem | null = null;
      let lastSuccessfulTestEye: 'right' | 'left' = 'right';

      // Now, get the worse test id from the left and right eye -> this is the result score (+1)
      if (lastSuccessfulTests.right.length && lastSuccessfulTests.left.length) {
        [lastSuccessfulTest] = lastSuccessfulTests.right;
        if (lastSuccessfulTest === null || lastSuccessfulTest.testId > lastSuccessfulTests.left[0].testId) {
          [lastSuccessfulTest] = lastSuccessfulTests.left;
          lastSuccessfulTestEye = 'left';
        }
      }

      const lastTestId = visionTest.testConfig.sizes.length - 1;
      if (lastSuccessfulTest && lastSuccessfulTest.testId === lastTestId) {
        const aPlusTestsLeft = lastSuccessfulTests.left.filter((test) => test.testId === lastTestId);
        const aPlusTestsRight = lastSuccessfulTests.right.filter((test) => test.testId === lastTestId);
        let passedAPlus = true;
        if (aPlusTestsLeft.length > 1 && aPlusTestsRight.length > 1) {
          for (const aPlusTest of aPlusTestsLeft) {
            if (aPlusTest.correctAnswer !== aPlusTest.userAnswer) {
              passedAPlus = false;
              break;
            }
          }
          if (passedAPlus) {
            for (const aPlusTest of aPlusTestsRight) {
              if (aPlusTest.correctAnswer !== aPlusTest.userAnswer) {
                passedAPlus = false;
                break;
              }
            }
          }
        } else passedAPlus = false;
        if (!passedAPlus) {
          // User tested A Plus twice, but didn't pass twice - A is best test
          [lastSuccessfulTest] = lastSuccessfulTests[lastSuccessfulTestEye]
            .filter((test) => test.testId !== lastTestId)
            .sort((a, b) => b.testId - a.testId);
        }
      }

      // Get corresponding result from config
      let result = Result.Warning;
      if (lastSuccessfulTest !== null) {
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

                  const rightTest = testHistory.right.filter((item) => item.testId === idx)[0];
                  const leftTest = testHistory.left.filter((item) => item.testId === idx)[0];
                  let element: Partial<ResultDetails[number]['results'][number]> = {
                    description: testLetter,
                    descriptionColor: Helpers.getColorForResultLetter(testLetter),
                  };

                  if (rightTest) {
                    let passed = rightTest.userAnswer === rightTest.correctAnswer;
                    const aPlusTests = testHistory.right.filter((i) => i.testId === lastTestId);
                    if (idx === lastTestId && aPlusTests.length > 1) {
                      passed = aPlusTests[0].correctAnswer === aPlusTests[0].userAnswer
                        && aPlusTests[1].correctAnswer === aPlusTests[1].userAnswer;
                    }
                    element = {
                      ...element,
                      rightColumn: passed ? '✓ Rechts' : 'X Rechts',
                      rightColumnColor: passed ? Colors.green : Colors.red,
                    };
                  } else {
                    const startTest = testHistory.right.filter(
                      (item) => item.testId === visionTest.testConfig.startTestId,
                    )[0];
                    if (idx < visionTest.testConfig.startTestId
                      && startTest
                      && startTest.correctAnswer === startTest.userAnswer
                    ) {
                      // This test wasn't tested because the user passed the start test id
                      element = {
                        ...element,
                        rightColumn: '✓ Rechts', // not tested
                        rightColumnColor: Colors.green,
                      };
                    } else {
                      element = {
                        ...element,
                        rightColumn: 'X Rechts', // not tested
                        rightColumnColor: Colors.red,
                      };
                    }
                  }

                  if (leftTest) {
                    let passed = leftTest.userAnswer === leftTest.correctAnswer;
                    const aPlusTests = testHistory.left.filter((i) => i.testId === lastTestId);
                    if (idx === lastTestId && aPlusTests.length > 1) {
                      passed = aPlusTests[0].correctAnswer === aPlusTests[0].userAnswer
                        && aPlusTests[1].correctAnswer === aPlusTests[1].userAnswer;
                    }
                    element = {
                      ...element,
                      leftColumn: passed ? '✓ Links' : 'X Links',
                      leftColumnColor: passed ? Colors.green : Colors.red,
                    };
                  } else {
                    const startTest = testHistory.left.filter(
                      (item) => item.testId === visionTest.testConfig.startTestId,
                    )[0];
                    if (idx < visionTest.testConfig.startTestId
                      && startTest
                      && startTest.correctAnswer === startTest.userAnswer
                    ) {
                      // This test wasn't tested because the user passed the start test id
                      element = {
                        ...element,
                        leftColumn: '✓ Links', // not tested
                        leftColumnColor: Colors.green,
                      };
                    } else {
                      element = {
                        ...element,
                        leftColumn: 'X Links', // not tested
                        leftColumnColor: Colors.red,
                      };
                    }
                  }

                  return element;
                }),
              },
            ],
          },
        }],
      });
    } else {
      // eslint-disable-next-line no-lonely-if
      if (
        countdownReason === 'break'
        && currentEye === 'right'
        && (fails === 2 || (currentTestId === visionTest.testConfig.sizes.length - 1 && testedAPlus))
      ) {
        // should go to next eye
        setTestedStartTestId(false);
        setTestedAPlus(false);
        setCurrentEye('left');
        audio.playTTS('shortsightRightHand');
        setCountdownReason('hand');
        setFails(0);
        setCurrentTestId(null);
      } else getNextTest();
    }
  };

  const testNumberSize = currentTestId === null ? 0 : visionTest.testConfig.sizes[currentTestId]; // millimeters
  let countdownTime: number | undefined;
  if (countdownReason === 'hand') countdownTime = AppConfig.countdownTimes.showHand;
  else if (countdownReason === 'break') countdownTime = AppConfig.countdownTimes.visionTestBreak;

  let currentTestNumber = testNumbers[currentTestId || 0];
  if (currentTestId === visionTest.testConfig.sizes.length - 1 && testedAPlus) {
    currentTestNumber = testNumbers[currentTestId + 1];
  }

  return {
    currentTestNumber,
    currentTestId,
    currentEye,
    possibleAnswers,
    testNumberSize,
    countdownTime,
    countdownReason,
    highlightedButton,
    handleButtonPressed,
    handleCountdownFinished,
  };
};

export default useShortsightVisionTestController;
