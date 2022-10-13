import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Dimensions, StyleSheet, View,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useAudio from '../hooks/useAudio';
import { Colors, Spacing, Typography } from '../styles';
import { RootStackParamList } from '../types/global';
import CoinsButton from './CoinsButton';
import Intercom from './Intercom';
import Text from './Text';

interface FooterProps {
  countdownTime?: number;
  onCountdownFinished?: () => void;
  hideCoins?: boolean;
  hideIntercom?: boolean;
}
export default function Footer(props: FooterProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    countdownTime: passedCountdownTime, onCountdownFinished, hideCoins, hideIntercom,
  } = props;
  const audio = useAudio();

  const [countdownTime, setCountdownTime] = useState<number | null>(null);
  const [nextCountdownTime, setNextCountdownTime] = useState<number | null>(null);
  const insets = useSafeAreaInsets();

  /* When immediately setting the countdownTime prop to a different value (e.g. from 10, then on countdown end to 5),
  the countdown continues counting down from the original value (10). The two following effects bypass this behavior
  by first setting the countdown time to null on a change in order to remove the countdown from the component tree,
  then on the next render, set it to the actual value. */
  useEffect(() => {
    if (passedCountdownTime !== undefined) {
      setCountdownTime(null);
      setNextCountdownTime(passedCountdownTime);
    } else setCountdownTime(null);
  }, [passedCountdownTime]);

  useEffect(() => {
    if (nextCountdownTime !== null) {
      setCountdownTime(nextCountdownTime);
      setNextCountdownTime(null);
    }
  }, [nextCountdownTime]);

  const onClickCoinsButton = () => {
    audio.playSoundEffect('buttonPress');
    navigation.navigate('BuyCoinsModal');
  };

  return (
    <View style={[styles.footer, { height: 72 + insets.bottom, paddingBottom: insets.bottom }]}>
      { countdownTime !== null && (
        <CountdownCircleTimer
          isPlaying
          duration={countdownTime}
          colors={Colors.green as any}
          trailColor={Colors.light as any}
          strokeLinecap="square"
          onComplete={onCountdownFinished}
          size={48}
          strokeWidth={4}
        >
          {({ remainingTime }) => <Text style={styles.countdownText}>{remainingTime}</Text>}
        </CountdownCircleTimer>
      )}
      { ((countdownTime === undefined || countdownTime === null) && hideCoins !== true) && (
        <CoinsButton onPress={() => onClickCoinsButton()} />
      )}
      { !(countdownTime !== null)
      && !((countdownTime === undefined || countdownTime === null) && hideCoins !== true)
      && (
        <View />
      )}
      { !hideIntercom && (
        <Intercom />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: Dimensions.get('window').width,
    paddingHorizontal: Spacing.m,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  countdownText: {
    color: Colors.green,
    fontSize: Typography.sizes.m,
    fontWeight: 'bold',
  },
});
