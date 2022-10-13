import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackHeaderProps } from '@react-navigation/native-stack';
import {
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/Home';
import ChooseVisionTestScreen from '../screens/ChooseVisionTest';
import { RootStackParamList } from '../types/global';
import Colors from '../styles/colors';
import ChooseAvatarScreen from '../screens/ChooseAvatar';
import Text from '../components/Text';
import Logo from '../assets/images/meta/logo.png';
import SquareButton from '../components/SquareButton';
import Helpers from '../utils/helpers';
import { Sizing } from '../styles';
import InfoScreen from '../screens/Info';
import ReadyScreen from '../screens/Ready';
import GiftModalScreen from '../screens/GiftModal';
import DescriptionScreen from '../screens/Description';
import BuyCoinsModalScreen from '../screens/BuyCoinsModal';
import ResultsScreen from '../screens/Results';
import CoinBonusModalScreen from '../screens/CoinBonusModal';
import ResultDetailsScreen from '../screens/ResultDetails';
import SharpnessVisionTestScreen from '../screens/VisionTests/Sharpness';
import ColorVisionTestScreen from '../screens/VisionTests/Color';
import ShortsightVisionTestScreen from '../screens/VisionTests/Shortsight';
import FarsightVisionTestScreen from '../screens/VisionTests/Farsight';
import MakulaVisionTestScreen from '../screens/VisionTests/Makula';
import LandoltVisionTestScreen from '../screens/VisionTests/Landolt';
import useAudio from '../hooks/useAudio';
import BackButton from '../components/BackButton';
import NoMicInfoScreen from '../screens/NoMicInfo';
import KidsVisionTestScreen from '../screens/VisionTests/Kids';
import SpeakerTestScreen from '../screens/SpeakerTest';
import MicActivateScreen from '../screens/MicActivate';
import AidScreen from '../screens/Aid';

const Stack = createNativeStackNavigator<RootStackParamList>();

function CustomHeader(props: NativeStackHeaderProps) {
  const { options, route, navigation } = props;

  const insets = useSafeAreaInsets();
  const headerHeight = Helpers.getHeaderHeight(insets);

  return (
    <View style={{
      height: headerHeight,
      paddingTop: insets.top,
      width: '100%',
      backgroundColor: Colors.white,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 20,
      paddingRight: 20,
    }}
    >
      <View style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
        { options.headerLeft ? options.headerLeft({ canGoBack: false }) : (
          <TouchableOpacity
            onPress={() => route.name === 'Home'
              ? null
              : navigation.reset({ index: 0, routes: [{ name: 'Home' }] })}
          >
            <Image
              style={{ width: Sizing.logo, height: Sizing.logo }}
              source={Logo}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={{
        textAlign: 'center', color: Colors.purple,
      }}
      >
        {(options.title || route.name).toUpperCase()}
      </Text>
      <View style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
        { options.headerRight ? options.headerRight({ canGoBack: false }) : null}
      </View>
    </View>
  );
}

const transparentModalOptions = {
  presentation: 'transparentModal',
  animation: 'fade',
  cardOverlayEnabled: true,
  cardStyleInterpolator: ({ current: { progress } }: any) => ({
    cardStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 0.5, 0.9, 1],
        outputRange: [0, 0.25, 0.7, 1],
      }),
    },
    overlayStyle: {
      opacity: progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.5],
        extrapolate: 'clamp',
      }),
    },
  }),
};

function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={(props) => ({
          header: CustomHeader,
          headerRight: () => props.navigation.canGoBack() ? BackButton(props) : null,
        })}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={(props) => ({
            title: 'Willkommen',
            headerRight: () => {
              const { navigation } = props;
              const audio = useAudio();

              const onClickButton = () => {
                audio.playSoundEffect('buttonPress');
                navigation.navigate('Info');
              };

              return (
                <SquareButton
                  onPress={() => onClickButton()}
                  icon={{
                    name: 'info',
                  }}
                />
              );
            },
            animation: 'fade',
          })}
        />
        <Stack.Screen
          name="Info"
          component={InfoScreen}
          options={(props) => ({
            title: 'Informationen',
            headerRight: props.navigation.canGoBack() ? () => {
              const { navigation } = props;
              const audio = useAudio();

              const onClickButton = () => {
                audio.playSoundEffect('buttonPress');
                navigation.goBack();
              };

              return (
                <SquareButton
                  onPress={() => onClickButton()}
                  icon={{
                    name: 'check',
                    color: Colors.green,
                  }}
                />
              );
            } : undefined,
          })}
        />
        <Stack.Screen
          name="ChooseVisionTest"
          component={ChooseVisionTestScreen}
          options={{ title: 'Wähle einen Seh-Check' }}
        />
        <Stack.Screen
          name="ChooseAvatar"
          component={ChooseAvatarScreen}
          options={{ title: 'Wähle einen Gefährten' }}
        />
        <Stack.Screen
          name="SpeakerTest"
          component={SpeakerTestScreen}
          options={{ title: 'Lautsprecher-Test' }}
        />
        <Stack.Screen
          name="MicActivate"
          component={MicActivateScreen}
          options={{ title: 'Spracherkennung' }}
        />
        <Stack.Screen
          name="NoMicInfo"
          component={NoMicInfoScreen}
          options={() => ({
            title: 'Information',
          })}
        />
        <Stack.Screen
          name="Aid"
          component={AidScreen}
          options={{ title: 'Sehhilfe' }}
        />
        <Stack.Screen
          name="Ready"
          component={ReadyScreen}
          options={() => ({
            title: 'Gleich geht es los',
          })}
        />
        <Stack.Screen
          name="Description"
          component={DescriptionScreen}
          options={() => ({
            title: 'Das ist deine Aufgabe',
            animation: 'none',
          })}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={() => ({
            title: 'Ergebnis',
          })}
        />
        <Stack.Screen
          name="ResultDetails"
          component={ResultDetailsScreen}
          options={(props) => ({
            title: 'Ergebnis-Details',
            headerRight: props.navigation.canGoBack() ? () => {
              const { navigation } = props;
              const audio = useAudio();

              const onClickButton = () => {
                audio.playSoundEffect('buttonPress');
                navigation.goBack();
              };

              return (
                <SquareButton
                  onPress={() => onClickButton()}
                  icon={{
                    name: 'check',
                    color: Colors.green,
                  }}
                />
              );
            } : undefined,
          })}
        />
        <Stack.Group>
          <Stack.Screen
            name="SharpnessVisionTest"
            component={SharpnessVisionTestScreen}
            options={{
              title: 'Hornhautverkrümmung',
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="MakulaVisionTest"
            component={MakulaVisionTestScreen}
            options={{
              title: 'Makula-Degeneration',
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="ColorVisionTest"
            component={ColorVisionTestScreen}
            options={{
              title: 'Rot-Grün-Sehschwäche',
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="ShortsightVisionTest"
            component={ShortsightVisionTestScreen}
            options={{
              title: 'Kurzsichtigkeit',
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="FarsightVisionTest"
            component={FarsightVisionTestScreen}
            options={{
              title: 'Weitsichtigkeit',
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="LandoltVisionTest"
            component={LandoltVisionTestScreen}
            options={{
              title: 'Kurzsichtigkeit',
              animation: 'none',
            }}
          />
          <Stack.Screen
            name="KidsVisionTest"
            component={KidsVisionTestScreen}
            options={{
              animation: 'none',
            }}
          />
        </Stack.Group>
        <Stack.Group
          screenOptions={{
            headerShown: false,
            title: ' ',
            ...transparentModalOptions as any,
          }}
        >
          <Stack.Screen
            name="GiftModal"
            component={GiftModalScreen}
          />
          <Stack.Screen
            name="BuyCoinsModal"
            component={BuyCoinsModalScreen}
          />
          <Stack.Screen
            name="CoinBonusModal"
            component={CoinBonusModalScreen}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
