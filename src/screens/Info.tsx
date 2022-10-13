import React, { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Platform,
  StyleSheet, View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import Voice from '@react-native-voice/voice';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Container from '../components/Container';
import { RootStackParamList } from '../types/global';
import Text from '../components/Text';
import { Colors, Spacing, Typography } from '../styles';
import LongButton from '../components/LongButton';
import useStore from '../hooks/useStore';
import { getApiUrl } from '../utils/api';
import Helpers from '../utils/helpers';
import SquareButton from '../components/SquareButton';
import Speechbubble from '../components/Speechbubble';

export default function InfoScreen(_props: NativeStackScreenProps<RootStackParamList, 'Info'>) {
  const {
    setCoins, setUnlockedAvatars, setUnlockedVisionTests, speechRecognitionActivated, toggleSpeechRecognition,
  } = useStore((state) => ({
    setCoins: state.setCoins,
    setUnlockedAvatars: state.setUnlockedAvatars,
    setUnlockedVisionTests: state.setUnlockedVisionTests,
    speechRecognitionActivated: state.speechRecognitionActivated,
    toggleSpeechRecognition: state.toggleSpeechRecognitionActivated,
  }));
  const insets = useSafeAreaInsets();
  const speechRecognitionBubbleOpacity = useRef(new Animated.Value(1)).current;
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState(false);

  useEffect(() => {
    (async () => {
      const speechRecognitionServices = await Voice.getSpeechRecognitionServices();
      const androidHasSpeechRecognition = Array.isArray(speechRecognitionServices)
        && speechRecognitionServices.length >= 1;
      setHasSpeechRecognition(Platform.OS === 'ios' || androidHasSpeechRecognition);
    })();

    Animated.timing(
      speechRecognitionBubbleOpacity,
      {
        toValue: 0,
        delay: 3000,
        duration: 1000,
        useNativeDriver: true,
      },
    ).start();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Container scrollable style={styles.container} contentContainerStyle={{ paddingBottom: insets.bottom * 2 }}>
        <StatusBar style="auto" />
        <Text style={styles.infoTitle}>Informationen zu den Seh-Checks</Text>
        <Text style={styles.infoText}>
          {'Die digitalen Seh-Checks wurden vom '}
          <Text style={styles.textLink} onPress={() => WebBrowser.openBrowserAsync('https://www.sehen.de')}>Kuratorium Gutes Sehen e.V.</Text>
          {' (KGS) mit Hilfe wissenschaftlicher Berater entwickelt und werden dir weitgehend kostenfrei zur Verfügung \
gestellt. Wenn du sie nach Anweisung durchführst, können sie auf mögliche Sehprobleme hinweisen - ersetzen aber keinen \
professionellen Sehtest. Den kannst du von einem '}
          <Text style={styles.textLink} onPress={() => WebBrowser.openBrowserAsync('https://www.sehen.de/service/augenoptiker-suche/')}>Augenoptiker</Text>
          {' sowie von einem Augenarzt durchführen lassen.\n\n\
Bei Fragen zum Umgang mit Nutzungsdaten, lies bitte unsere '}
          <Text style={styles.textLink} onPress={() => WebBrowser.openBrowserAsync('https://www.seh-check.de/datenschutz/')}>Datenschutzerklärung</Text>
          {'. Informationen über den Betreiber erhältst du im '}
          <Text style={styles.textLink} onPress={() => WebBrowser.openBrowserAsync('https://www.seh-check.de/impressum/')}>Impressum</Text>
          {' der Website '}
          <Text style={styles.textLink} onPress={() => WebBrowser.openBrowserAsync('https://www.seh-check.de')}>www.seh-check.de</Text>
          {'.\n\n\
Soundeffekte von GameChest Audio. Ishihara-Tests basieren auf „Eight Ishihara charts for testing colour blindness, \
Europe, 1917-1959“ by Science Museum, London. Credit: Science Museum, London. CC BY / Änderungen: Freigestellt und \
farblich modifiziert.'}
        </Text>
        { Helpers.shouldDevToolsBeShown() && (
        <View style={styles.devToolsWrapper}>
          <Text style={styles.devToolsTitle}>Dev Tools</Text>
          <LongButton
            title="Coins auf 0 setzen"
            onPress={() => {
              SecureStore.setItemAsync('coins', '0');
              setCoins(0);
            }}
            containerStyle={styles.devToolsButton}
          />
          <LongButton
            title="Coins auf 20 setzen"
            onPress={() => {
              SecureStore.setItemAsync('coins', '20');
              setCoins(20);
            }}
            containerStyle={styles.devToolsButton}
          />
          <LongButton
            title="Coins auf 1000 setzen"
            onPress={() => {
              SecureStore.setItemAsync('coins', '1000');
              setCoins(1000);
            }}
            containerStyle={styles.devToolsButton}
          />
          <LongButton
            title="Alle Unlocks sperren"
            onPress={async () => {
              await SecureStore.setItemAsync('unlocked_avatars', '');
              await SecureStore.setItemAsync('unlocked_vision_tests', '');
              setUnlockedAvatars([]);
              setUnlockedVisionTests([]);
            }}
            containerStyle={styles.devToolsButton}
          />
          <Text style={styles.devToolsTextItem}>
            API URL:
            {' '}
            {getApiUrl() || 'NICHT DEFINIERT'}
          </Text>
        </View>
        )}
      </Container>
      { hasSpeechRecognition && (
        <View
          style={{ ...styles.toggleSpeechRecognitionButtonWrapper, bottom: insets.bottom + Spacing.m }}
        >
          <Animated.View style={{ opacity: speechRecognitionBubbleOpacity }}>
            <Speechbubble
              text={speechRecognitionActivated ? 'Spracherkennung deaktivieren' : 'Spracherkennung aktivieren'}
              cornerLocation="right"
              style={{ marginRight: Spacing.s }}
            />
          </Animated.View>
          <SquareButton
            icon={{
              name: speechRecognitionActivated ? 'mic' : 'mic-off',
              color: speechRecognitionActivated ? Colors.gray : Colors.red,
            }}
            onPress={() => toggleSpeechRecognition()}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  devToolsWrapper: {
    width: '100%',
    display: 'flex',
    marginTop: Spacing.xl,
  },
  devToolsTitle: {
    fontSize: Typography.sizes.l,
    color: Colors.purple,
    fontWeight: 'bold',
  },
  devToolsButton: {
    marginTop: Spacing.s,
  },
  devToolsTextItem: {
    marginTop: Spacing.s,
    textAlign: 'center',
    color: Colors.purple,
  },
  container: {
    paddingHorizontal: Spacing.m,
  },
  logo: {
    width: '35%',
    height: undefined,
    aspectRatio: 1,
    marginBottom: Spacing.m,
  },
  infoTitle: {
    fontSize: Typography.sizes.xxl,
    fontWeight: 'bold',
    color: Colors.purple,
    marginBottom: Spacing.s,
    textAlign: 'left',
    width: '100%',
  },
  infoText: {
    color: Colors.purple,
    marginBottom: Spacing.s,
    fontSize: Typography.sizes.m,
  },
  textLink: {
    textDecorationLine: 'underline',
  },
  toggleSpeechRecognitionButtonWrapper: {
    position: 'absolute',
    right: Spacing.m,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
