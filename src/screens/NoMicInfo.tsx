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
import Speechbubble from '../assets/images/illu/tutorial/spracherkennung.png';
import Footer from '../components/Footer';
import AppConfig from '../config/app_config';
import useAudio from '../hooks/useAudio';
import ExitButton from '../components/ExitButton';
import useStore from '../hooks/useStore';

export default function NoMicInfoScreen(props: NativeStackScreenProps<RootStackParamList, 'NoMicInfo'>) {
  const { navigation } = props;
  const audio = useAudio();
  const headerHeight = Helpers.getHeaderHeight(useSafeAreaInsets());
  const setSpeechRecognitionActivated = useStore((state) => state.setSpeechRecognitionActivated);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => ExitButton({ navigation, onClick: () => audio.stopTTS() }),
    });
  }, [navigation, audio]);

  useEffect(() => {
    audio.playTTS('kidsInformation');

    return () => audio.stopTTS();
  }, []);

  return (
    <Container style={[{ paddingBottom: headerHeight }, styles.container]}>
      <StatusBar style="auto" />
      <BigCard
        image={Speechbubble}
        title="Hinweis: Die Spracherkennung ist nicht aktiv."
        description={'Damit der Sehtest reibungslos ablaufen kann, wurde die Spracherkennung bei diesem Seh-Check \
deaktiviert.'}
      />
      <Footer
        countdownTime={AppConfig.countdownTimes.noMicInfoScreen}
        onCountdownFinished={() => {
          setSpeechRecognitionActivated(false);
          navigation.navigate('Aid');
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
