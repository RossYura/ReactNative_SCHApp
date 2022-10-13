import React from 'react';
import {
  StyleProp, StyleSheet, TextStyle, TouchableOpacityProps, View, ViewStyle,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Shadow } from 'react-native-shadow-2';

import Colors from '../styles/colors';
import Helpers from '../utils/helpers';
import Text from './Text';

interface LongButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  green?: boolean;
  red?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  largeTitle?: boolean;
}

export default function LongButton(props: LongButtonProps) {
  const {
    title, onPress, green, red, style, containerStyle, titleStyle, largeTitle,
  } = props;
  const sanitizedTitle = Helpers.replaceUmlauts(title).toUpperCase();

  let shadowColor: keyof typeof Colors.shadows = 'purple';
  if (green) shadowColor = 'green';
  if (red) shadowColor = 'purple';

  return (
    <View style={containerStyle}>
      <Shadow
        distance={Colors.shadows[shadowColor].distance}
        startColor={Colors.shadows[shadowColor].startColor}
        offset={[0, 4]}
        viewStyle={{ width: '100%' }}
      >
        <TouchableOpacity
          disallowInterruption
          onPress={onPress}
          style={[styles.button, green ? styles.greenButton : {}, red ? styles.redButton : {}, style]}
        >
          <Text
            style={[
              styles.title,
              green ? styles.greenTitle : {},
              red ? styles.redTitle : {},
              largeTitle ? styles.largeTitle : {},
              titleStyle,
            ]}
          >
            {sanitizedTitle}
          </Text>
        </TouchableOpacity>
      </Shadow>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Colors.lightPurple,
    borderRadius: 4,
  },
  greenButton: {
    backgroundColor: Colors.green,
    borderColor: Colors.lightGreen,
  },
  redButton: {
    backgroundColor: Colors.red,
    borderColor: Colors.lightRed,
  },
  title: {
    fontSize: 20,
    color: Colors.purple,
    textAlign: 'center',
    fontFamily: 'Optician Sans',
  },
  greenTitle: {
    color: Colors.white,
  },
  redTitle: {
    color: Colors.white,
  },
  largeTitle: {
    fontSize: 30,
  },
});
