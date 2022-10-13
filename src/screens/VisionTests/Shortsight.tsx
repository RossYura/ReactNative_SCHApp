import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  StyleSheet, View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Text from '../../components/Text';
import Container from '../../components/Container';
import { RootStackParamList } from '../../types/global';
import Footer from '../../components/Footer';
import { Colors, Spacing, Typography } from '../../styles';
import LongButton from '../../components/LongButton';
import Helpers from '../../utils/helpers';
import BigCard from '../../components/BigCard';
import LeftHand from '../../assets/images/illu/seh-check-allgemein/hand-links.png';
import RightHand from '../../assets/images/illu/seh-check-allgemein/hand-rechts.png';
import useShortsightVisionTestController from '../../hooks/controllers/VisionTests/Shortsight';

export default function ShortsightVisionTestScreen(
  props: NativeStackScreenProps<RootStackParamList, 'ShortsightVisionTest'>,
) {
  const { navigation } = props;
  const {
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
  } = useShortsightVisionTestController(navigation);

  return (
    <Container style={countdownReason === 'hand' ? styles.containerHand : undefined} paddedFooter>
      <StatusBar style="auto" />
      { countdownReason === 'hand' ? (
        <BigCard
          image={currentEye === 'right' ? LeftHand : RightHand}
          title={`Halte dir mit der ${currentEye === 'right' ? 'linken' : 'rechten'} Hand das \
${currentEye === 'right' ? 'linke' : 'rechte'} Auge zu ...`}
          description={`Das ${currentEye === 'right' ? 'linke' : 'rechte'} Auge nicht zukneifen und beide Augen \
möglichst entspannen.`}
        />
      ) : (
        <>
          <View style={styles.testNumberWrapper}>
            { currentTestId !== null && (
            <Text style={{ ...styles.testNumber, fontSize: Helpers.cmToDp(testNumberSize / 10) * 2 }}>
              {currentTestNumber.toString()}
            </Text>
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
                  title={possibleAnswers[3].toString()}
                  onPress={() => handleButtonPressed(possibleAnswers[3])}
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
        </>
      ) }
      <Footer
        countdownTime={countdownTime}
        onCountdownFinished={handleCountdownFinished}
        hideCoins
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  containerHand: {
    paddingHorizontal: Spacing.m,
    justifyContent: 'flex-start',
    paddingTop: Dimensions.get('window').width > 375 ? Spacing.xxxl : Spacing.l,
  },
  testNumberWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testNumber: {
    fontFamily: 'Optician Sans',
  },
  bottomWrapper: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.l,
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
