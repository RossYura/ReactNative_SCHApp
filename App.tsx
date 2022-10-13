import React, { useEffect, useState } from 'react';
import AppLoading from 'expo-app-loading';
import { useFonts, Outfit_500Medium, Outfit_700Bold } from '@expo-google-fonts/outfit';
import * as SecureStore from 'expo-secure-store';
import { QueryClient, QueryClientProvider } from 'react-query';
import Bugsnag from '@bugsnag/expo';
import {
  connectAsync, disconnectAsync, finishTransactionAsync, IAPResponseCode, InAppPurchase, setPurchaseListener,
} from 'expo-in-app-purchases';
import Voice from '@react-native-voice/voice';
import { Alert, LogBox, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigator from './src/navigation';
import useStore from './src/hooks/useStore';
import { updateIAPsOnce } from './src/hooks/useIAPs';
import { verifyAppleIAPStatic, verifyGoogleIAPStatic } from './src/hooks/query/iap';
import useAudio from './src/hooks/useAudio';
import { AvatarId, VisionTestId } from './src/types/global';
import Helpers from './src/utils/helpers';
import { getApiUrl } from './src/utils/api';

LogBox.ignoreLogs(['Setting a timer']);
let ErrorBoundary = React.Fragment;
if (!__DEV__) {
  Bugsnag.start({
    onError: (event) => {
      event.addMetadata('environment', {
        env: process.env.NODE_ENV,
        apiUrl: getApiUrl(),
        hasDevTools: Helpers.shouldDevToolsBeShown(),
      });
    },
  });
  ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);
}

export default function App() {
  const audio = useAudio();
  const [fontsLoaded] = useFonts({
    Outfit_500Medium,
    Outfit_700Bold,
    // eslint-disable-next-line global-require
    'Optician Sans': require('./src/assets/fonts/Optiker-K.ttf'),
  });
  const [dataLoaded, setDataLoaded] = useState(false);
  const { setCoins, addCoins } = useStore((state) => ({ setCoins: state.setCoins, addCoins: state.addCoins }));
  const setUnlockedVisionTests = useStore((state) => state.setUnlockedVisionTests);
  const setUnlockedAvatars = useStore((state) => state.setUnlockedAvatars);
  const setSpeechRecognitionActivated = useStore((state) => state.setSpeechRecognitionActivated);

  const queryClient = new QueryClient();

  useEffect(() => {
    (async () => {
      const [
        storedCoins,
        unlockedVisionTests,
        unlockedAvatars,
        lastTTSUpdate,
        speechRecognitionActivated,
      ] = await Promise.all([
        SecureStore.getItemAsync('coins'),
        SecureStore.getItemAsync('unlocked_vision_tests'),
        SecureStore.getItemAsync('unlocked_avatars'),
        SecureStore.getItemAsync('last_tts_update'),
        SecureStore.getItemAsync('speech_recognition_activated'),
      ]);
      if (storedCoins === null) setCoins(0);
      else setCoins(parseInt(storedCoins, 10));

      if (unlockedVisionTests === null) {
        /* for (const [visionTestId, visionTest] of Object.entries(VisionTests)) {
          if (visionTest.price === undefined) {
            unlockVisionTest(visionTestId as VisionTestId);
          }
        } */
        await SecureStore.setItemAsync('unlocked_vision_tests', '');
      } else {
        setUnlockedVisionTests(unlockedVisionTests.split(',') as VisionTestId[]);
      }

      if (unlockedAvatars === null) {
        /* for (const [avatarId, avatar] of Object.entries(Avatars)) {
          if (avatar.price === undefined) {
            unlockAvatar(avatarId as AvatarId);
          }
        } */
        await SecureStore.setItemAsync('unlocked_avatars', '');
      } else {
        setUnlockedAvatars(unlockedAvatars.split(',') as AvatarId[]);
      }

      if (lastTTSUpdate === null) await SecureStore.setItemAsync('last_tts_update', '1651569968');

      if (speechRecognitionActivated === null) {
        const speechRecognitionServices = await Voice.getSpeechRecognitionServices();
        const androidHasSpeechRecognition = speechRecognitionServices && speechRecognitionServices.length;
        if (Platform.OS === 'android' && !androidHasSpeechRecognition) {
          console.warn('is android with no speech recognition');
          await SecureStore.setItemAsync('speech_recognition_activated', '0');
          setSpeechRecognitionActivated(false);
        }
      } else {
        setSpeechRecognitionActivated(speechRecognitionActivated === '1');
      }

      setDataLoaded(true);

      updateIAPsOnce();
    })();
  }, []);

  setPurchaseListener((res) => {
    const updateStoredTransactionIds = async (purchase: InAppPurchase) => {
      const currentStoredProcessedIdString = await SecureStore.getItemAsync('processed_transactions');
      let currentStoredProcessedIds: string[] = [];
      if (currentStoredProcessedIdString !== null) {
        currentStoredProcessedIds = currentStoredProcessedIdString.split(',');
      }
      if (!currentStoredProcessedIds.includes(purchase.orderId)) currentStoredProcessedIds.push(purchase.orderId);
      // The secure storage is hard-limited to 2048 bytes. Strip off old elements on ~850 bytes to be sure.
      if (currentStoredProcessedIds.length > 50) currentStoredProcessedIds.shift();
      SecureStore.setItemAsync('processed_transactions', currentStoredProcessedIds.join(','));
    };
    const finalizePurchase = async (purchase: InAppPurchase) => {
      try {
        await connectAsync();
      } catch (e: any) {
        // Do nothing, most likely already connected
      }
      updateStoredTransactionIds(purchase);
      await finishTransactionAsync(purchase, true);
      try {
        await disconnectAsync();
      } catch (e: any) {
        // Do nothing
      }
    };

    if (res.responseCode === IAPResponseCode.OK) {
      res.results!.forEach((purchase) => {
        if (!purchase.acknowledged) {
          console.log(`Successfully purchased ${purchase.productId}`);

          (async () => {
            /* Sometimes on IOS, the listener is called multiple times on an already processed transaction. Those
            elements permanently get stuck in the queue, unless finishTransaction() is IMMEDIATELY called after the
            listener was called. Even a network request to check if the item is a duplicate takes too long.
            To fix this, we save all processed transaction IDs securely onto the device. On every listener call, we
            fetch this list and check if the transaction ID was seen before. If so, the purchase gets finalized
            ASAP (without adding any coins as it's been processed before). */
            const currentStoredProcessedIdString = await SecureStore.getItemAsync('processed_transactions');
            if (currentStoredProcessedIdString !== null) {
              const currentStoredProcessedIds = currentStoredProcessedIdString.split(',');
              if (currentStoredProcessedIds.includes(purchase.orderId)) {
                console.warn('Duplicate transaction ID called on listener', purchase.orderId);
                finalizePurchase(purchase);
                return;
              }
            }

            let productId = '';
            let devErrorInfo: any = {};
            try {
              const verifyFunction = Platform.OS === 'ios' ? verifyAppleIAPStatic : verifyGoogleIAPStatic;
              const verifyParam = Platform.OS === 'ios' ? purchase.transactionReceipt : purchase.purchaseToken;
              console.log('Token/receipt', verifyParam);
              const { data } = await verifyFunction(verifyParam || '');
              productId = data!.productId!;
              if (!data.granted) {
                devErrorInfo = {
                  data,
                  reason: data.reason,
                  platform: Platform.OS,
                  verifyParam,
                };
                if (data.reason === 'duplicate') throw new Error('duplicate');
                throw new Error('not_granted');
              }

              finalizePurchase(purchase);

              // Purchase successful - award coins
              audio.playSoundEffect('iapSuccess');
              setTimeout(() => {
                switch (productId) {
                  case '100coins':
                    addCoins(100);
                    break;
                  case '250coins':
                    addCoins(250);
                    break;
                  case '500coins':
                    addCoins(500);
                    break;
                  case '1000coins':
                    addCoins(1000);
                    break;
                  default:
                    throw new Error('invalid_product_id');
                }
                audio.playSoundEffect('receiveCoins');
              }, 1000);
            } catch (e: any) {
              if (e.message === 'duplicate') finalizePurchase(purchase);
              else {
                Bugsnag.notify(e, (event) => {
                  event.severity = 'warning';
                  event.addMetadata('additionalData', devErrorInfo);
                });
                Alert.alert('Ups!', `Die Bestellung konnte nicht bearbeitet werden. Bitte öffne die App zu einem \
späteren Zeitpunkt nocheinmal. Es wird automatisch erneut versucht, die Bestellung zu bearbeiten.\
${Helpers.shouldDevToolsBeShown() ? `\n\nZusätzliche Dev-Informationen: \
${e.message}\n\n${JSON.stringify(devErrorInfo)}\n\n${e.stack}`
              : ''}`);
              }
            }
          })();
        } else {
          console.log('Finalizing already acknowleged transaction again', purchase.orderId);
          finalizePurchase(purchase);
        }
      });
    } else if (res.responseCode === IAPResponseCode.USER_CANCELED) {
      console.log('User canceled the transaction');
    } else if (res.responseCode === IAPResponseCode.DEFERRED) {
      console.log('User does not have permissions to buy but requested parental approval (iOS only)');
    } else {
      Bugsnag.notify(new Error(`iap_${res.errorCode}`), (event) => {
        event.severity = 'warning';
        event.addMetadata('additionalData', res);
      });
      console.warn(`Something went wrong with the purchase. Received errorCode ${res.errorCode}`);
    }
  });

  if (!fontsLoaded || !dataLoaded) {
    return <AppLoading />;
  }

  return (
    // eslint-disable-next-line react/jsx-fragments
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StackNavigator />
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
