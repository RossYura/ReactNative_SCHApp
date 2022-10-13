import create from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { AvatarId, InAppPurchaseItem, VisionTestId } from '../types/global';

export interface AppState {
  speaking: boolean;
  listening: boolean;
  visionTest: VisionTestId | null;
  avatar: AvatarId | null;
  coins: number;
  connectedToAppStore: boolean;
  inAppPurchases: InAppPurchaseItem[];
  unlockedVisionTests: VisionTestId[];
  unlockedAvatars: AvatarId[];
  speechRecognitionActivated: boolean | null;
  setSpeaking: (speaking: boolean) => void;
  setListening: (listening: boolean) => void;
  setVisionTest: (visionTest: VisionTestId) => void;
  setAvatar: (avatar: AvatarId) => void;
  setCoins: (coins: number) => void;
  addCoins: (addend: number) => void;
  setConnectedToAppStore: (connectedToAppStore: boolean) => void;
  setInAppPurchases: (inAppPurchases: InAppPurchaseItem[]) => void;
  unlockVisionTest: (visionTest: VisionTestId) => void;
  setUnlockedVisionTests: (unlockedVisionTests: VisionTestId[]) => void;
  unlockAvatar: (avatar: AvatarId) => void;
  setUnlockedAvatars: (unlockedAvatars: AvatarId[]) => void;
  setSpeechRecognitionActivated: (speechRecognitionActivated: boolean) => void;
  toggleSpeechRecognitionActivated: () => void;
}

const useStore = create<AppState>((set, get) => ({
  speaking: false,
  listening: false,
  visionTest: null,
  avatar: null,
  coins: 0,
  connectedToAppStore: false,
  inAppPurchases: [],
  unlockedVisionTests: [],
  unlockedAvatars: [],
  speechRecognitionActivated: null,
  setSpeaking: (speaking) => set({ speaking }),
  setListening: (listening) => set({ listening }),
  setVisionTest: (visionTest) => set({ visionTest }),
  setAvatar: (avatar) => set({ avatar }),
  setCoins: (coins) => set({ coins }),
  addCoins: (addend) => set((state) => ({ coins: state.coins + addend })),
  setInAppPurchases: (inAppPurchases) => set({ inAppPurchases }),
  setConnectedToAppStore: (connectedToAppStore: boolean) => set({ connectedToAppStore }),
  unlockVisionTest: async (visionTest: VisionTestId) => {
    SecureStore.setItemAsync('unlocked_vision_tests', [...get().unlockedVisionTests, visionTest].join(','));
    return set(
      (state) => ({ unlockedVisionTests: [...state.unlockedVisionTests, visionTest] }),
    );
  },
  setUnlockedVisionTests: (unlockedVisionTests: VisionTestId[]) => set({ unlockedVisionTests }),
  unlockAvatar: async (avatar: AvatarId) => {
    SecureStore.setItemAsync('unlocked_avatars', [...get().unlockedAvatars, avatar].join(','));
    return set(
      (state) => ({ unlockedAvatars: [...state.unlockedAvatars, avatar] }),
    );
  },
  setUnlockedAvatars: (unlockedAvatars: AvatarId[]) => set({ unlockedAvatars }),
  setSpeechRecognitionActivated: async (speechRecognitionActivated: boolean) => {
    SecureStore.setItemAsync('speech_recognition_activated', speechRecognitionActivated ? '1' : '0');
    return set({ speechRecognitionActivated });
  },
  toggleSpeechRecognitionActivated: async () => {
    SecureStore.setItemAsync('speech_recognition_activated', get().speechRecognitionActivated ? '0' : '1');
    return set((state) => ({ speechRecognitionActivated: !state.speechRecognitionActivated }));
  },
}));

export default useStore;
