import { useHeaderHeight } from '@react-navigation/elements';
import React, { useEffect, useRef } from 'react';
import {
  Dimensions, StyleSheet, View, ViewProps,
} from 'react-native';
import RNConfetti from 'react-native-confetti';
import { Colors } from '../styles';

const confettiTime = 3000;
const Confetti: React.FC<ViewProps & { onAnimationEnd?: () => void }> = (props) => {
  const { style, onAnimationEnd } = props;
  const headerHeight = useHeaderHeight();
  const confettiRef = useRef<RNConfetti>(null);

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current.startConfetti();
      if (onAnimationEnd) setTimeout(onAnimationEnd, confettiTime * 3);
    }
  }, [confettiRef]);

  return (
    <View {...props} style={[{ ...styles.confettiWrapper, top: -(headerHeight) }, style]} pointerEvents="none">
      <RNConfetti
        ref={confettiRef}
        confettiCount={80}
        duration={confettiTime}
        timeout={0.0001}
        colors={Object.values(Colors.confetti).map((color) => color)}
        size={1.5}
        bsize={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  confettiWrapper: {
    position: 'absolute',
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 1000,
  },
});

export default Confetti;
