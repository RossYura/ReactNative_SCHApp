import tinycolor from 'tinycolor2';

const colors = {
  purple: '#5741D7',
  lightPurple: '#987BE7',
  coolGray: '#D4D6DB',
  gray: '#72788A',
  blue: '#4A79F3',
  light: '#E3E4E8',
  white: '#FFFFFF',
  black: '#000000',
  green: '#34C759',
  lightGreen: '#C2EECD',
  red: '#DC3545',
  lightRed: '#F4C2C7',
  yellow: '#FFC107',
  orange: '#FD9B3D',
  dark: '#6C757D',
};

const shadows = {
  purple: {
    startColor: tinycolor(colors.purple).setAlpha(0.15).toHex8String(),
    distance: 8,
  },
  green: {
    startColor: tinycolor(colors.green).setAlpha(0.15).toHex8String(),
    distance: 8,
  },
  gray: {
    startColor: tinycolor(colors.gray).setAlpha(0.25).toHex8String(),
    distance: 8,
  },
  blue: {
    startColor: tinycolor(colors.blue).setAlpha(0.5).toHex8String(),
    distance: 20,
  },
};

const confetti = {
  purple: colors.purple,
  lightPurple: colors.lightPurple,
  gray: colors.gray,
  blue: colors.blue,
  light: colors.light,
  white: colors.white,
  black: colors.black,
  green: colors.green,
  red: colors.red,
  yellow: colors.yellow,
  dark: colors.dark,
};

const gradients = {
  light: [colors.light, colors.white],
};

export default {
  ...colors, shadows, gradients, confetti,
};
