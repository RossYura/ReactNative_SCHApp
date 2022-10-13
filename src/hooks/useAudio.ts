import { useState } from 'react';
import Sound from 'react-native-sound';
import shallow from 'zustand/shallow';
import AudioConfig from '../config/audio';
import useStore from './useStore';
import { AvatarId } from '../types/global';

const useSound = () => {
  const [currentTTS, setCurrentTTS] = useState<Sound | null>(null);
  const { avatar, setSpeaking } = useStore((state) => ({
    setSpeaking: state.setSpeaking,
    avatar: state.avatar,
  }), shallow);

  const playSoundEffect = async (
    soundId: keyof typeof AudioConfig['effects'],
  ) => {
    // Enable playback in silence mode
    Sound.setCategory('Playback');

    const player = new Sound(AudioConfig.effects[soundId], (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
      }
      player.play((success) => {
        if (success) {
          console.log('Sould played successfully.');
        } else {
          console.log('Sould play failed.');
        }
        player.release();
        // Sound.setCategory('PlayAndRecord');
      });
    });
  };

  const playTTS = async (
    soundId: keyof typeof AudioConfig['tts'],
    avatarOverride?: AvatarId,
  ) => {
    let playbackSource = AudioConfig.tts[soundId].bundled![avatarOverride || avatar || 'sehfee'];
    if (!playbackSource) playbackSource = AudioConfig.tts.unknown;

    // Enable playback in silence mode
    Sound.setCategory('Playback');

    const player = new Sound(playbackSource, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        setCurrentTTS(null);
        setSpeaking(false);
      } else {
        setCurrentTTS(player);
        setSpeaking(true);
        player.play((success) => {
          if (success) {
            console.log('Sould played successfully.');
          } else {
            console.log('Sould play failed.');
          }
          player.release();
        });
      }
    });
  };

  const stopTTS = () => {
    if (currentTTS) {
      currentTTS.stop(() => {
        currentTTS.release();
        setCurrentTTS(null);
        setSpeaking(false);
      });
    }
  };

  return { playSoundEffect, playTTS, stopTTS };
};

export default useSound;
