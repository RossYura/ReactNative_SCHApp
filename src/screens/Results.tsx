import React, {
  useCallback, useEffect, useLayoutEffect, useState,
} from 'react';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import {
  Dimensions,
  InteractionManager,
  StyleSheet,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { deactivateKeepAwake } from 'expo-keep-awake';
import Container from '../components/Container';
import { Result, RootStackParamList, VisionTestResult } from '../types/global';
import { Spacing } from '../styles';
import BigCard from '../components/BigCard';
import Footer from '../components/Footer';
import VisionTests from '../config/vision_tests';
import LongButton from '../components/LongButton';
import WarningMedal from '../assets/images/illu/seh-check-allgemein/resultat-warnung.png';
import BronzeMedal from '../assets/images/illu/seh-check-allgemein/resultat-bronze.png';
import SilverMedal from '../assets/images/illu/seh-check-allgemein/resultat-silber.png';
import GoldMedal from '../assets/images/illu/seh-check-allgemein/resultat-gold.png';
import useStore from '../hooks/useStore';
import useAudio from '../hooks/useAudio';
import Confetti from '../components/Confetti';
import SquareButton from '../components/SquareButton';

const genericResult: VisionTestResult = {
  result: Result.Warning,
  title: 'Oh oh! Da hat etwas nicht funktioniert.',
  description: 'Bitte versuche es erneut.',
  hideDetailsButton: true,
};

export default function ResultsScreen(props: NativeStackScreenProps<RootStackParamList, 'Results'>) {
  const { navigation, route } = props;
  const { details, result: resultKey } = route.params;
  const audio = useAudio();
  const visionTest = useStore((state) => state.visionTest);
  const [confetti, setConfetti] = useState(false);
  const [ttsTimeout, setTTSTimeout] = useState<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        const onClickBackButton = () => {
          audio.playSoundEffect('buttonPress');
          audio.stopTTS();
          if (ttsTimeout) clearTimeout(ttsTimeout);
          navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
        };

        return (
          <SquareButton
            onPress={() => onClickBackButton()}
            icon={{
              name: 'corner-down-left',
            }}
          />
        );
      },
    });
  }, [navigation, audio, ttsTimeout]);

  let result = genericResult;
  if (visionTest) {
    result = VisionTests[visionTest].results.filter((r) => r.result === resultKey)[0] || genericResult;
  }

  const goToDetails = useCallback(() => {
    audio.playSoundEffect('buttonPress');
    navigation.navigate('ResultDetails', { details: details! });
  }, [details]);

  const findOptician = useCallback(() => {
    audio.playSoundEffect('buttonPress');
    WebBrowser.openBrowserAsync('https://www.sehen.de/service/augenoptiker-suche/');
  }, [audio]);

  const findDoctor = useCallback(() => {
    audio.playSoundEffect('buttonPress');
    WebBrowser.openBrowserAsync('https://expertensuche.gesund.bund.de/de/arzt/arztsuche/');
  }, [audio]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      deactivateKeepAwake('visiontest');
      if (result.coinBonus && result.coinBonus > 0) {
        setTimeout(() => navigation.navigate('CoinBonusModal', { coinAmount: result.coinBonus! }), 1000);
      }
      if (resultKey === Result.Bad) audio.playSoundEffect('bronzeMedal');
      else if (resultKey === Result.Good) audio.playSoundEffect('silverMedal');
      else if (resultKey === Result.VeryGood) {
        setConfetti(true);
        audio.playSoundEffect('goldMedal');
      } else audio.playSoundEffect('failMedal');

      const newTTSTimeout = setTimeout(() => {
        let audioResultSuffix = 'Warning';
        if (resultKey === Result.Bad) audioResultSuffix = 'Bad';
        else if (resultKey === Result.Good) audioResultSuffix = 'Good';
        else if (resultKey === Result.VeryGood) audioResultSuffix = 'VeryGood';
        console.log(`${visionTest}Result${audioResultSuffix}`);
        audio.playTTS(`${visionTest}Result${audioResultSuffix}` as any);
      }, resultKey === Result.VeryGood ? 4000 : 2000);
      setTTSTimeout(newTTSTimeout);
    });

    return () => audio.stopTTS();
  }, []);

  let medal = WarningMedal;
  if (resultKey === Result.Bad) medal = BronzeMedal;
  else if (resultKey === Result.Good) medal = SilverMedal;
  else if (resultKey === Result.VeryGood) medal = GoldMedal;

  return (
    <Container style={styles.container} paddedFooter>
      { confetti && (
        <Confetti onAnimationEnd={() => setConfetti(false)} />
      )}
      <StatusBar style="auto" />
      <BigCard
        image={medal}
        title={result.title}
        description={result.description}
      />
      <View style={styles.buttonWrapper}>
        { !result.hideDetailsButton && (
        <LongButton
          title="Details"
          onPress={() => goToDetails()}
        />
        )}
        { result.showDoctorButton ? (
          <LongButton
            title="Augenarzt finden"
            onPress={() => findDoctor()}
            red
            containerStyle={{
              marginLeft: Dimensions.get('window').width > 320 ? Spacing.xs : 0,
              marginTop: Dimensions.get('window').width > 320 ? 0 : Spacing.s,
            }}
          />
        ) : (
          <LongButton
            title="Optiker finden"
            onPress={() => findOptician()}
            green
            containerStyle={{
              marginLeft: Dimensions.get('window').width > 320 ? Spacing.xs : 0,
              marginTop: Dimensions.get('window').width > 320 ? 0 : Spacing.s,
            }}
          />
        )}
      </View>
      <Footer />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.m,
    justifyContent: 'flex-start',
    paddingTop: Dimensions.get('window').width > 375 ? Spacing.xxxl : Spacing.l,
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: Dimensions.get('window').width > 320 ? 'row' : 'column',
    marginTop: Dimensions.get('window').width > 375 ? Spacing.l : Spacing.m,
  },
});
