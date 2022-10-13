import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import shallow from 'zustand/shallow';
import { Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CarouselSlider from '../components/CarouselSlider';
import Container from '../components/Container';
import type { RootStackParamList, VisionTestId } from '../types/global';
import VisionTests from '../config/vision_tests';
import Footer from '../components/Footer';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';
import Confetti from '../components/Confetti';
import InfoTextSwitcher from '../components/InfoTextSwitcher';
import { Spacing } from '../styles';

export default function ChooseVisionTestScreen(props: NativeStackScreenProps<RootStackParamList, 'ChooseVisionTest'>) {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const audio = useAudio();
  const {
    setVisionTest,
    unlockedVisionTests,
    unlockVisionTest,
    addCoins,
  } = useStore((state) => ({
    setVisionTest: state.setVisionTest,
    unlockedVisionTests: state.unlockedVisionTests,
    unlockVisionTest: state.unlockVisionTest,
    addCoins: state.addCoins,
  }
  ), shallow);
  const [confetti, setConfetti] = useState(false);

  const buyItem = (visionTestId: VisionTestId) => {
    const visionTest = VisionTests[visionTestId];
    addCoins(-(visionTest.price || 0));
    unlockVisionTest(visionTestId);
    audio.playSoundEffect('unlockedVisionTest');
    setConfetti(true);
  };

  const openCoinModal = () => {
    navigation.navigate('BuyCoinsModal');
  };

  return (
    <Container paddedFooter>
      { confetti && <Confetti onAnimationEnd={() => setConfetti(false)} />}
      <StatusBar style="auto" />
      <CarouselSlider
        itemHeight={Dimensions.get('window').height * 0.357}
        onBuyItem={(id) => buyItem(id as VisionTestId)}
        onOpenCoinModal={openCoinModal}
        items={Object.entries(VisionTests)
          .filter(([_visionTestId, visionTest]) => !visionTest.hidden)
          .map(([visionTestId, visionTest]) => ({
            id: visionTestId,
            title: visionTest.name,
            disabled: visionTest.disabled,
            text: visionTest.description,
            image: visionTest.image,
            price: unlockedVisionTests.includes(visionTestId as VisionTestId) ? undefined : visionTest.price,
            onSelect: () => {
              audio.playSoundEffect('visionTestChosen');
              setVisionTest(visionTestId as VisionTestId);
              navigation.navigate('ChooseAvatar');
            },
            onBecomeActive: () => audio.playSoundEffect('chooseVisionTest'),
          }))}
      />
      <InfoTextSwitcher
        containerStyle={{ ...styles.infoTextSwitcher, bottom: 72 + insets.bottom + 36 }}
        texts={[
          'Du kannst Seh-Checks mit Coins freischalten ...',
          'Für absolvierte Seh-Checks erhältst du Coins ...',
        ]}
      />
      <Footer />
    </Container>
  );
}

const styles = StyleSheet.create({
  infoTextSwitcher: {
    position: 'absolute',
    width: Dimensions.get('window').width - Spacing.m * 2,
  },
});
