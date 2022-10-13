import React, { useState } from 'react';
import {
  Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../styles/colors';
import SpeakerDots from '../assets/images/icons/speaker.svg';
import Soundwaves1 from '../assets/images/icons/soundwaves-1.png';
import Soundwaves2 from '../assets/images/icons/soundwaves-2.png';
import Soundwaves3 from '../assets/images/icons/soundwaves-3.png';
import useStore from '../hooks/useStore';
import useInterval from '../hooks/useInterval';

interface IntercomProps {
  size?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

const soundwaves: (ImageSourcePropType | null)[] = [null, Soundwaves1, Soundwaves2, Soundwaves3];

export default function Intercom(props: IntercomProps) {
  const { size, containerStyle } = props;
  const speaking = useStore((state) => state.speaking);
  const [soundwavesLevel, setSoundwavesLevel] = useState(0);

  useInterval(() => {
    if (speaking) {
      let nextSoundwavesLevel = soundwavesLevel + 1;
      if (nextSoundwavesLevel >= soundwaves.length) nextSoundwavesLevel = 0;
      setSoundwavesLevel(nextSoundwavesLevel);
    } else setSoundwavesLevel(0);
  }, 200);

  return (
    <View style={containerStyle}>
      <Shadow
        distance={Colors.shadows.gray.distance}
        startColor={Colors.shadows.gray.startColor}
        offset={[0, 4]}
        radius={styles.button.borderRadius}
      >
        <LinearGradient
          colors={Colors.gradients.light}
          style={{ ...styles.button, width: size || 48, height: size || 48 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SpeakerDots />
        </LinearGradient>
      </Shadow>
      { speaking && soundwaves[soundwavesLevel] !== null && (
      <Image style={styles.soundwaves} source={soundwaves[soundwavesLevel] as ImageSourcePropType} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.white,
  },
  soundwaves: {
    position: 'absolute',
    right: -27,
    top: -6,
  },
});
