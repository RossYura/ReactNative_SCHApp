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
import Aid from '../assets/images/illu/tutorial/sehhilfe.png';
import Footer from '../components/Footer';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';
import ExitButton from '../components/ExitButton';
import LongButton from '../components/LongButton';
import VisionTests from '../config/vision_tests';

export default function AidScreen(props: NativeStackScreenProps<RootStackParamList, 'Aid'>) {
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
    audio.playTTS('tutorialAid');

    return () => audio.stopTTS();
  }, []);

  return (
    <Container style={[{ paddingBottom: headerHeight }, styles.container]}>
      <StatusBar style="auto" />
      <BigCard
        image={Aid}
        title="Trage deine Brille oder Kontaktlinsen, falls vorhanden."
        description="Stelle deine Bildschirmhelligkeit auf Maximum."
      />
      <View style={styles.buttonWrapper}>
        <LongButton
          title="Weiter"
          onPress={() => {
            audio.playSoundEffect('buttonPress');
            navigation.navigate(visionTest
              ? VisionTests[visionTest].firstScreenName
              : 'ChooseVisionTest');
            audio.stopTTS();
          }}
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
  },
});
