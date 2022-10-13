import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import Bugsnag from '@bugsnag/expo';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import Container from '../components/Container';
import LongButton from '../components/LongButton';
import { RootStackParamList } from '../types/global';
import Text from '../components/Text';
import { Colors, Spacing, Typography } from '../styles';
import StartImageSwitcher from '../components/StartImageSwitcher';
import Footer from '../components/Footer';
import useAudio from '../hooks/useAudio';
import { useGetServerTime } from '../hooks/query/system';

export default function HomeScreen(props: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  const { navigation } = props;
  const audio = useAudio();
  const serverTime = useGetServerTime({ staleTime: 5 * 60 * 1000 });

  // eslint-disable-next-line arrow-body-style
  const checkForDailyGift = async () => {
    const lastGiftUnix = await SecureStore.getItemAsync('last_daily_gift');
    if (lastGiftUnix === null) return true;
    if (!serverTime.data || !serverTime.data.time) return false;

    const lastGift = dayjs.unix(parseInt(lastGiftUnix, 10));
    const serverDate = dayjs(serverTime.data.time);
    if (serverDate.isAfter(lastGift, 'day')) return true;
    return false;
  };

  useEffect(() => {
    if (!serverTime.data) return;
    setTimeout(() => {
      checkForDailyGift().then((allowed) => {
        if (allowed) {
          navigation.navigate('GiftModal');
          SecureStore.setItemAsync('last_daily_gift', dayjs().unix().toString());
        }
      });
    }, 1000);
  }, [serverTime]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(async () => {
      const rawAlreadyScheduled = await SecureStore.getItemAsync('scheduled_notifications');
      let alreadyScheduled = false;
      if (rawAlreadyScheduled !== null && parseInt(rawAlreadyScheduled, 10) as 0 | 1 === 1) {
        alreadyScheduled = true;
      }

      if (!alreadyScheduled) {
        console.log('Scheduling notifications...');
        try {
          await Promise.all([
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Sehtest beim Optiker',
                body: 'Weißt du, was noch besser ist als die Seh-Check-App? Ein Sehtest beim Fachmann. Jetzt \
Augenoptiker in der Nähe finden.',
              // data: { data: '...' },
              },
              trigger: {
                seconds: 14 * 24 * 60 * 60, // ~14 days
                repeats: true,
              },
            }),
            Notifications.scheduleNotificationAsync({
              content: {
                title: 'Sehtest alle zwei Jahre!',
                body: 'Wir empfehlen dir, alle zwei Jahre einen Termin beim Fachmann zu vereinbaren. Jetzt \
Augenoptiker in der Nähe finden.',
              // data: { data: '...' },
              },
              trigger: {
                seconds: 6 * 30 * 24 * 60 * 60, // ~6 months
                repeats: true,
              },
            }),
          ]);
          SecureStore.setItemAsync('scheduled_notifications', '1');
          console.log('Notifications successfully scheduled.');
        } catch (e: any) {
          console.warn('Error while scheduling notifications', e);
          Bugsnag.notify(e, (event) => {
            event.severity = 'warning';
          });
        }
      }
    });
  }, []);

  const onClickStart = () => {
    audio.playSoundEffect('startButton');
    navigation.navigate('ChooseVisionTest');
  };

  return (
    <Container paddedFooter>
      <StatusBar style="auto" />
      <StartImageSwitcher />
      <Text style={styles.kgsText}>Kuratorium Gutes Sehen e.V.</Text>
      <Text style={styles.appTitle}>Seh-Check-App</Text>
      <LongButton
        onPress={() => onClickStart()}
        title="Los geht's"
      />
      <Footer />
    </Container>
  );
}

const registerForPushNotificationsAsync = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return;
  }
  // token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: Colors.purple,
    });
  }
};

const styles = StyleSheet.create({
  logo: {
    width: '35%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: Spacing.m,
  },
  kgsText: {
    color: Colors.lightPurple,
    marginBottom: Spacing.s,
    fontSize: Typography.sizes.m,
  },
  appTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: 'bold',
    color: Colors.purple,
    marginBottom: Spacing.xxl,
  },
});
