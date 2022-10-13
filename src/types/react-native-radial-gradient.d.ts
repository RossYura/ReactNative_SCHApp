declare module 'react-native-radial-gradient' {
  import { StyleProp, ViewStyle } from 'react-native';

  interface RadialGradientProps {
    center?: [number, number];
    colors?: [string, string];
    radius?: number;
    style?: StyleProp<ViewStyle>;
    stops?: number[];
  }

  const RadialGradient: React.FC<RadialGradientProps> = () => {};
  export default RadialGradient;
}
