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
import useFarsightVisionTestController from '../../hooks/controllers/VisionTests/Farsight';

export default function FarsightVisionTestScreen(
  props: NativeStackScreenProps<RootStackParamList, 'FarsightVisionTest'>,
) {
  const { navigation } = props;
  const {
    currentTestId,
    testNumberSize,
    countdownTime,
    highlightedButton,
    handleButtonPressed,
    handleCountdownFinished,
    currentSentence,
  } = useFarsightVisionTestController(navigation);

  return (
    <Container paddedFooter>
      <StatusBar style="auto" />
      <View style={styles.testSentenceWrapper}>
        { currentTestId !== null && (
        <Text style={{ ...styles.testSentence, fontSize: Helpers.cmToDp(testNumberSize / 10) }}>
          {currentSentence}
        </Text>
        )}
      </View>
      <View style={styles.bottomWrapper}>
        <Text style={styles.testText}>Kannst du den Satz lesen?</Text>
        <View style={styles.buttonWrapper}>
          <View style={styles.buttonRow}>
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
  testSentenceWrapper: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.m,
  },
  testSentence: {
    fontFamily: 'Outfit',
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
