// eslint-disable-next-line import/no-cycle
import { AvatarId } from '../../types/global';
import MenuConfirmation from '../../assets/audio/effects/menu-confirmation.mp3';
import MenuClick from '../../assets/audio/effects/menu-click.mp3';
import MenuButtonPress from '../../assets/audio/effects/menu-button-press.mp3';
import CollectItem from '../../assets/audio/effects/collect-item.mp3';
import GameLevelStart from '../../assets/audio/effects/game-level-start.mp3';
import Coin from '../../assets/audio/effects/coin.mp3';
import Coins from '../../assets/audio/effects/coins.mp3';
import WinBig from '../../assets/audio/effects/win-big.mp3';
import WinSmall from '../../assets/audio/effects/win-small.mp3';
import Error from '../../assets/audio/effects/error.mp3';
import CelebrationBig from '../../assets/audio/effects/celebration-big.mp3';
import CelebrationMedium from '../../assets/audio/effects/celebration-medium.mp3';
import CelebrationSmall from '../../assets/audio/effects/celebration-small.mp3';
import Fail from '../../assets/audio/effects/fail.mp3';
import UnknownTTS from '../../assets/audio/tts/unknown.mp3';
import Seh2POBundledAudios from './seh2po';
import SehbärBundledAudios from './sehbaer';
import SehfeeBundledAudios from './sehfee';
import SehlöweBundledAudios from './sehloewe';
import SehpferdchenBundledAudios from './sehpferdchen';

type TTSMappingType = Record<
keyof typeof SehfeeBundledAudios,
{ onlinePrefix: string, bundled?: Partial<Record<AvatarId, any>> }
>;
const TTSMapping: TTSMappingType = {
  generalRepeat: { onlinePrefix: 'audio-allgemein-wiederholen' },
  generalName: { onlinePrefix: 'audio-allgemein-name' },
  tutorialScreenSettings: { onlinePrefix: 'audio-tutorial-bildschirmeinstellungen' },
  tutorialSpeakerTest: { onlinePrefix: 'audio-tutorial-lautsprecher-test' },
  tutorialMicTest1: { onlinePrefix: 'audio-tutorial-mikrofon-test' },
  tutorialMicTest2: { onlinePrefix: 'audio-tutorial-mikrofon-test-2' },
  tutorialAid: { onlinePrefix: 'audio-tutorial-sehhilfe' },
  tutorialVoiceRecognitionSelection: { onlinePrefix: 'audio-tutorial-spracherkennung-auswahl-app' },
  tutorialVoiceRecognitionConsent: { onlinePrefix: 'audio-tutorial-spracherkennung-consent' },
  makulaReady: { onlinePrefix: 'audio-amsler-gitter-test-ready' },
  makulaDescription: { onlinePrefix: 'audio-amsler-gitter-test-description' },
  makulaResultBad: { onlinePrefix: 'audio-amsler-gitter-test-ergebnis-schlecht' },
  makulaResultVeryGood: { onlinePrefix: 'audio-amsler-gitter-test-ergebnis-sehr-gut' },
  makulaLeftHand: { onlinePrefix: 'audio-amsler-gitter-test-linke-hand' },
  makulaRightHand: { onlinePrefix: 'audio-amsler-gitter-test-rechte-hand' },
  sharpnessReady: { onlinePrefix: 'audio-hornhautverkruemmung-test-ready' },
  sharpnessDescription: { onlinePrefix: 'audio-hornhautverkruemmung-test-description' },
  sharpnessResultWarning: { onlinePrefix: 'audio-hornhautverkruemmung-test-ergebnis-schlecht' },
  sharpnessResultVeryGood: { onlinePrefix: 'audio-hornhautverkruemmung-test-ergebnis-sehr-gut' },
  sharpnessLeftHand: { onlinePrefix: 'audio-hornhautverkruemmung-test-linke-hand' },
  sharpnessRightHand: { onlinePrefix: 'audio-hornhautverkruemmung-test-rechte-hand' },
  kidsReady: { onlinePrefix: 'audio-kinder-sehschwaeche-test-ready' },
  kidsInformation: { onlinePrefix: 'audio-kinder-sehschwaeche-test-information' },
  kidsDescription: { onlinePrefix: 'audio-kinder-sehschwaeche-test-description' },
  kidsResultWarning: { onlinePrefix: 'audio-kinder-sehschwaeche-test-ergebnis-achtung' },
  kidsResultBad: { onlinePrefix: 'audio-kinder-sehschwaeche-test-ergebnis-schlecht' },
  kidsResultGood: { onlinePrefix: 'audio-kinder-sehschwaeche-test-ergebnis-gut' },
  kidsResultVeryGood: { onlinePrefix: 'audio-kinder-sehschwaeche-test-ergebnis-sehr-gut' },
  kidsLeftHand: { onlinePrefix: 'audio-kinder-sehschwaeche-test-linke-hand' },
  kidsRightHand: { onlinePrefix: 'audio-kinder-sehschwaeche-test-rechte-hand' },
  kidsStory1: { onlinePrefix: 'audio-kinder-sehschwaeche-test-story-1' },
  kidsStory2: { onlinePrefix: 'audio-kinder-sehschwaeche-test-story-2' },
  kidsStory3: { onlinePrefix: 'audio-kinder-sehschwaeche-test-story-3' },
  kidsStory4: { onlinePrefix: 'audio-kinder-sehschwaeche-test-story-4' },
  landoltReady: { onlinePrefix: 'audio-landoltring-test-ready' },
  landoltReadyNoMic: { onlinePrefix: 'audio-landoltring-test-ready-no-mic' },
  landoltInfo: { onlinePrefix: 'audio-landoltring-test-info' },
  landoltDescription: { onlinePrefix: 'audio-landoltring-test-description' },
  landoltResultWarning: { onlinePrefix: 'audio-landoltring-test-ergebnis-warnung' },
  landoltResultBad: { onlinePrefix: 'audio-landoltring-test-ergebnis-schlecht' },
  landoltResultGood: { onlinePrefix: 'audio-landoltring-test-ergebnis-gut' },
  landoltResultVeryGood: { onlinePrefix: 'audio-landoltring-test-ergebnis-sehr-gut' },
  landoltLeftHand: { onlinePrefix: 'audio-landoltring-test-linke-hand' },
  landoltRightHand: { onlinePrefix: 'audio-landoltring-test-rechte-hand' },
  shortsightReady: { onlinePrefix: 'audio-kurzsichtigkeit-test-ready' },
  shortsightReadyNoMic: { onlinePrefix: 'audio-kurzsichtigkeit-test-ready-no-mic' },
  shortsightInfo: { onlinePrefix: 'audio-kurzsichtigkeit-test-info' },
  shortsightDescription: { onlinePrefix: 'audio-kurzsichtigkeit-test-description' },
  shortsightResultWarning: { onlinePrefix: 'audio-kurzsichtigkeit-test-ergebnis-warnung' },
  shortsightResultBad: { onlinePrefix: 'audio-kurzsichtigkeit-test-ergebnis-schlecht' },
  shortsightResultGood: { onlinePrefix: 'audio-kurzsichtigkeit-test-ergebnis-gut' },
  shortsightResultVeryGood: { onlinePrefix: 'audio-kurzsichtigkeit-test-ergebnis-sehr-gut' },
  shortsightLeftHand: { onlinePrefix: 'audio-kurzsichtigkeit-test-linke-hand' },
  shortsightRightHand: { onlinePrefix: 'audio-kurzsichtigkeit-test-rechte-hand' },
  colorReady: { onlinePrefix: 'audio-rot-gruen-sehschwaeche-test-ready' },
  colorDescription: { onlinePrefix: 'audio-rot-gruen-sehschwaeche-test-description' },
  colorResultWarning: { onlinePrefix: 'audio-rot-gruen-sehschwaeche-test-ergebnis-schlecht' },
  colorResultGood: { onlinePrefix: 'audio-rot-gruen-sehschwaeche-test-ergebnis-gut' },
  colorResultVeryGood: { onlinePrefix: 'audio-rot-gruen-sehschwaeche-test-ergebnis-sehr-gut' },
  farsightReady: { onlinePrefix: 'audio-weitsichtigkeit-test-ready' },
  farsightDescription: { onlinePrefix: 'audio-weitsichtigkeit-test-description' },
  farsightResultWarning: { onlinePrefix: 'audio-weitsichtigkeit-test-ergebnis-warnung' },
  farsightResultBad: { onlinePrefix: 'audio-weitsichtigkeit-test-ergebnis-schlecht' },
  farsightResultGood: { onlinePrefix: 'audio-weitsichtigkeit-test-ergebnis-gut' },
  farsightResultVeryGood: { onlinePrefix: 'audio-weitsichtigkeit-test-ergebnis-sehr-gut' },
};

for (const ttsKey in TTSMapping) {
  if (!Object.prototype.hasOwnProperty.call(TTSMapping, ttsKey)) continue;
  TTSMapping[ttsKey as keyof typeof TTSMapping] = {
    ...TTSMapping[ttsKey as keyof typeof TTSMapping],
    bundled: {
      seh2po: Seh2POBundledAudios[ttsKey as keyof typeof Seh2POBundledAudios],
      sehbaer: SehbärBundledAudios[ttsKey as keyof typeof SehbärBundledAudios],
      sehfee: SehfeeBundledAudios[ttsKey as keyof typeof SehfeeBundledAudios],
      sehloewe: SehlöweBundledAudios[ttsKey as keyof typeof SehlöweBundledAudios],
      sehpferdchen: SehpferdchenBundledAudios[ttsKey as keyof typeof SehpferdchenBundledAudios],
    },
  };
}

const AudioMapping = {
  effects: {
    startButton: MenuConfirmation,
    dailyGift: CollectItem,
    coinBonus: CollectItem,
    chooseVisionTest: MenuClick,
    chooseAvatar: MenuClick,
    visionTestChosen: GameLevelStart,
    avatarChosen: GameLevelStart,
    unlockedVisionTest: WinBig,
    unlockedAvatar: WinBig,
    receiveCoin: Coin,
    receiveCoins: Coins,
    iapSuccess: WinBig,
    correctAnswer: WinSmall,
    wrongAnswer: Error,
    buttonPress: MenuButtonPress,
    goldMedal: CelebrationBig,
    silverMedal: CelebrationMedium,
    bronzeMedal: CelebrationSmall,
    failMedal: Fail,
  },
  tts: {
    ...TTSMapping,
    unknown: UnknownTTS,
  },
};

export default AudioMapping as typeof AudioMapping & Record<
keyof typeof SehfeeBundledAudios,
{ onlinePrefix: string, bundled?: Record<AvatarId, any> }
>;
