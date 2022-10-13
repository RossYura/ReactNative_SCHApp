import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions, Image, StyleSheet, View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Text from '../../components/Text';
import Container from '../../components/Container';
import {
  ColorTestConfig, RootStackParamList, VisionTest,
} from '../../types/global';
import Footer from '../../components/Footer';
import { Colors, Spacing, Typography } from '../../styles';
import LongButton from '../../components/LongButton';
import VisionTests from '../../config/vision_tests';
import useColorVisionTestController from '../../hooks/controllers/VisionTests/Color';

const testImageSizeMultiplier = Dimensions.get('window').width > 375 ? 1 : 0.8;
const testImageSize = (Dimensions.get('window').width - Spacing.m * 2) * testImageSizeMultiplier;
const visionTest = VisionTests.color as VisionTest<ColorTestConfig>;
export default function ColorVisionTestScreen(
  props: NativeStackScreenProps<RootStackParamList, 'ColorVisionTest'>,
) {
  const { navigation } = props;
  const {
    currentTestId,
    possibleAnswers,
    countdownTime,
    highlightedButton,
    handleButtonPressed,
    handleCountdownFinished,
  } = useColorVisionTestController(navigation);

  return (
    <Container paddedFooter>
      <StatusBar style="auto" />
      <View style={styles.imageWrapper}>
        { currentTestId !== null && (
          <Image
            source={visionTest.testConfig.images[currentTestId].image}
            width={testImageSize}
            height={testImageSize}
          />
        )}
      </View>
      <View style={styles.bottomWrapper}>
        <Text style={styles.testText}>Wähle die Zahl aus, die oben zu sehen ist.</Text>
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonRow}>
            <LongButton
              title={possibleAnswers[0].toString()}
              onPress={() => handleButtonPressed(possibleAnswers[0])}
              containerStyle={{ ...styles.button, paddingRight: 8 }}
              green={
                highlightedButton !== null
                && highlightedButton.buttonId === 0
                && highlightedButton.highlight === 'green'
              }
              red={
                highlightedButton !== null
                && highlightedButton.buttonId === 0
                && highlightedButton.highlight === 'red'
              }
              largeTitle
            />
            <LongButton
              title={possibleAnswers[1].toString()}
              onPress={() => handleButtonPressed(possibleAnswers[1])}
              containerStyle={{ ...styles.button, paddingLeft: 8 }}
              green={
                highlightedButton !== null
                && highlightedButton.buttonId === 1
                && highlightedButton.highlight === 'green'
              }
              red={
                highlightedButton !== null
                && highlightedButton.buttonId === 1
                && highlightedButton.highlight === 'red'
              }
              largeTitle
            />
          </View>
          <View style={styles.buttonRow}>
            <LongButton
              title={possibleAnswers[2].toString()}
              onPress={() => handleButtonPressed(possibleAnswers[2])}
              containerStyle={{ ...styles.button, paddingRight: 8 }}
              green={
                highlightedButton !== null
                && highlightedButton.buttonId === 2
                && highlightedButton.highlight === 'green'
              }
              red={
                highlightedButton !== null
                && highlightedButton.buttonId === 2
                && highlightedButton.highlight === 'red'
              }
              largeTitle
            />
            <LongButton
              title="Keine"
              onPress={() => handleButtonPressed(null)}
              containerStyle={{ ...styles.button, paddingLeft: 8 }}
              green={
                highlightedButton !== null
                && highlightedButton.buttonId === 3
                && highlightedButton.highlight === 'green'
              }
              red={
                highlightedButton !== null
                && highlightedButton.buttonId === 3
                && highlightedButton.highlight === 'red'
              }
              largeTitle
            />
          </View>
        </View>
      </View>
      <Footer
        countdownTime={countdownTime}
        onCountdownFinished={handleCountdownFinished}
        hideCoins
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: testImageSize,
    height: testImageSize,
  },
  bottomWrapper: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Dimensions.get('window').width > 375 ? Spacing.l : Spacing.m,
  },
  testText: {
    color: Colors.purple,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: Typography.sizes.l,
  },
  buttonWrapper: {
    paddingTop: Spacing.m,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
  },
  buttonRow: {
    paddingTop: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: '50%',
  },
});
