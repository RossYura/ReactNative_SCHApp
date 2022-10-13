import { ImageSourcePropType } from 'react-native';
import Coins100 from '../assets/images/illu/store/100-coins-inaktiv.png';
import Coins250 from '../assets/images/illu/store/250-coins-inaktiv.png';
import Coins500 from '../assets/images/illu/store/500-coins-inaktiv.png';
import Coins750 from '../assets/images/illu/store/750-coins-inaktiv.png';

const IAPImages: Record<string, ImageSourcePropType> = {
  '100coins': Coins100,
  '250coins': Coins250,
  '500coins': Coins500,
  '1000coins': Coins750,
};

export default IAPImages;
