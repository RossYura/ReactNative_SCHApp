import React from 'react';
import {
  StyleSheet, View, ViewProps, ViewStyle,
} from 'react-native';
import { Colors } from '../styles';
import Text from './Text';

interface SpeechbubbleProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  cornerLocation?: 'top' | 'right';
}
const Speechbubble: React.FC<SpeechbubbleProps & ViewProps> = (props) => {
  const { text, style } = props;
  let { backgroundColor, textColor, cornerLocation } = props;
  if (cornerLocation === undefined) cornerLocation = 'top';
  if (backgroundColor === undefined) backgroundColor = Colors.gray;
  if (textColor === undefined) textColor = Colors.white;

  let cornerAdditionalStyle: ViewStyle = styles.cornerTop;
  if (cornerLocation === 'right') cornerAdditionalStyle = styles.cornerRight;

  return (
    <View style={[styles.speechbubble, { backgroundColor }, style]}>
      <View style={[styles.corner, cornerAdditionalStyle, { backgroundColor }]} />
      <Text style={{ ...styles.text, color: textColor }}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  speechbubble: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 24,
  },
  corner: {
    position: 'absolute',
    width: 6,
    height: 6,
    transform: [{ rotate: '45deg' }],
  },
  cornerTop: {
    top: -3,
  },
  cornerRight: {
    right: -3,
  },
  text: {
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
  },
});

export default Speechbubble;
