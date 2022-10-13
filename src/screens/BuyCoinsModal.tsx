import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import tinycolor from 'tinycolor2';
import { RootStackParamList } from '../types/global';
import Text from '../components/Text';
import { Colors, Spacing, Typography } from '../styles';
import LongButton from '../components/LongButton';
import CarouselSlider from '../components/CarouselSlider';
import useStore from '../hooks/useStore';
import useIAPs from '../hooks/useIAPs';
import useAudio from '../hooks/useAudio';
import ExitButton from '../components/ExitButton';

export default function BuyCoinsModalScreen(props: NativeStackScreenProps<RootStackParamList, 'BuyCoinsModal'>) {
  const { navigation } = props;
  const audio = useAudio();
  const insets = useSafeAreaInsets();
  const { update: updateIAPs, buy: buyIAP, buying: iapPurchaseProcessing } = useIAPs(navigation.goBack);
  const inAppPurchases = useStore((state) => state.inAppPurchases);

  useEffect(() => {
    updateIAPs();
  }, []);

  const handleExitButtonPress = () => {
    navigation.goBack();
    audio.stopTTS();
  };

  const items = inAppPurchases.sort((a, b) => a.priceAmountMicros - b.priceAmountMicros).map((result, id) => ({
    id: String(id),
    title: result.title,
    subtitle: result.description,
    text: (
      <LongButton
        green
        title={`${(result.priceAmountMicros / 1000000).toString().replace('.', ',')} €`}
        onPress={() => {
          audio.playSoundEffect('buttonPress');
          buyIAP(result.productId);
        }}
      />
    ),
    image: result.image,
    productId: result.productId,
  }));

  return (
    <>
      { iapPurchaseProcessing && (
      <View style={styles.loadingView}>
        <ActivityIndicator color={Colors.light} />
      </View>
      )}
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <BlurView style={styles.container} intensity={10}>
          <View style={{ ...styles.exitButtonWrapper, top: insets.top + Spacing.m / 2 }}>
            <ExitButton navigation={navigation} onClick={handleExitButtonPress} disableDefaultNavigation />
          </View>
          <View style={styles.wrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.innerWrapper}>
                <Text style={styles.title}>{'Coins erwerben'.toUpperCase()}</Text>
                <Text style={styles.description}>
                  Coins kannst du dazu verwenden, neue Seh-Checks oder Gefährten freizuschalten.
                </Text>
                <CarouselSlider
                  itemHeight={Dimensions.get('window').height * 0.357}
                  items={items}
                  containerStyle={{ paddingVertical: Spacing.m }}
                  noGrowing
                  imageWidth="85%"
                />
                <Text style={styles.comparisonText}>* Im Vergleich zum Coin Basis-Paket.</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{ ...styles.bottomWrapper, marginBottom: insets.bottom }}>
            <View style={styles.infoWrapper}>
              <Feather name="info" size={24} color={Colors.white} />
              <Text style={styles.infoText}>
                Wichtig: Du kannst Coins z. B. auch durch absolvierte Seh-Checks erhalten …
              </Text>
            </View>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  exitButtonWrapper: {
    position: 'absolute',
    right: Spacing.m,
    zIndex: 5000,
  },
  loadingView: {
    position: 'absolute',
    zIndex: 10000,
    backgroundColor: tinycolor(Colors.black).setAlpha(0.7).toHex8String(),
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: Spacing.m,
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerWrapper: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: Spacing.l,
    overflow: 'hidden',
  },
  title: {
    fontSize: Typography.sizes.m,
    color: Colors.purple,
    paddingHorizontal: Spacing.l,
  },
  description: {
    fontSize: Typography.sizes.m,
    marginTop: Spacing.m,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: Spacing.l,
  },
  bottomWrapper: {
    bottom: 24,
    left: 0,
    position: 'absolute',
    display: 'flex',
    paddingHorizontal: Spacing.m,
    width: '100%',
  },
  comparisonText: {
    color: Colors.purple,
    fontSize: Typography.sizes.m,
  },
  infoWrapper: {
    marginBottom: Spacing.m,
    display: 'flex',
    flexDirection: 'row',
  },
  infoText: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    marginLeft: Spacing.s,
    flex: 1,
    flexWrap: 'wrap',
  },
});
