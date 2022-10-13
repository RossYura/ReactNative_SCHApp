import React, { useEffect, useLayoutEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import shallow from 'zustand/shallow';
import { useIsFocused } from '@react-navigation/native';
import Container from '../components/Container';
import { RootStackParamList } from '../types/global';
import { Spacing } from '../styles';
import Helpers from '../utils/helpers';
import BigCard from '../components/BigCard';
import Speaker from '../assets/images/illu/tutorial/lautsprecher-test.png';
import Footer from '../components/Footer';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';
import ExitButton from '../components/ExitButton';
import useTimeout from '../hooks/useTimeout';

export default function SpeakerTestScreen(props: NativeStackScreenProps<RootStackParamList, 'SpeakerTest'>) {
  const { navigation } = props;
  const audio = useAudio();
  const focused = useIsFocused();
  const {
    visionTest,
    speechRecognitionActivated,
  } = useStore((state) => ({
    visionTest: state.visionTest,
    speechRecognitionActivated: state.speechRecognitionActivated,
  }), shallow);
  const headerHeight = Helpers.getHeaderHeight(useSafeAreaInsets());

  useTimeout(() => focused ? audio.playTTS('tutorialSpeakerTest') : null, 750);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
    });
  }, [navigation, audio]);

  useEffect(() => () => {
    audio.stopTTS();
  }, []);

  return (
    <Container style={[{ paddingBottom: headerHeight }, styles.container]}>
      <StatusBar style="auto" />
      <BigCard
        image={Speaker}
        title="Schalte deine Lautsprecher an ..."
        description="... und stelle eine angenehme Lautstärke ein."
      />
      <Footer
        hideCoins
        countdownTime={10}
        onCountdownFinished={() => {
          let nextScreen: 'MicActivate' | 'Aid' = 'MicActivate';
          if (speechRecognitionActivated !== null) nextScreen = 'Aid';
          navigation.navigate(visionTest === 'kids' ? 'NoMicInfo' : nextScreen);
          audio.stopTTS();
        }}
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
