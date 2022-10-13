import React, { useEffect, useLayoutEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Container from '../components/Container';
import { RootStackParamList } from '../types/global';
import { Spacing } from '../styles';
import Helpers from '../utils/helpers';
import BigCard from '../components/BigCard';
import InfoSymbol from '../assets/images/illu/seh-check-allgemein/description.png';
import Footer from '../components/Footer';
import VisionTests from '../config/vision_tests';
import AppConfig from '../config/app_config';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';
import ExitButton from '../components/ExitButton';

export default function DescriptionScreen(props: NativeStackScreenProps<RootStackParamList, 'Description'>) {
  const { navigation } = props;
  const audio = useAudio();
  const visionTest = useStore((state) => state.visionTest);
  const headerHeight = Helpers.getHeaderHeight(useSafeAreaInsets());

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
    });
  }, [navigation, audio]);

  useEffect(() => {
    const { ttsKey } = VisionTests[visionTest!].descriptionScreen!;
    if (ttsKey) audio.playTTS(ttsKey);

    return () => audio.stopTTS();
  }, []);

  return (
    <Container style={[{ paddingBottom: headerHeight }, styles.container]}>
      <StatusBar style="auto" />
      <BigCard
        image={InfoSymbol}
        title={VisionTests[visionTest!].descriptionScreen!.title}
        description={VisionTests[visionTest!].descriptionScreen!.text}
      />
      <Footer
        countdownTime={AppConfig.countdownTimes.descriptionScreen}
        onCountdownFinished={() => {
          console.log(visionTest);
          navigation.navigate(VisionTests[visionTest!].mainScreenName);
          audio.stopTTS();
        }}
        hideCoins
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.m,
    justifyContent: 'flex-start',
    paddingTop: Dimensions.get('window').width > 375 ? Spacing.xxxl : Spacing.l,
  },
});
