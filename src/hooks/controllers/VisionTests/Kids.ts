import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import {
  useEffect, useLayoutEffect, useState,
} from 'react';
import { SvgProps } from 'react-native-svg';
import ExitButton from '../../../components/ExitButton';
import AppConfig from '../../../config/app_config';
import VisionTests from '../../../config/vision_tests';
import { Colors } from '../../../styles';
import {
  KidsTest,
  KidsTestConfig, KidsTestOption, Result, RootStackParamList, VisionTest,
} from '../../../types/global';
import Helpers from '../../../utils/helpers';
import useAudio from '../../useAudio';

const visionTest = VisionTests.kids as VisionTest<KidsTestConfig>;

type TestPhase = 'story' | 'hand' | 'test';
type TestHistoryItemWithPassed = {
  testId: number,
  passed: boolean
};
type TestHistoryItemWithAnswers = {
  testId: number,
  correctAnswer: KidsTestOption,
  userAnswer: KidsTestOption
};
type TestHistory = {
  shortsight: {
    left: TestHistoryItemWithAnswers[],
    right: TestHistoryItemWithAnswers[],
  },
  color: TestHistoryItemWithPassed[],
  contrast: TestHistoryItemWithPassed[],
};

const useKidsVisionTestController = (
  navigation: NativeStackNavigationProp<RootStackParamList, 'KidsVisionTest'>,
) => {
  const audio = useAudio();
  const [testPhase, setTestPhase] = useState<TestPhase>('story');
  const [currentTest, setCurrentTest] = useState<KidsTest | 'end'>('shortsight');
  const [currentTestId, setCurrentTestId] = useState(-1);
  const [testHistory, setTestHistory] = useState<TestHistory>({
    shortsight: { left: [], right: [] },
    color: [],
    contrast: [],
  });
  const [currentEye, setCurrentEye] = useState<'right' | 'left'>('right');
  const [shouldGoToResults, setShouldGoToResults] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState<null | 0 | 1 | 2 | 3>(null);
  const [highlightType, setHighlightType] = useState<'correct' | 'wrong'>('correct');
  const [currentTestConfig, setCurrentTestConfig] = useState(0); // size (mm), opacity, or number of ishihara images
  const [currentTestOption, setCurrentTestOption] = useState<KidsTestOption | null>(null);
  const [currentButtons, setCurrentButtons] = useState<KidsTestOption[]>([]);

  useEffect(() => {
    activateKeepAwake('visiontest');

    return () => deactivateKeepAwake('visiontest');
  });

  useLayoutEffect(() => {
    let title = 'Kurzsichtigkeit';
    if (currentTest === 'color') title = 'Farbsehen';
    else if (currentTest === 'contrast') title = 'Kontrastsehen';
    else if (currentTest === 'end') title = 'Kinder-Seh-Check';

    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
      title,
    });
  }, [navigation, audio, currentTest]);

  useEffect(() => {
    if (testPhase === 'story') {
      if (currentTest === 'shortsight') {
        audio.playTTS('kidsStory1');
      } else if (currentTest === 'color') {
        audio.playTTS('kidsStory2');
      } else if (currentTest === 'contrast') {
        audio.playTTS('kidsStory3');
      } else if (currentTest === 'end') {
        audio.playTTS('kidsStory4');
      }
    } else if (testPhase === 'hand') {
      if (currentEye === 'right') {
        audio.playTTS('kidsLeftHand');
      } else if (currentEye === 'left') {
        audio.playTTS('kidsRightHand');
      }
    }
  }, [currentTest, testPhase]);

  useEffect(() => {
    if (!shouldGoToResults) return;

    let totalScore = 0;
    let shortsightResultLeftScore = 0;
    let shortsightResultLeft = 'Schlecht';
    let shortsightResultLeftColor = Colors.red;
    let shortsightResultRightScore = 0;
    let shortsightResultRight = 'Schlecht';
    let shortsightResultRightColor = Colors.red;
    testHistory.shortsight.left.forEach((result) => {
      if (result.correctAnswer === result.userAnswer) shortsightResultLeftScore++;
    });
    testHistory.shortsight.right.forEach((result) => {
      if (result.correctAnswer === result.userAnswer) shortsightResultRightScore++;
    });
    totalScore += shortsightResultLeftScore + shortsightResultRightScore;
    if (shortsightResultLeftScore === 0) {
      shortsightResultLeft = 'Schlecht';
      shortsightResultLeftColor = Colors.red;
    }
    if (shortsightResultLeftScore === 1) {
      shortsightResultLeft = 'Mäßig';
      shortsightResultLeftColor = Colors.orange;
    }
    if (shortsightResultLeftScore === 2) {
      shortsightResultLeft = 'Gut';
      shortsightResultLeftColor = Colors.green;
    }
    if (shortsightResultLeftScore === 3) {
      shortsightResultLeft = 'Sehr gut';
      shortsightResultLeftColor = Colors.green;
    }
    if (shortsightResultRightScore === 0) {
      shortsightResultRight = 'Schlecht';
      shortsightResultRightColor = Colors.red;
    }
    if (shortsightResultRightScore === 1) {
      shortsightResultRight = 'Mäßig';
      shortsightResultRightColor = Colors.orange;
    }
    if (shortsightResultRightScore === 2) {
      shortsightResultRight = 'Gut';
      shortsightResultRightColor = Colors.green;
    }
    if (shortsightResultRightScore === 3) {
      shortsightResultRight = 'Sehr gut';
      shortsightResultRightColor = Colors.green;
    }

    let colorResult = 'Schlecht';
    let colorResultColor = Colors.red;
    if (testHistory.color[0].passed && testHistory.color[1].passed) {
      colorResult = 'Sehr gut';
      colorResultColor = Colors.green;
      totalScore += 2;
    } else if (testHistory.color[0].passed || testHistory.color[1].passed) {
      colorResult = 'Mäßig';
      colorResultColor = Colors.orange;
      totalScore += 1;
    }

    let contrastResult = 'Schlecht';
    let contrastResultColor = Colors.red;
    if (testHistory.contrast[0].passed && testHistory.contrast[1].passed) {
      contrastResult = 'Sehr gut';
      contrastResultColor = Colors.green;
      totalScore += 2;
    } else if (testHistory.contrast[0].passed || testHistory.contrast[1].passed) {
      contrastResult = 'Mäßig';
      contrastResultColor = Colors.orange;
      totalScore += 1;
    }

    let totalResult = Result.Warning;
    if (totalScore >= 10) totalResult = Result.VeryGood;
    else if (totalScore >= 9) totalResult = Result.Good;
    else if (totalScore >= 6) totalResult = Result.Bad;

    navigation.reset({
      index: 0,
      routes: [{
        name: 'Results',
        params: {
          result: totalResult,
          details: [
            {
              title: 'Sehen in der Ferne',
              results: [
                {
                  description: 'Rechts',
                  rightColumn: shortsightResultRight,
                  rightColumnColor: shortsightResultRightColor,
                },
                {
                  description: 'Links',
                  rightColumn: shortsightResultLeft,
                  rightColumnColor: shortsightResultLeftColor,
                },
              ],
            },
            {
              title: 'Farbsehen',
              results: [
                {
                  description: 'Rechts & Links',
                  rightColumn: colorResult,
                  rightColumnColor: colorResultColor,
                },
              ],
            },
            {
              title: 'Kontrastsehen',
              results: [
                {
                  description: 'Rechts & Links',
                  rightColumn: contrastResult,
                  rightColumnColor: contrastResultColor,
                },
              ],
            },
          ],
        },
      }],
    });
  }, [shouldGoToResults]);

  const getNextTest = () => {
    setCurrentTestId((currentCurrentTestId) => {
      const nextTestId = currentCurrentTestId + 1;
      const nextTestConfig = visionTest.testConfig.tests[currentTest].config![nextTestId];
      const testOptions = visionTest.testConfig.tests[currentTest].options!;
      const correctOption = visionTest.testConfig.tests[currentTest].correctOption!;
      const nextButtons: KidsTestOption[] = [];
      let buttonCount = 4;
      if (currentTest === 'color') {
        if (nextTestId === 0) buttonCount = 2;
        else buttonCount = 3;
      }
      for (let i = 0; i < buttonCount; i++) {
        let nextButton: KidsTestOption | null = null;
        while (nextButton === null || nextButtons.includes(nextButton)) {
          const nextButtonId = Helpers.randomIntFromInterval(0, 3);
          nextButton = Object.keys(testOptions)[nextButtonId] as KidsTestOption;
        }
        nextButtons.push(nextButton);
      }
      if (!nextButtons.includes(correctOption)) {
        nextButtons[Helpers.randomIntFromInterval(0, buttonCount - 1)] = correctOption;
      }
      setCurrentTestConfig(nextTestConfig);
      setCurrentButtons(nextButtons);
      setCurrentTestOption(correctOption);
      return nextTestId;
    });
  };

  const handleButtonPressed = (pressedOption: KidsTestOption) => {
    if (isBreak) return;
    setTestHistory((prevTestHistory) => ({
      ...prevTestHistory,
      shortsight: currentTest === 'shortsight' ? {
        ...prevTestHistory.shortsight,
        right: currentEye === 'right' ? [
          ...prevTestHistory.shortsight.right,
          {
            testId: currentTestId,
            correctAnswer: currentTestOption!,
            userAnswer: pressedOption,
          },
        ] : prevTestHistory.shortsight.right,
        left: currentEye === 'left' ? [
          ...prevTestHistory.shortsight.left,
          {
            testId: currentTestId,
            correctAnswer: currentTestOption!,
            userAnswer: pressedOption,
          },
        ] : prevTestHistory.shortsight.left,
      } : prevTestHistory.shortsight,
      color: currentTest === 'color' ? [
        ...prevTestHistory.color,
        {
          testId: currentTestId,
          passed: pressedOption === currentTestOption,
        },
      ] : prevTestHistory.color,
      contrast: currentTest === 'contrast' ? [
        ...prevTestHistory.contrast,
        {
          testId: currentTestId,
          passed: pressedOption === currentTestOption,
        },
      ] : prevTestHistory.contrast,
    }));

    if (pressedOption === currentTestOption) {
      setHighlightType('correct');
      audio.playSoundEffect('correctAnswer');
    } else {
      setHighlightType('wrong');
      audio.playSoundEffect('wrongAnswer');
    }

    console.log(pressedOption, currentTestOption);

    setHighlightedButton(currentButtons.indexOf(pressedOption) as 0 | 1 | 2 | 3);

    setIsBreak(true);
  };

  const handleCountdownFinished = () => {
    if (testPhase === 'story') {
      setCurrentEye('right');
      if (currentTest === 'shortsight') {
        setTestPhase('hand');
      } else {
        setCurrentTestId(-1);
        setTestPhase('test');
        if (currentTest !== 'end') getNextTest();
      }
    } else if (testPhase === 'hand') {
      setCurrentTestId(-1);
      setTestPhase('test');
      getNextTest();
    } else if (isBreak) {
      setHighlightedButton(null);
      setIsBreak(false);
      if (currentTestId < visionTest.testConfig.tests[currentTest].config!.length - 1) {
        // There's still more tests for the current vision test
        getNextTest();
      } else {
        // Last test for this vision test
        if (currentTest === 'shortsight' && currentEye === 'right') {
          setTestPhase('hand');
          setCurrentEye('left');
          return;
        }
        setTestPhase('story');
        let nextTest: 'color' | 'contrast' | 'end' = 'color';
        if (currentTest === 'color') nextTest = 'contrast';
        else if (currentTest === 'contrast') nextTest = 'end';
        setCurrentTest(nextTest);
      }
    } else if (currentTest === 'end' && testPhase === 'test') {
      setShouldGoToResults(true);
    }
  };

  let countdownTime: number | undefined;
  if (testPhase === 'story') countdownTime = 12;
  else if (testPhase === 'hand') countdownTime = 15;
  else if (isBreak) countdownTime = AppConfig.countdownTimes.visionTestBreak;
  else if (currentTest === 'end' && testPhase === 'test') countdownTime = 5;

  let ControlSymbol: React.FC<SvgProps> | null = null;
  if (currentTestOption) {
    if (currentTest === 'color') {
      ControlSymbol = visionTest.testConfig.tests.color.controlSymbol!;
    } else if (currentTest !== 'end') {
      ControlSymbol = visionTest.testConfig.tests[currentTest].options![currentTestOption];
    }
  }

  return {
    highlightType,
    currentTestConfig,
    currentTest,
    currentTestOption,
    currentEye,
    currentButtons,
    countdownTime,
    highlightedButton,
    testPhase,
    isBreak,
    handleButtonPressed,
    handleCountdownFinished,
    ControlSymbol,
  };
};

export default useKidsVisionTestController;
