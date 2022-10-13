import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import shallow from 'zustand/shallow';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CarouselSlider from '../components/CarouselSlider';
import Container from '../components/Container';
import Avatars from '../config/avatars';
import { AvatarId, RootStackParamList } from '../types/global';
import Footer from '../components/Footer';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';
import Confetti from '../components/Confetti';
import { Spacing } from '../styles';
import InfoTextSwitcher from '../components/InfoTextSwitcher';

export default function ChooseAvatarScreen(props: NativeStackScreenProps<RootStackParamList, 'ChooseAvatar'>) {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const audio = useAudio();
  const isFocused = useIsFocused();
  const {
    setAvatar,
    unlockedAvatars,
    unlockAvatar,
    addCoins,
  } = useStore((state) => ({
    setAvatar: state.setAvatar,
    unlockedAvatars: state.unlockedAvatars,
    unlockAvatar: state.unlockAvatar,
    addCoins: state.addCoins,
  }), shallow);
  const [confetti, setConfetti] = useState(false);
  const [_screenFocused, setScreenFocused] = useState(isFocused);

  useEffect(() => {
    setScreenFocused(isFocused);
  }, [isFocused]);

  useEffect(() => () => audio.stopTTS(), []);

  const buyItem = (avatarId: AvatarId) => {
    const avatar = Avatars[avatarId];
    addCoins(-(avatar.price || 0));
    unlockAvatar(avatarId);
    audio.playSoundEffect('unlockedAvatar');
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
        onBuyItem={(id) => buyItem(id as AvatarId)}
        onOpenCoinModal={openCoinModal}
        items={Object.entries(Avatars).map(([avatarId, avatar]) => ({
          id: avatarId,
          title: avatar.name,
          text: avatar.description,
          image: avatar.image,
          disabled: avatar.disabled,
          price: unlockedAvatars.includes(avatarId as AvatarId) ? undefined : avatar.price,
          onSelect: () => {
            audio.playSoundEffect('avatarChosen');
            setAvatar(avatarId as AvatarId);
            navigation.navigate('SpeakerTest');
            audio.stopTTS();
          },
          onBecomeActive: () => {
            audio.playSoundEffect('chooseAvatar');
            if (!avatar.disabled) {
              setTimeout(() => {
                setScreenFocused((currentScreenFocused) => {
                  if (currentScreenFocused) audio.playTTS('generalName', avatarId as AvatarId);
                  return currentScreenFocused;
                });
              }, 500);
            }
          },
        }))}
      />
      <InfoTextSwitcher
        containerStyle={{ ...styles.infoTextSwitcher, bottom: 72 + insets.bottom + 36 }}
        texts={[
          'Die Gefährten begleiten deine Seh-Checks ...',
          'Du kannst Coins auch mit Geld erwerben ...',
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
