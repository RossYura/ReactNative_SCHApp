import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import { Feather } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../styles/colors';
import { Icon } from '../types/global';

interface SquareButtonProps {
  icon: Icon;
  onPress: () => void;
  size?: number;
}

export default function SquareButton(props: SquareButtonProps) {
  const { icon, onPress, size } = props;
  return (
    <Shadow
      distance={Colors.shadows.gray.distance}
      startColor={Colors.shadows.gray.startColor}
      offset={[0, 4]}
      radius={styles.button.borderRadius}
    >
      <TouchableOpacity onPress={onPress}>
        <LinearGradient
          colors={Colors.gradients.light}
          style={{ ...styles.button, width: size || 48, height: size || 48 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name={icon.name as any} size={icon.size || 24} color={icon.color || Colors.blue} />
        </LinearGradient>
      </TouchableOpacity>
    </Shadow>
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
});
