// TODO: Blurred image behind actual image
import React, {
  useRef, useCallback, useState, useEffect,
} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import RadialGradient from 'react-native-radial-gradient';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useHeaderHeight } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../styles';
import Text from './Text';
import LongButton from './LongButton';
import useStore from '../hooks/useStore';

export interface CarouselItemProps {
  id: string;
  title: string;
  subtitle?: string;
  text: string | React.ReactNode;
  image: ImageSourcePropType;
  disabled?: boolean;
  price?: number;
  unlocked?: number;
  onSelect?: () => void;
  onBecomeActive?: () => void;
}
interface RenderCarouselItemProps {
  item: CarouselItemProps;
  index: number;
}

interface CarouselSliderProps {
  items: CarouselItemProps[];
  onBuyItem?: (id: string) => void;
  onOpenCoinModal?: () => void;
  containerStyle?: ViewStyle;
  noGrowing?: boolean;
  smooth?: boolean;
  itemHeight: number;
  imageWidth?: string | number;
}

const AnimatedText = Animated.createAnimatedComponent(Text);
const activeItemTitleBaseSize = Dimensions.get('window').width > 375 ? 22 : 16;

export default function CarouselSlider(props: CarouselSliderProps) {
  const {
    items,
    onBuyItem,
    onOpenCoinModal,
    containerStyle,
    smooth,
    itemHeight,
    imageWidth,
  } = props;
  let { noGrowing } = props;
  if (Platform.OS === 'android') noGrowing = true;
  const itemWidth = itemHeight * 0.75;
  const coins = useStore((state) => state.coins);

  const [snappedIndex, setSnappedIndex] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeItemMargin] = useState(new Animated.Value(10));
  const [activeItemScale] = useState(new Animated.Value(1));
  const [activeItemTitleSize] = useState(new Animated.Value(activeItemTitleBaseSize));
  const carouselRef = useRef(null);
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (activeIndex === null) return;
    if (items[activeIndex].onBecomeActive) items[activeIndex].onBecomeActive!();
  }, [activeIndex]);

  const resetActiveIndex = (immediately = false) => {
    if (immediately) {
      setActiveIndex(null);
      activeItemScale.setValue(1);
      activeItemMargin.setValue(10);
    } else {
      Animated.parallel([
        Animated.timing(activeItemScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(activeItemMargin, {
          toValue: 10,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(activeItemTitleSize, {
          toValue: activeItemTitleBaseSize,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => setActiveIndex(null));
    }
  };

  const renderItem = useCallback(({ item, index }: RenderCarouselItemProps) => {
    let button = (
      <LongButton
        title="Auswählen"
        onPress={item.onSelect!}
        style={{ maxWidth: 202 }}
        titleStyle={{ fontSize: 16 }}
      />
    );
    if (
      item.disabled
      || index !== activeIndex
      || item.onSelect === undefined
    ) {
      button = React.isValidElement(item.text) ? item.text : (
        <Text style={styles.itemText}>
          {item.text}
        </Text>
      );
    } else if (item.price !== undefined && onBuyItem !== undefined && onOpenCoinModal !== undefined) {
      button = (
        <LongButton
          green
          title={coins >= item.price ? `${item.price} Coins` : 'Coins erwerben'}
          onPress={coins >= item.price ? () => onBuyItem(item.id) : () => onOpenCoinModal()}
          style={{ maxWidth: 202 }}
          titleStyle={{ fontSize: 16 }}
        />
      );
    }

    let subtitle: string | null = null;
    if (item.subtitle) subtitle = item.subtitle;
    else if (index === activeIndex && item.price !== undefined && !item.disabled) {
      subtitle = `Für ${item.price} Coins freischalten`;
    }

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          if (index === snappedIndex && index !== activeIndex) {
            setActiveIndex(index);
            Animated.parallel([
              Animated.timing(activeItemScale, {
                toValue: noGrowing ? 1 : 1.2,
                duration: 200,
                useNativeDriver: false,
              }),
              Animated.timing(activeItemMargin, {
                toValue: noGrowing ? 10 : 20,
                duration: 200,
                useNativeDriver: false,
              }),
              Animated.timing(activeItemTitleSize, {
                toValue: activeItemTitleBaseSize * (noGrowing ? 1 : 1.005),
                duration: 200,
                useNativeDriver: false,
              }),
            ]).start();
          } else if (index !== activeIndex && activeIndex !== null) {
            resetActiveIndex();
          }
        }}
      >
        <Animated.View style={[
          styles.gradientWrapper,
          { height: itemHeight, width: itemWidth },
          index === activeIndex ? {
            transform: [
              {
                scale: activeItemScale,
              },
            ],
            width: noGrowing ? itemWidth : Animated.subtract(itemWidth, activeItemMargin),
          } : {}]}
        >
          <RadialGradient
            colors={[Colors.lightPurple, Colors.purple]}
            stops={[0, 1]}
            radius={itemHeight}
            center={[itemWidth / 2, itemHeight]}
            style={{ ...styles.gradient, height: itemHeight }}
          >
            <View>
              <AnimatedText style={[styles.itemTitle, index === activeIndex ? {
                fontSize: activeItemTitleSize,
              } : {}]}
              >
                {item.title}
              </AnimatedText>
              {subtitle && <Text style={styles.priceText}>{subtitle}</Text>}
            </View>
            <View style={styles.imageWrapper}>
              <Image source={item.image} style={{ ...styles.image, width: imageWidth || '100%' }} />
            </View>
            {button}
          </RadialGradient>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }, [snappedIndex, activeIndex, coins, items]);

  return (
    <>
      <View style={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: Dimensions.get('window').height - headerHeight - 72 - insets.bottom,
      }}
      >
        <TouchableWithoutFeedback
          containerStyle={{ width: '100%', height: '100%' }}
          onPress={() => resetActiveIndex()}
        />
      </View>
      <Carousel
        ref={carouselRef}
        data={items}
        width={itemWidth + 20}
        height={itemHeight}
        renderItem={renderItem}
        style={{
          ...styles.carousel, ...containerStyle, height: itemHeight * 1.2,
        }}
        onSnapToItem={(index) => setSnappedIndex(index)}
        onProgressChange={(_offsetProgress, absoluteProgress) => {
        /* onScrollBegin can't be used to reset the active index, since it's also called when a card is pressed.
        Therefore, we use this little workaround: onProgressChange gets called on a simple press, too, but passed the
        handy absoluteProgress value, which basically corresponds to a floating point activeIndex. We can therefore
        check if this number is an integer, which would mean we're still at the same card -> don't reset the active
        index in that case */
          if (Math.round(absoluteProgress) !== absoluteProgress) resetActiveIndex();
        }}
        enableSnap={!smooth}
        loop={false}
      />
    </>
  );
}

const styles = StyleSheet.create({
  carousel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  gradientWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gradient: {
    paddingVertical: 25,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: Dimensions.get('window').width > 375 ? 16 : 14,
  },
  priceText: {
    color: Colors.white,
    textAlign: 'center',
    fontSize: Dimensions.get('window').width > 375 ? 13 : 12,
  },
  itemTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: activeItemTitleBaseSize,
    textAlign: 'center',
  },
  imageWrapper: {
    width: Dimensions.get('window').width > 375 ? '100%' : '80%',
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
  },
  image: {
    height: undefined,
    aspectRatio: 1,
  },
});
