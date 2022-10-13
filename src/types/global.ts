/* eslint-disable max-len,import/no-cycle */
import { IAPItemDetails } from 'expo-in-app-purchases';
import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { UseMutationOptions, UseQueryOptions } from 'react-query';
import AudioMapping from '../config/audio';
import SehfeeBundledAudios from '../config/audio/sehfee';

export enum Result {
  Warning = 1,
  Bad,
  Good,
  VeryGood,
}

export type ResultDetails = {
  title?: string;
  results: {
    description: string;
    descriptionColor?: string;
    leftColumn?: string;
    leftColumnColor?: string;
    rightColumn: string;
    rightColumnColor?: string;
  }[];
}[];

export type RootStackParamList = {
  Home: undefined;
  Info: undefined;
  ChooseVisionTest: undefined;
  ChooseAvatar: undefined;
  SpeakerTest: undefined;
  MicActivate: undefined;
  NoMicInfo: undefined;
  Aid: undefined;
  Ready: undefined;
  Description: undefined;
  Results: {
    result: Result;
    details?: ResultDetails;
  };
  ResultDetails: {
    details: ResultDetails;
  };
  SharpnessVisionTest: undefined;
  MakulaVisionTest: undefined;
  ColorVisionTest: undefined;
  ShortsightVisionTest: undefined;
  FarsightVisionTest: undefined;
  LandoltVisionTest: undefined;
  KidsVisionTest: undefined;
  GiftModal: undefined;
  BuyCoinsModal: undefined;
  CoinBonusModal: {
    coinAmount: number;
  };
};

export type GlobalCssValues = 'inherit' | 'unset' | 'initial';
export type JustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | GlobalCssValues;
export type Icon = {
  name: string;
  size?: number;
  color?: string;
};

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;

export type LandoltTestConfig = {
  startTestId: number;
  positionImages: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, React.FC<SvgProps>>;
  sizes: number[];
};
export type ShortsightTestConfig = {
  startTestId: number;
  sizes: number[];
};
export type FarsightTestConfig = {
  startTestId: number;
  tests: {
    size: number,
    sentences: {
      sentence: string,
      similarityNeeded?: number
    }[]
  }[]
};
export type ColorTestConfig = {
  testCount: number,
  images: {
    answer: number,
    alternativeAnswer?: number,
    image: ImageSourcePropType,
  }[]
};
export type SharpnessTestConfig = undefined;
export type MakulaTestConfig = undefined;
export type KidsTest = 'shortsight' | 'color' | 'contrast';
export type KidsTestOption = 'square' | 'circle' | 'apple' | 'house';
export type KidsTestConfig = {
  stories: Record<KidsTest | 'end', {
    title: string,
    description: string,
    image: ImageSourcePropType,
    ttsKey: keyof typeof AudioMapping
  }>,
  tests: Record<KidsTest | 'end', {
    image: ImageSourcePropType,
    text: string,
    correctOption?: KidsTestOption,
    controlSymbol?: React.FC<SvgProps>,
    options?: Record<KidsTestOption, React.FC<SvgProps>>,
    config?: number[],
  }>
};

export type VisionTestId = 'color' | 'sharpness' | 'shortsight' | 'farsight' | 'makula' | 'landolt' | 'kids';
export type VisionTestResult = {
  result: Result;
  title: string;
  description: string;
  showDoctorButton?: boolean;
  minScore?: number;
  coinBonus?: number;
  hideDetailsButton?: boolean;
};
export type VisionTest<T = LandoltTestConfig | ShortsightTestConfig | FarsightTestConfig | ColorTestConfig | SharpnessTestConfig | MakulaTestConfig | KidsTestConfig> = {
  hidden?: boolean;
  disabled?: true;
  name: string,
  description: string,
  firstScreenName: keyof RootStackParamList,
  detailsHelperText?: string,
  image: ImageSourcePropType,
  imageNoShadow: ImageSourcePropType,
  price?: number,
  readyScreen?: {
    title: string,
    text: string,
    ttsKey?: keyof typeof SehfeeBundledAudios,
  }
  descriptionScreen: {
    title: string,
    text: string,
    ttsKey?: keyof typeof SehfeeBundledAudios,
  },
  mainScreenName: keyof RootStackParamList,
  results: VisionTestResult[],
  testConfig: T;
};
export type AvatarId = 'sehfee' | 'sehpferdchen' | 'sehloewe' | 'sehadler' | 'sehigel' | 'sehlefant' | 'seh2po'
| 'schauschau' | 'guckguck' | 'sehteufel' | 'sehbaer';
export type Avatar = {
  name: string,
  image: ImageSourcePropType,
  headImage?: ImageSourcePropType,
  icon?: ImageSourcePropType,
  description: string,
  price?: number,
  disabled?: boolean,
};

export type InAppPurchaseItem = (IAPItemDetails & { image: ImageSourcePropType });

export type UseQueryTypeHelper<T> = UseQueryOptions<Awaited<T>, Error, Awaited<T>, any>;
export type UseMutationTypeHelper<T, P extends Record<string, any> | void> = UseMutationOptions<Awaited<T>, Error, P>;
