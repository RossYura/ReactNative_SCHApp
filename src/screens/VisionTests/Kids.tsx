import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  Image, StyleSheet, TouchableOpacity, View, ViewStyle,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Text from '../../components/Text';
import Container from '../../components/Container';
import {
  KidsTestConfig, RootStackParamList, VisionTest,
} from '../../types/global';
import BigCard from '../../components/BigCard';
import Footer from '../../components/Footer';
import { Colors, Spacing, Typography } from '../../styles';
import LeftHand from '../../assets/images/illu/seh-check-allgemein/hand-links.png';
import RightHand from '../../assets/images/illu/seh-check-allgemein/hand-rechts.png';
import VisionTests from '../../config/vision_tests';
import Helpers from '../../utils/helpers';
import Correct from '../../assets/images/sehtestzeichen/landoltring-korrekt.svg';
import Wrong from '../../assets/images/sehtestzeichen/landoltring-falsch.svg';
import Speechbubble from '../../components/Speechbubble';
import useKidsVisionTestController from '../../hooks/controllers/VisionTests/Kids';

const visionTest = VisionTests.kids as VisionTest<KidsTestConfig>;

export default function KidsVisionTestScreen(
  props: NativeStackScreenProps<RootStackParamList, 'KidsVisionTest'>,
) {
  const { navigation } = props;
  const {
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
  } = useKidsVisionTestController(navigation);

  return (
    <Container style={testPhase === 'hand' || testPhase === 'story' ? styles.containerCard : undefined} paddedFooter>
      <StatusBar style="auto" />
      { testPhase === 'story' && (
        <BigCard
          image={visionTest.testConfig.stories[currentTest].image}
          title={visionTest.testConfig.stories[currentTest].title}
          description={visionTest.testConfig.stories[currentTest].description}
        />
      )}
      { testPhase === 'hand' && (
        <BigCard
          image={currentEye === 'right' ? LeftHand : RightHand}
          title={`Decke das ${currentEye === 'right' ? 'linke' : 'rechte'} Auge deines Kindes ab ...`}
          description={`Das Augenlid dabei nicht berühren.\n\nHinweis: Bewegt dein Kind den Kopf immer intuitiv weg, \
kann das bereits ein Anzeichen für eine schlechte Sehschärfe des ${currentEye === 'right' ? 'rechten' : 'linken'} \
Auges sein.`}
        />
      )}
      { testPhase === 'test' && (
        <>
          <View style={styles.landscapeImageWrapper}>
            <Image style={styles.landscapeImage} source={visionTest.testConfig.tests[currentTest].image} />
            { (ControlSymbol) && (
              <View style={styles.controlSymbolOuterWrapper}>
                <View style={styles.controlSymbolWrapper}>
                  <ControlSymbol width="100%" height="100%" />
                </View>
                <Speechbubble
                  text="Gesuchtes Testzeichen"
                  backgroundColor={Colors.green}
                  textColor={Colors.white}
                  style={styles.controlSymbolSpeechbubble}
                />
              </View>
            )}
            { (currentTest === 'shortsight' || currentTest === 'contrast') && (
              <View style={styles.testSymbolOuterWrapperSquare}>
                <View style={styles.testSymbolRow}>
                  {currentButtons.map((button, i) => {
                    if (i >= 2) return null;
                    const Symbol = visionTest.testConfig.tests[currentTest].options![button];
                    return (
                      <TouchableOpacity
                        style={styles.testSymbolWrapper}
                        onPress={() => handleButtonPressed(button)}
                        key={i}
                        activeOpacity={isBreak ? 1 : 0.2}
                      >
                        { highlightedButton === i && highlightType === 'correct' && (
                          <Correct />
                        )}
                        { highlightedButton === i && highlightType === 'wrong' && (
                          <Wrong />
                        )}
                        { highlightedButton !== i && (
                          <Symbol
                            width={currentTest === 'shortsight' ? Helpers.cmToDp(currentTestConfig / 10) : '100%'}
                            height={currentTest === 'shortsight' ? Helpers.cmToDp(currentTestConfig / 10) : '100%'}
                            opacity={currentTest === 'contrast' ? currentTestConfig : '100%'}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.testSymbolRow}>
                  {currentButtons.map((button, i) => {
                    if (i < 2) return null;
                    const Symbol = visionTest.testConfig.tests[currentTest].options![button];
                    return (
                      <TouchableOpacity
                        style={styles.testSymbolWrapper}
                        onPress={() => handleButtonPressed(button)}
                        key={i}
                        activeOpacity={isBreak ? 1 : 0.2}
                      >
                        { highlightedButton === i && highlightType === 'correct' && (
                          <Correct />
                        )}
                        { highlightedButton === i && highlightType === 'wrong' && (
                          <Wrong />
                        )}
                        { highlightedButton !== i && (
                          <Symbol
                            width={currentTest === 'shortsight' ? Helpers.cmToDp(currentTestConfig / 10) : '100%'}
                            height={currentTest === 'shortsight' ? Helpers.cmToDp(currentTestConfig / 10) : '100%'}
                            opacity={currentTest === 'contrast' ? currentTestConfig : '100%'}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
            { currentTest === 'color' && currentButtons.map((button, i) => {
              const Symbol = visionTest.testConfig.tests[currentTest].options![button];
              let extraStyle: ViewStyle = {
                left: 30,
                bottom: 30,
                width: '47.8%',
              };
              if (currentButtons.length === 2) {
                if (i === 1) {
                  extraStyle = {
                    right: 30,
                    top: '22.1%',
                    width: '40.9%',
                  };
                }
              } else if (i === 1) {
                extraStyle = {
                  right: 75,
                  top: '32.2%',
                  width: '32.8%',
                };
              } else if (i === 2) {
                extraStyle = {
                  right: 10,
                  top: 10,
                  width: '38.3%',
                };
              }
              return (
                <TouchableOpacity
                  style={[styles.testSymbolWrapperColor, extraStyle]}
                  onPress={() => handleButtonPressed(button)}
                  key={i}
                  activeOpacity={isBreak ? 1 : 0.2}
                >
                  { highlightedButton === i && highlightType === 'correct' && (
                    <Correct />
                  )}
                  { highlightedButton === i && highlightType === 'wrong' && (
                    <Wrong />
                  )}
                  { highlightedButton !== i && (
                    <Symbol
                      width="100%"
                      height="100%"
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.bottomWrapper}>
            { currentTestOption && (
            <Text style={styles.testText}>
              {visionTest.testConfig.tests[currentTest].text}
            </Text>
            )}
          </View>
        </>
      )}
      <Footer
        countdownTime={countdownTime}
        onCountdownFinished={handleCountdownFinished}
        hideCoins
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  containerCard: {
    paddingHorizontal: Spacing.m,
    justifyContent: 'flex-start',
    paddingTop: Dimensions.get('window').width > 375 ? Spacing.xxxl : Spacing.l,
  },
  landscapeImageWrapper: {
    flex: 1,
    width: Dimensions.get('window').width - Spacing.m * 2.5,
    overflow: 'hidden',
    borderRadius: 10,
  },
  landscapeImage: {
    width: undefined,
    height: '100%',
  },
  controlSymbolOuterWrapper: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: '37.2%',
    paddingHorizontal: 8,
  },
  controlSymbolWrapper: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 1000,
    borderColor: Colors.green,
    borderWidth: 4,
  },
  controlSymbolSpeechbubble: {
    marginTop: 10,
    width: 136,
    position: 'absolute',
    bottom: -35,
    left: -4,
  },
  testSymbolOuterWrapperSquare: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    width: Dimensions.get('window').width - Spacing.m * 2 - 30 * 2,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    height: undefined,
    aspectRatio: 1,
  },
  testSymbolRow: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  testSymbolWrapper: {
    width: '26.1%',
    height: undefined,
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 1000,
    borderColor: Colors.coolGray,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testSymbolWrapperColor: {
    position: 'absolute',
    height: undefined,
    aspectRatio: 1,
    backgroundColor: 'white',
    borderRadius: 1000,
    borderColor: Colors.coolGray,
    borderWidth: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomWrapper: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.s,
    paddingTop: 30,
  },
  testText: {
    color: Colors.purple,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: Typography.sizes.l,
  },
});
