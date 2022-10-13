import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, View, Animated, StyleProp, ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Text from './Text';
import { Colors } from '../styles';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface InfoTextSwitcherProps {
  texts: string[];
  containerStyle?: StyleProp<ViewStyle>
}
const InfoTextSwitcher: React.FC<InfoTextSwitcherProps> = (props) => {
  const { texts, containerStyle } = props;
  const [currentText, setCurrentText] = useState(0);
  const currentOpacity = useRef(new Animated.Value(1)).current;
  const nextOpacity = useRef(new Animated.Value(0)).current;

  const getNextText = useCallback(() => {
    let nextText = currentText + 1;
    if (nextText >= texts.length) nextText = 0;
    return nextText;
  }, [currentText]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        currentOpacity,
        {
          delay: 5000,
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        },
      ),
      Animated.timing(
        nextOpacity,
        {
          delay: 5000,
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        },
      ),
    ]).start(() => {
      setCurrentText(getNextText());
      currentOpacity.setValue(1);
      nextOpacity.setValue(0);
    });
  }, [currentText]);

  return (
    <View style={[styles.textWrapper, containerStyle]}>
      <Feather name="info" size={24} color={Colors.purple} />
      {
      texts.map((text, index) => {
        let opacity: number | Animated.Value = 0;
        if (index === currentText) opacity = currentOpacity;
        else if (index === getNextText()) opacity = nextOpacity;
        return (
          <AnimatedText key={index} style={{ ...styles.text, opacity }}>{text}</AnimatedText>
        );
      })
    }
    </View>
  );
};

const styles = StyleSheet.create({
  textWrapper: {

  },
  text: {
    fontSize: 16,
    color: Colors.purple,
    position: 'absolute',
    marginLeft: 32,
    top: 2,
  },
});

export default InfoTextSwitcher;
