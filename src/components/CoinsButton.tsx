import React, {
  Component,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import * as SecureStore from 'expo-secure-store';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Text from './Text';
import Colors from '../styles/colors';
import { Spacing, Typography } from '../styles';
import Coin from '../assets/images/illu/store/coin-small-inaktiv.png';
import useStore from '../hooks/useStore';

interface IncomingCoinProps {
  bottom: Animated.Value | Animated.AnimatedInterpolation | number;
  left: number;
}
// eslint-disable-next-line react/prefer-stateless-function
class BaseIncomingCoin extends Component<IncomingCoinProps, {}> {
  render() {
    const { bottom, left } = this.props;
    return (
      <Animated.Image source={Coin} style={{ ...styles.incomingCoin, bottom, left }} />
    );
  }
}
const IncomingCoin = Animated.createAnimatedComponent(BaseIncomingCoin);

interface CoinsButtonProps {
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  smallerAnimationInset?: boolean;
}

export default function CoinsButton(props: CoinsButtonProps) {
  const {
    onPress, containerStyle, smallerAnimationInset,
  } = props;
  const insets = useSafeAreaInsets();
  const coins = useStore((state) => state.coins);
  const [currentCoins, setCurrentCoins] = useState(coins);
  const [isAnimating, setIsAnimating] = useState(false);
  const incomingCoinBottom = useRef(new Animated.Value(0)).current;
  const TouchableElement = onPress ? TouchableOpacity : View;

  useEffect(() => {
    if (coins > currentCoins) {
      const addedCoins = coins - currentCoins;
      SecureStore.setItemAsync('coins', coins.toString());
      setIsAnimating(true);

      let iterations = 30;
      if (addedCoins <= 20) iterations = 10;
      const coinStep = addedCoins / iterations;

      Animated.loop(Animated.timing(
        incomingCoinBottom,
        {
          toValue: -10,
          duration: 90,
          useNativeDriver: false,
        },
      ), { iterations }).start(() => {
        setIsAnimating(false);
      });
      for (let i = 1; i <= iterations; i++) {
        setTimeout(() => {
          if (i === iterations) setCurrentCoins(coins);
          else setCurrentCoins((prevCoins) => Math.round(prevCoins + coinStep));
        }, 100 * i);
      }
    } else {
      SecureStore.setItemAsync('coins', coins.toString());
      const deductedCoins = currentCoins - coins;
      let iterations = 30;
      if (deductedCoins <= 20) iterations = 10;
      const coinStep = deductedCoins / iterations;

      for (let i = 1; i <= iterations; i++) {
        setTimeout(() => {
          if (i === iterations) setCurrentCoins(coins);
          else setCurrentCoins((prevCoins) => Math.round(prevCoins - coinStep));
        }, 100 * i);
      }
    }
  }, [coins]);

  const additionalAnimationInset = smallerAnimationInset ? 0 : insets.bottom + Spacing.l;
  let coinsColor = Colors.red;
  if (currentCoins > 0 && currentCoins < 100) coinsColor = Colors.orange;
  else if (currentCoins >= 100) coinsColor = Colors.green;

  let incomingCoinLeftOffset = 32;
  const overlength = Math.max(0, String(currentCoins).length - 3);
  incomingCoinLeftOffset -= 6 * overlength;

  return (
    <>
      { isAnimating && (
      <>
        <IncomingCoin
          left={incomingCoinLeftOffset}
          bottom={Animated.add(incomingCoinBottom, 26 + additionalAnimationInset)}
        />
        <IncomingCoin
          left={incomingCoinLeftOffset}
          bottom={Animated.add(incomingCoinBottom, 36 + additionalAnimationInset)}
        />
        <IncomingCoin
          left={incomingCoinLeftOffset}
          bottom={Animated.add(incomingCoinBottom, 46 + additionalAnimationInset)}
        />
      </>
      )}
      <Shadow
        distance={Colors.shadows.gray.distance}
        startColor={Colors.shadows.gray.startColor}
        offset={[0, 4]}
        radius={styles.button.borderRadius}
      >
        {/* @ts-ignore */}
        <TouchableElement onPress={onPress} style={containerStyle}>
          <LinearGradient
            colors={Colors.gradients.light}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.Image source={Coin} style={styles.coin} />
            <Text style={{ ...styles.coinsText, color: coinsColor }}>{String(currentCoins).padStart(3, '0')}</Text>
          </LinearGradient>
        </TouchableElement>
      </Shadow>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.white,
    width: 78,
    height: 48,
    backgroundColor: Colors.white,
  },
  coinsText: {
    fontFamily: 'Optician Sans',
    fontSize: Typography.sizes.l,
    marginLeft: Spacing.xxs,
  },
  coin: {
    width: 16,
    height: 16,
  },
  incomingCoin: {
    opacity: 0.75,
    position: 'absolute',
    zIndex: 100,
    width: 16,
    height: 16,
  },
});
