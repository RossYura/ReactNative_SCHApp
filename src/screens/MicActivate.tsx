import React, { useEffect, useLayoutEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Dimensions,
  StyleSheet,
  View,
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
import useAudio from '../hooks/useAudio';
import ExitButton from '../components/ExitButton';
import useStore from '../hooks/useStore';
import LongButton from '../components/LongButton';

export default function MicActivateScreen(props: NativeStackScreenProps<RootStackParamList, 'MicActivate'>) {
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
    audio.playTTS('tutorialVoiceRecognitionSelection');

    return () => audio.stopTTS();
  }, []);

  const handleButtonPress = (allow: boolean) => {
    audio.playSoundEffect('buttonPress');
    setSpeechRecognitionActivated(allow);
    navigation.navigate('Aid');
    audio.stopTTS();
  };

  return (
    <Container style={[{ paddingBottom: headerHeight }, styles.container]}>
      <StatusBar style="auto" />
      <BigCard
        image={Speechbubble}
        title="Möchtest du die Spracherkennung verwenden?"
        description="Hierfür wird eine Mikrofonfreigabe benötigt."
      />
      <View style={styles.buttonWrapper}>
        <LongButton
          title="Ja"
          onPress={() => handleButtonPress(true)}
        />
        <LongButton
          title="Nein"
          onPress={() => handleButtonPress(false)}
          containerStyle={{ marginLeft: Spacing.m }}
        />
      </View>
      <Footer
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
  buttonWrapper: {
    marginTop: Spacing.m,
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'row',
  },
});
