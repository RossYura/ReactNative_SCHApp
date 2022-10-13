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
import BigCard from '../../components/BigCard';
import LeftHand from '../../assets/images/illu/seh-check-allgemein/hand-links.png';
import RightHand from '../../assets/images/illu/seh-check-allgemein/hand-rechts.png';
import Correct from '../../assets/images/sehtestzeichen/landoltring-korrekt.svg';
import Wrong from '../../assets/images/sehtestzeichen/landoltring-falsch.svg';
import LandoltController from '../../components/LandoltController';
import useLandoltVisionTestController from '../../hooks/controllers/VisionTests/Landolt';

export default function LandoltVisionTestScreen(
  props: NativeStackScreenProps<RootStackParamList, 'LandoltVisionTest'>,
) {
  const { navigation } = props;
  const {
    currentTestId,
    currentEye,
    currentPosition,
    testCircleSize,
    lastClickedPosition,
    countdownTime,
    countdownReason,
    userFeedbackSymbol,
    handleNumberClicked,
    handleCountdownFinished,
    TestCircle,
  } = useLandoltVisionTestController(navigation);

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
          { currentTestId !== null && currentPosition !== null && (
          <View style={styles.interfaceControllerWrapper}>
            <LandoltController
              width="100%"
              height="100%"
              onClickNumber={handleNumberClicked}
              disabledNumber={countdownReason === 'break' ? lastClickedPosition : null}
              noClicking={countdownReason === 'break'}
            />
            { countdownReason !== 'break' ? (
              <View style={{ ...styles.testCircleWrapper, width: testCircleSize, height: testCircleSize }}>
                <TestCircle width="100%" height="100%" />
              </View>
            ) : (
              <View style={styles.userFeedbackWrapper}>
                { userFeedbackSymbol === 'check' && <Correct width="100%" height="100%" viewBox="0 0 48 48" />}
                { userFeedbackSymbol === 'times' && <Wrong width="100%" height="100%" viewBox="0 0 48 48" />}
              </View>
            )}
          </View>
          )}
          <View style={styles.bottomWrapper}>
            <Text style={styles.testText}>
              {'Siehst du die Öffnung im kleinen Ring?\n\
Dann markiere die entsprechende Position am großen Ring.'}
            </Text>
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
  interfaceControllerWrapper: {
    flex: 1,
    width: Dimensions.get('window').width > 375 ? '100%' : '90%',
    paddingHorizontal: Spacing.m,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testCircleWrapper: {
    position: 'absolute',
  },
  userFeedbackWrapper: {
    position: 'absolute',
    width: 48,
    height: 48,
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
    paddingTop: Spacing.m,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: '50%',
  },
});
