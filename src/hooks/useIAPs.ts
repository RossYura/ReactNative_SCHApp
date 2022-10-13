import * as InAppPurchases from 'expo-in-app-purchases';
import { useEffect, useState } from 'react';
import Bugsnag from '@bugsnag/expo';
import IAPImages from '../config/iap_images';
import useStore from './useStore';

const productIds = [
  '100coins',
  '250coins',
  '500coins',
  '1000coins',
];

const withImages = (results: InAppPurchases.IAPItemDetails[]) => results.map((result) => ({
  ...result,
  image: IAPImages[result.productId],
}));

const useIAPs = (onPurchaseCompleted?: () => void) => {
  const setInAppPurchases = useStore((state) => state.setInAppPurchases);
  const [connecting, setConnecting] = useState<boolean | null>(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await InAppPurchases.connectAsync().then(() => console.log('Sucessfully connected to App Store'));
        setConnecting(false);
      } catch (e: any) {
        Bugsnag.notify(e, (event) => {
          event.severity = 'error';
        });
        console.warn(e);
        setConnecting(null);
      }
    })();

    return () => {
      InAppPurchases.disconnectAsync().then(() => console.log('Successfully disconnected from App Store'));
    };
  }, []);

  const update = () => {
    setConnecting((currentConnecting) => {
      if (currentConnecting === true) {
        console.log('Still connecting to the App Store, IAP update postponed...');
        setTimeout(() => update(), 100);
        return currentConnecting;
      }
      if (currentConnecting === null) {
        console.error('Couldn\'t seem to connect. IAP update canceled.');
        return currentConnecting;
      }

      (async () => {
        const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);
        console.log('IAP products response', responseCode, results);
        if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
          setInAppPurchases(withImages(results));
        }
      })();

      return currentConnecting;
    });
  };

  const buy = async (productId: string) => {
    if (connecting === null) throw new Error('not_connected_to_app_store');
    setBuying(true);
    try {
      await InAppPurchases.purchaseItemAsync(productId);
      if (onPurchaseCompleted) onPurchaseCompleted();
    } catch (e: any) {
      Bugsnag.notify(e, (event) => {
        event.severity = 'warning';
      });
      console.warn(e);
      // do nothing
    }
    setBuying(false);
  };

  return { update, buy, buying };
};

export const updateIAPsOnce = async () => {
  await InAppPurchases.connectAsync();
  console.log('Sucessfully connected to App Store');

  const { responseCode, results } = await InAppPurchases.getProductsAsync(productIds);
  console.log('IAP products response', responseCode, results);
  if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
    useStore.setState({
      inAppPurchases: withImages(results),
    });
  }
  await InAppPurchases.disconnectAsync();
  console.log('Successfully disconnected from App Store');
};

export default useIAPs;
