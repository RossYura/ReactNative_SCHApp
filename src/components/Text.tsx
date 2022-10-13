import React from 'react';
import {
  TextProps,
  Text as RNText, // eslint-disable-line no-restricted-imports
  StyleSheet,
  StyleProp,
} from 'react-native';

// Animated.createAnimatedComponent requires a class component
// eslint-disable-next-line react/prefer-stateless-function
class Text extends React.Component<TextProps> {
  render() {
    const { children, style } = this.props;
    let styles = style;
    let objStyle: StyleProp<any> = {};
    if (Array.isArray(style)) objStyle = StyleSheet.flatten(style);
    else if (style) objStyle = { ...style as object };
    if (!objStyle.fontFamily || objStyle.fontFamily === 'Outfit') {
      objStyle.fontFamily = 'Outfit_500Medium';
      if (objStyle.fontWeight === 'bold' || objStyle.fontWeight === '700') objStyle.fontFamily = 'Outfit_700Bold';
      styles = objStyle;
    }
    return (
      <RNText {...this.props} style={styles}>
        {children}
      </RNText>
    );
  }
}

export default Text;
