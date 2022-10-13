import SehpferdchenImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehpferdchen-inaktiv.png';
import SehFeeImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehfee-inaktiv.png';
import SehadlerImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehadler-inaktiv.png';
import SehlöweImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehloewe-inaktiv.png';
import SehigelImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehigel-inaktiv.png';
import Sehlefantimage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehlefant-inaktiv.png';
import Seh2POImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/seh2po-inaktiv.png';
import SchauSchauImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/schauschau-inaktiv.png';
import GuckGuckImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/guckguck-inaktiv.png';
import SehteufelImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehteufel-inaktiv.png';
import SehbärImage from '../assets/images/illu/tutorial/gefaehrten-auswahl/sehbaer-inaktiv.png';
import SehpferdchenHeadImage from '../assets/images/illu/gefaehrten/sehpferdchen-kopf.png';
import SehFeeHeadImage from '../assets/images/illu/gefaehrten/sehfee-kopf.png';
import SehlöweHeadImage from '../assets/images/illu/gefaehrten/sehloewe-kopf.png';
import Seh2POHeadImage from '../assets/images/illu/gefaehrten/seh2po-kopf.png';
import SehbärHeadImage from '../assets/images/illu/gefaehrten/sehbaer-kopf.png';
import { Avatar, AvatarId } from '../types/global';

// TODO: Add heads (icon)
const Avatars: Record<AvatarId, Avatar> = {
  sehfee: {
    name: 'SehFee',
    image: SehFeeImage,
    headImage: SehFeeHeadImage,
    description: 'Seh-Expertin',
  },
  sehpferdchen: {
    name: 'SehPferdchen',
    image: SehpferdchenImage,
    headImage: SehpferdchenHeadImage,
    description: 'Möhrenliebhaber',
    price: 100,
  },
  sehloewe: {
    name: 'SehLöwe',
    image: SehlöweImage,
    headImage: SehlöweHeadImage,
    description: 'König der Sehvanne',
    price: 100,
  },
  seh2po: {
    name: 'Seh2PO',
    image: Seh2POImage,
    headImage: Seh2POHeadImage,
    description: '0100100001001001',
    price: 100,
  },
  sehbaer: {
    name: 'SehBär',
    image: SehbärImage,
    headImage: SehbärHeadImage,
    description: 'Seh-Champion',
    price: 100,
  },
  sehadler: {
    name: 'SehAdler',
    image: SehadlerImage,
    description: 'Adlerauge per se',
    price: 100,
    disabled: true,
  },
  sehigel: {
    name: 'SehIgel',
    image: SehigelImage,
    description: 'Sieht gestochen scharf',
    price: 100,
    disabled: true,
  },
  sehlefant: {
    name: 'SehLefant',
    image: Sehlefantimage,
    description: 'Grauer Seh-Star',
    price: 100,
    disabled: true,
  },
  schauschau: {
    name: 'SchauSchau',
    image: SchauSchauImage,
    description: 'Wächter des Sehens',
    price: 100,
    disabled: true,
  },
  guckguck: {
    name: 'GuckGuck',
    image: GuckGuckImage,
    description: 'Fliegendes Auge',
    price: 100,
    disabled: true,
  },
  sehteufel: {
    name: 'SehTeufel',
    image: SehteufelImage,
    description: 'Sieht höllisch gut',
    price: 100,
    disabled: true,
  },
};

export default Avatars;
