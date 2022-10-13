declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.mp3'

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

declare module '@env' {
  export const API_URL: string;
  export const SHOW_DEV_TOOLS: string;
}
