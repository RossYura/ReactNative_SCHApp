import React, { useEffect } from 'react';
import {
  Image, StyleSheet, TouchableWithoutFeedback, View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types/global';
import Text from '../components/Text';
import { Colors, Spacing, Typography } from '../styles';
import Gift from '../assets/images/illu/store/coin-geschenk.png';
import LongButton from '../components/LongButton';
import CoinsButton from '../components/CoinsButton';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';

export default function GiftModalScreen(props: NativeStackScreenProps<RootStackParamList, 'GiftModal'>) {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const audio = useAudio();
  const addCoins = useStore((state) => state.addCoins);

  const onPressHandler = () => {
    audio.playSoundEffect('buttonPress');
    navigation.goBack();
  };

  useEffect(() => {
    audio.playSoundEffect('dailyGift');
    setTimeout(() => {
      addCoins(10);
      audio.playSoundEffect('receiveCoins');
    }, 500);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
      <BlurView style={styles.container} intensity={10}>
        <View style={styles.wrapper}>
          <TouchableWithoutFeedback>
            <View style={styles.innerWrapper}>
              <Text style={styles.title}>{'Tägliches Geschenk'.toUpperCase()}</Text>
              <Text style={styles.description}>
                {'Du hast 10 Coins erhalten. Coins kannst du dazu verwenden, neue Seh-Checks oder Gefährten \
freizuschalten.'}
              </Text>
              <Image source={Gift} style={styles.gift} />
              <LongButton title="Weiter" onPress={onPressHandler} green />
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={{ ...styles.bottomWrapper, marginBottom: insets.bottom }}>
          <View style={styles.infoWrapper}>
            <Feather name="info" size={24} color={Colors.white} />
            <Text style={styles.infoText}>
              Info: Komme morgen wieder, um mehr Coins zu erhalten oder erwerbe Coins im Store.
            </Text>
          </View>
          <CoinsButton containerStyle={styles.coinsButton} smallerAnimationInset />
        </View>
      </BlurView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: Spacing.m,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerWrapper: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    padding: Spacing.l,
  },
  title: {
    fontSize: Typography.sizes.m,
    color: Colors.purple,
  },
  description: {
    fontSize: Typography.sizes.m,
    marginTop: Spacing.m,
    color: Colors.gray,
    textAlign: 'center',
  },
  gift: {
    aspectRatio: 1,
    width: '45%',
    height: undefined,
  },
  bottomWrapper: {
    bottom: 24,
    left: 0,
    position: 'absolute',
    display: 'flex',
    paddingHorizontal: Spacing.m,
    width: '100%',
  },
  infoWrapper: {
    marginBottom: Spacing.m,
    display: 'flex',
    flexDirection: 'row',
  },
  infoText: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    marginLeft: Spacing.s,
    flex: 1,
    flexWrap: 'wrap',
  },
  coinsButton: {

  },
});
