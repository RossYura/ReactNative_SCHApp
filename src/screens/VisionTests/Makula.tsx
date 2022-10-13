import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions, StyleSheet, View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Text from '../../components/Text';
import Container from '../../components/Container';
import { RootStackParamList } from '../../types/global';
import BigCard from '../../components/BigCard';
import Footer from '../../components/Footer';
import { Colors, Spacing, Typography } from '../../styles';
import LeftHand from '../../assets/images/illu/seh-check-allgemein/hand-links.png';
import RightHand from '../../assets/images/illu/seh-check-allgemein/hand-rechts.png';
import TestImage from '../../assets/images/sehtestzeichen/amslergitter.svg';
import LongButton from '../../components/LongButton';
import useMakulaVisionTestController from '../../hooks/controllers/VisionTests/Makula';

const testImageSizeMultiplier = Dimensions.get('window').width > 375 ? 1 : 0.8;
const testImageSize = (Dimensions.get('window').width - Spacing.m * 2) * testImageSizeMultiplier;

export default function MakulaVisionTestScreen(
  props: NativeStackScreenProps<RootStackParamList, 'MakulaVisionTest'>,
) {
  const { navigation } = props;
  const {
    countdownReason,
    countdownTime,
    currentEye,
    highlightedButton,
    handleButtonPressed,
    handleCountdownFinished,
  } = useMakulaVisionTestController(navigation);

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
          <View style={styles.imageWrapper}>
            <TestImage width={testImageSize} height={testImageSize} />
          </View>
          <View style={styles.bottomWrapper}>
            <Text style={styles.testText}>
              Sieh auf den Punkt in der Mitte. Siehst du alle Linien gleichermaßen Schwarz und ohne Verzerrung?
            </Text>
            <View style={styles.buttonWrapper}>
              <LongButton
                title="Ja"
                onPress={() => handleButtonPressed(true)}
                containerStyle={{ ...styles.button, paddingRight: 8 }}
                green={highlightedButton === 0}
                largeTitle
              />
              <LongButton
                title="Nein"
                onPress={() => handleButtonPressed(false)}
                containerStyle={{ ...styles.button, paddingLeft: 8 }}
                red={highlightedButton === 1}
                largeTitle
              />
            </View>
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
  containerHand: {
    paddingHorizontal: Spacing.m,
    justifyContent: 'flex-start',
    paddingTop: Dimensions.get('window').width > 375 ? Spacing.xxxl : Spacing.l,
  },
  imageWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    width: '50%',
  },
});
