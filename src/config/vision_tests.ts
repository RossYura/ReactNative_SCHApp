import Sharpness from '../assets/images/illu/tutorial/seh-check-auswahl/schaerfe-seh-check-inaktiv.png';
import Color from '../assets/images/illu/tutorial/seh-check-auswahl/farbenblindheit-inaktiv.png';
import Shortsight from '../assets/images/illu/tutorial/seh-check-auswahl/kurzsichtigkeit-inaktiv.png';
import Farsight from '../assets/images/illu/tutorial/seh-check-auswahl/weitsichtigkeit-inaktiv.png';
import Makula from '../assets/images/illu/tutorial/seh-check-auswahl/makula-degeneration-inaktiv.png';
import Landolt from '../assets/images/illu/tutorial/seh-check-auswahl/landoltring-inaktiv.png';
// import Kids from '../assets/images/illu/tutorial/seh-check-auswahl/kinder-seh-check-inaktiv.png';
import ComingSoon from '../assets/images/illu/tutorial/seh-check-auswahl/coming-soon-inaktiv.png';
import SharpnessNoShadow from '../assets/images/illu/tutorial/seh-check-auswahl/schaerfe-seh-check-ohne-schatten.png';
import ColorNoShadow from '../assets/images/illu/tutorial/seh-check-auswahl/farbenblindheit-ohne-schatten.png';
import ShortsightNoShadow from '../assets/images/illu/tutorial/seh-check-auswahl/kurzsichtigkeit-ohne-schatten.png';
import FarsightNoShadow from '../assets/images/illu/tutorial/seh-check-auswahl/weitsichtigkeit-ohne-schatten.png';
import MakulaNoShadow from '../assets/images/illu/tutorial/seh-check-auswahl/makula-degeneration-ohne-schatten.png';
import LandoltNoShadow from '../assets/images/illu/tutorial/seh-check-auswahl/landoltring-ohne-schatten.png';
import KidsNoShadow from '../assets/images/illu/tutorial/seh-check-auswahl/kinder-seh-check-ohne-schatten.png';
import { VisionTest, VisionTestId, Result } from '../types/global';
import Ishihara2Image from '../assets/images/sehtestzeichen/ishihara-2.png';
import Ishihara3Image from '../assets/images/sehtestzeichen/ishihara-3-5.png';
import Ishihara6Image from '../assets/images/sehtestzeichen/ishihara-6.png';
import Ishihara12Image from '../assets/images/sehtestzeichen/ishihara-12.png';
import Ishihara29Image from '../assets/images/sehtestzeichen/ishihara-29-70.png';
import Ishihara45Image from '../assets/images/sehtestzeichen/ishihara-45.png';
import Ishihara74Image from '../assets/images/sehtestzeichen/ishihara-74-71.png';
import Ishihara97Image from '../assets/images/sehtestzeichen/ishihara-97.png';
import LandoltPosition1Image from '../assets/images/sehtestzeichen/landoltring-position-1.svg';
import LandoltPosition2Image from '../assets/images/sehtestzeichen/landoltring-position-2.svg';
import LandoltPosition3Image from '../assets/images/sehtestzeichen/landoltring-position-3.svg';
import LandoltPosition4Image from '../assets/images/sehtestzeichen/landoltring-position-4.svg';
import LandoltPosition5Image from '../assets/images/sehtestzeichen/landoltring-position-5.svg';
import LandoltPosition6Image from '../assets/images/sehtestzeichen/landoltring-position-6.svg';
import LandoltPosition7Image from '../assets/images/sehtestzeichen/landoltring-position-7.svg';
import LandoltPosition8Image from '../assets/images/sehtestzeichen/landoltring-position-8.svg';
import KidsStoryShortsight from '../assets/images/illu/seh-check-allgemein/neu-seh-land-story-sommer.png';
import KidsStoryColor from '../assets/images/illu/seh-check-allgemein/neu-seh-land-story-herbst.png';
import KidsStoryContrast from '../assets/images/illu/seh-check-allgemein/neu-seh-land-story-winter.png';
import KidsStoryEnd from '../assets/images/illu/seh-check-allgemein/neu-seh-land-story-fruehling.png';
import KidsTestShortsight from '../assets/images/illu/neu-seh-land-landschaft-sommer.png';
import KidsTestColor from '../assets/images/illu/neu-seh-land-landschaft-herbst.png';
import KidsTestContrast from '../assets/images/illu/neu-seh-land-landschaft-winter.png';
import KidsTestEnd from '../assets/images/illu/neu-seh-land-landschaft-fruehling.png';
import KidsSquareSymbol from '../assets/images/sehtestzeichen/viereck.svg';
import KidsHouseSymbol from '../assets/images/sehtestzeichen/haus.svg';
import KidsAppleSymbol from '../assets/images/sehtestzeichen/apfel.svg';
import KidsCircleSymbol from '../assets/images/sehtestzeichen/kreis.svg';
import KidsColorSquareSymbol from '../assets/images/sehtestzeichen/ishihara-viereck.svg';
import KidsColorHouseSymbol from '../assets/images/sehtestzeichen/ishihara-haus.svg';
import KidsColorAppleSymbol from '../assets/images/sehtestzeichen/ishihara-apfel.svg';
import KidsColorAppleControlSymbol from '../assets/images/sehtestzeichen/ishihara-apfel-kontrolle.svg';
import KidsColorCircleSymbol from '../assets/images/sehtestzeichen/ishihara-kreis.svg';

const VisionTests: Record<VisionTestId, VisionTest> = {
  shortsight: {
    name: 'Fern-Seh-Check',
    description: 'Sehen in der Ferne\n(Kurzsichtigkeit)',
    image: Shortsight,
    imageNoShadow: ShortsightNoShadow,
    firstScreenName: 'Ready',
    mainScreenName: 'ShortsightVisionTest',
    readyScreen: {
      title: 'Bereit? Halte 60 cm Abstand zu deinem Bildschirm.',
      text: 'Das ist in etwa eine Armlänge.',
      ttsKey: 'shortsightReadyNoMic',
    },
    descriptionScreen: {
      title: 'Wähle die Zahlen aus, die du erkennen kannst.',
      text: 'Oder nenne sie.',
      ttsKey: 'shortsightDescription',
    },
    detailsHelperText: 'Eine Kurzsichtigkeit ist möglich, wenn der Sehschärfewert unter dem Wert „A“ liegt.',
    testConfig: {
      startTestId: 3,
      sizes: [
        8.727,
        5.818,
        3.967,
        2.727,
        1.745,
        1.247,
        0.873,
        0.725,
      ],
    },
    results: [
      {
        result: Result.Warning,
        title: 'Achtung: Dein Resultat ist auffällig schlecht.',
        description: 'Wenn es sich hier nicht um ein Technik-Problem handelt, empfehlen wir dir dringend einen \
Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 0,
        showDoctorButton: true,
      },
      {
        result: Result.Bad,
        title: 'Oh wie schade... Du hast kein gutes Resultat erzielt.',
        description: 'Wir empfehlen dir dringend, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 5,
      },
      {
        result: Result.Good,
        title: 'Ganz gut, aber du hast kein optimales Resultat erzielt.',
        description: 'Wir empfehlen dir, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 7,
      },
      {
        result: Result.VeryGood,
        title: 'Glückwunsch! Du hast ein sehr gutes Resultat erzielt.',
        description: 'Auch bei bestandenem Seh-Check empfehlen wir dir alle 2 Jahre zum Augenoptiker zu gehen.',
        minScore: 8,
        coinBonus: 20,
      },
    ],
  },
  landolt: {
    name: 'Landolt-Seh-Check',
    description: 'Sehen in der Ferne\n(Kurzsichtigkeit)',
    price: 250,
    image: Landolt,
    imageNoShadow: LandoltNoShadow,
    firstScreenName: 'Ready',
    readyScreen: {
      title: 'Bereit? Halte 60 cm Abstand zu deinem Bildschirm.',
      text: 'Das ist in etwa eine Armlänge.',
      ttsKey: 'landoltReadyNoMic',
    },
    descriptionScreen: {
      title: 'Markiere die Öffnungen der kleinen Ringe.',
      text: 'Oder nenne die Nummer der Öffnung.',
      ttsKey: 'landoltDescription',
    },
    mainScreenName: 'LandoltVisionTest',
    detailsHelperText: 'Eine Kurzsichtigkeit ist möglich, wenn der Sehschärfewert unter dem Wert „A“ liegt.',
    results: [
      {
        result: Result.Warning,
        title: 'Achtung: Dein Resultat ist auffällig schlecht.',
        description: 'Wenn es sich hier nicht um ein Technik-Problem handelt, empfehlen wir dir dringend einen \
Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 0,
        showDoctorButton: true,
      },
      {
        result: Result.Bad,
        title: 'Oh wie schade... Du hast kein gutes Resultat erzielt.',
        description: 'Wir empfehlen dir dringend, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 5,
      },
      {
        result: Result.Good,
        title: 'Ganz gut, aber du hast kein optimales Resultat erzielt.',
        description: 'Wir empfehlen dir, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 7,
      },
      {
        result: Result.VeryGood,
        title: 'Glückwunsch! Du hast ein sehr gutes Resultat erzielt.',
        description: 'Auch bei bestandenem Seh-Check empfehlen wir dir alle 2 Jahre zum Augenoptiker zu gehen.',
        minScore: 8,
        coinBonus: 20,
      },
    ],
    testConfig: {
      startTestId: 3,
      positionImages: {
        1: LandoltPosition1Image,
        2: LandoltPosition2Image,
        3: LandoltPosition3Image,
        4: LandoltPosition4Image,
        5: LandoltPosition5Image,
        6: LandoltPosition6Image,
        7: LandoltPosition7Image,
        8: LandoltPosition8Image,
      },
      sizes: [
        8.727,
        5.818,
        3.967,
        2.727,
        1.745,
        1.247,
        0.873,
        0.725,
      ],
    },
  },
  farsight: {
    name: 'Nah-Seh-Check',
    description: 'Sehen in der Nähe\n(Weitsichtigkeit)',
    image: Farsight,
    imageNoShadow: FarsightNoShadow,
    firstScreenName: 'Ready',
    readyScreen: {
      title: 'Bereit? Halte 60 cm Abstand zu deinem Bildschirm.',
      text: 'Das ist in etwa eine Armlänge.',
      ttsKey: 'farsightReady',
    },
    descriptionScreen: {
      title: 'Lies die nachfolgenden Sätze.',
      text: 'Verändere dabei möglichst nicht den Abstand zum Bildschirm.',
      ttsKey: 'farsightDescription',
    },
    detailsHelperText: 'Eine Weitsichtigkeit ist möglich, wenn der Sehschärfewert unter dem Wert "A" liegt.',
    mainScreenName: 'FarsightVisionTest',
    testConfig: {
      startTestId: 3,
      tests: [
        {
          size: 18.37,
          sentences: [
            {
              sentence: 'Der Regen.',
              // similarityNeeded: 0.8,
            },
          ],
        },
        {
          size: 12.25,
          sentences: [
            {
              sentence: 'Das Fahrrad ist neu.',
            },
          ],
        },
        {
          size: 8.35,
          sentences: [
            {
              sentence: 'Die frische Luft im Wald tut richtig gut.',
            },
          ],
        },
        {
          size: 5.74,
          sentences: [
            {
              sentence: 'Am Wochenende gehen wir endlich ins Kino.',
            },
          ],
        },
        {
          size: 3.67,
          sentences: [
            {
              sentence: 'Er freut sich am meisten auf die Kaffeepausen mit den Kollegen.',
            },
          ],
        },
        {
          size: 2.62,
          sentences: [
            {
              sentence: 'Die beiden fahren heute früh zum Markt und kaufen Fisch und Gemüse.',
            },
          ],
        },
        {
          size: 1.84,
          sentences: [
            {
              sentence: 'Auf ihrer langen Reise lernten Sie fremde Menschen, Länder und Kulturen kennen.',
            },
          ],
        },
        {
          size: 1.53,
          sentences: [
            {
              sentence: 'Alle 2 Jahre werden Sehtests für die Ferne und die Nähe notwendig, um Veränderungen oder \
Sehprobleme bei Erwachsenen frühzeitig zu entdecken.',
            },
          ],
        },
      ],
    },
    results: [
      {
        result: Result.Bad,
        title: 'Oh wie schade... Du hast kein gutes Resultat erzielt.',
        description: 'Wir empfehlen dir dringend, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 0,
      },
      {
        result: Result.Good,
        title: 'Ganz gut, aber du hast kein optimales Resultat erzielt.',
        description: 'Wir empfehlen dir, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 7,
      },
      {
        result: Result.VeryGood,
        title: 'Glückwunsch! Du hast ein sehr gutes Resultat erzielt.',
        description: 'Auch bei bestandenem Seh-Check empfehlen wir dir alle 2 Jahre zum Augenoptiker zu gehen.',
        minScore: 8,
        coinBonus: 20,
      },
    ],
  },
  color: {
    name: 'Farb-Seh-Check',
    description: 'Sehen von Farben\n(Farbblindheit)',
    price: 250,
    image: Color,
    imageNoShadow: ColorNoShadow,
    firstScreenName: 'Ready',
    mainScreenName: 'ColorVisionTest',
    readyScreen: {
      title: 'Bereit? Halte 60 cm Abstand zu deinem Bildschirm.',
      text: 'Das ist in etwa eine Armlänge.',
      ttsKey: 'colorReady',
    },
    descriptionScreen: {
      title: 'Nenne die im Kreis zu erkennenden Zahlen.',
      text: 'Entspanne deine Augen und lass dir ein wenig Zeit.',
      ttsKey: 'colorDescription',
    },
    detailsHelperText: 'Eine Rot-Grün-Sehschwäche ist möglich, wenn eine oder mehrere Ziffern nicht oder nicht \
vollständig erkannt wurden.',
    testConfig: {
      testCount: 6,
      images: [
        {
          answer: 2,
          image: Ishihara2Image,
        },
        {
          answer: 3,
          alternativeAnswer: 5,
          image: Ishihara3Image,
        },
        {
          answer: 6,
          image: Ishihara6Image,
        },
        {
          answer: 12,
          image: Ishihara12Image,
        },
        {
          answer: 29,
          alternativeAnswer: 70,
          image: Ishihara29Image,
        },
        {
          answer: 45,
          image: Ishihara45Image,
        },
        {
          answer: 74,
          alternativeAnswer: 71,
          image: Ishihara74Image,
        },
        {
          answer: 97,
          image: Ishihara97Image,
        },
      ],
    },
    results: [
      {
        result: Result.Warning,
        title: 'Achtung! Du hast offenbar eine Farbsehschwäche.',
        description: 'Wir empfehlen dir, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 0,
      },
      {
        result: Result.Good,
        title: 'Du hast ein leicht eingeschränktes Farbsehvermögen.',
        description: 'Wir empfehlen dir, einen Augenarzt oder Augenoptiker aufzusuchen.',
        minScore: 10,
      },
      {
        result: Result.VeryGood,
        title: 'Du hast offenbar ein sehr ausgeprägtes Farbsehvermögen.',
        description: 'Auch bei bestandenem Seh-Check empfehlen wir dir alle 2 Jahre zum Augenoptiker zu gehen.',
        minScore: 12,
        coinBonus: 20,
      },
    ],
  },
  sharpness: {
    name: 'Schärfe-Seh-Check',
    description: 'Sehen in Nähe & Ferne\n(Hornhautverkrümmung)',
    price: 100,
    image: Sharpness,
    imageNoShadow: SharpnessNoShadow,
    firstScreenName: 'Ready',
    mainScreenName: 'SharpnessVisionTest',
    detailsHelperText: 'Eine Hornhautverkrümmung kann schon vorliegen, wenn nur ein Punkt nicht mit „Sehr gut“ \
bestanden worden ist.',
    readyScreen: {
      title: 'Bereit? Halte 60 cm Abstand zu deinem Bildschirm.',
      text: 'Das ist in etwa eine Armlänge.',
      ttsKey: 'sharpnessReady',
    },
    descriptionScreen: {
      title: 'Achte auf hellere oder unscharfe Linien ...',
      text: 'Nimm dir Zeit und betrachte dabei jede Grafik einzeln.',
      ttsKey: 'sharpnessDescription',
    },
    results: [
      {
        result: Result.Warning,
        title: 'Achtung! Du hast offenbar eine Sehstörung.',
        description: 'Wir empfehlen dir, einen Augenarzt oder Augenoptiker aufzusuchen.',
      },
      {
        result: Result.VeryGood,
        title: 'Der Test konnte keine Auffälligkeit feststellen.',
        description: 'Auch bei bestandenem Seh-Check empfehlen wir dir alle 2 Jahre zum Augenoptiker zu gehen.',
        coinBonus: 20,
      },
    ],
    testConfig: undefined,
  },
  makula: {
    name: 'Makula-Seh-Check',
    description: 'Sehstörung AMD\n(Makula Degeneration)',
    image: Makula,
    imageNoShadow: MakulaNoShadow,
    firstScreenName: 'Ready',
    mainScreenName: 'MakulaVisionTest',
    detailsHelperText: 'Makula-Störungen bzw. Gesichtsfeldausfälle können vorliegen, wenn der Test für Auge ein oder \
beide Augen nicht bestanden wurde.',
    readyScreen: {
      title: 'Bereit? Halte 20 cm Abstand zu deinem Bildschirm.',
      text: 'Du musst also sehr nah heran kommen.',
      ttsKey: 'makulaReady',
    },
    descriptionScreen: {
      title: 'Achte auf verzerrte Linien, dunkle oder verschwommene Stellen ...',
      text: '... Löcher oder das Fehlen des Punktes in der Mitte.',
      ttsKey: 'makulaDescription',
    },
    results: [
      {
        result: Result.Warning,
        title: 'Achtung! Du hast offenbar eine Sehstörung.',
        description: 'Wir empfehlen dir dringend, einen Augenarzt oder Augenoptiker aufzusuchen.',
      },
      {
        result: Result.VeryGood,
        title: 'Der Test konnte keine Auffälligkeiten feststellen.',
        description: 'Auch bei bestandenem Seh-Check empfehlen wir dir alle 2 Jahre zum Augenoptiker zu gehen.',
        coinBonus: 20,
      },
    ],
    testConfig: undefined,
  },
  kids: {
    disabled: true,
    name: 'Kinder-Seh-Check',
    description: 'Sehen in der Ferne,\nKontrast- & Farbsehen',
    price: 500,
    image: ComingSoon,
    imageNoShadow: KidsNoShadow,
    firstScreenName: 'NoMicInfo',
    mainScreenName: 'KidsVisionTest',
    detailsHelperText: 'Sehdefizite können schon vorliegen, wenn nur ein Punkt nicht mit „Sehr gut“ bestanden wurde.',
    readyScreen: {
      title: 'Bereit? Haltet 60 cm Abstand zum Bildschirm.',
      text: 'Das ist in etwa eine Erwachsenen-Armlänge.',
      ttsKey: 'kidsReady',
    },
    descriptionScreen: {
      title: 'Lasse dein Kind die Positionen der Testzeichen zeigen.',
      text: 'Gib deinem Kind Zeit und führe den Test, wenn nötig, mehrmals durch.',
      ttsKey: 'kidsDescription',
    },
    results: [
      {
        result: Result.Warning,
        title: 'Achtung: Dein Resultat ist auffällig schlecht.',
        description: 'Wenn es sich hier nicht um ein Technik-Problem handelt, empfehlen wir dir dringend, einen \
Augenarzt aufzusuchen.',
        showDoctorButton: true,
      },
      {
        result: Result.Bad,
        title: 'Oh wie schade, du hast kein gutes Ergebnis erzielt.',
        description: 'Wir empfehlen dringend, einen Augenarzt aufzusuchen.',
        showDoctorButton: true,
      },
      {
        result: Result.Good,
        title: 'Ganz gut, aber du hast kein optimales Ergebnis erzielt.',
        description: 'Wir empfehlen, einen Augenarzt oder Augenoptiker aufzusuchen.',
      },
      {
        result: Result.VeryGood,
        title: 'Hurra! Du hast ein sehr gutes Ergebnis erzielt.',
        description: 'Auch bei bestandenem Seh-Check empfehlen wir einen Besuch beim Augenarzt oder Augenoptiker.',
        coinBonus: 20,
      },
    ],
    testConfig: {
      stories: {
        shortsight: {
          title: 'Es ist Sommer in Neu-Seh-Land ...',
          description: '... und alle Tiere freuen sich über die warme Sonne.\nDer kleine Affe Jim Pannse spielt mit \
seinen Schwestern und Brüdern Ball.\nMöchtest du mitspielen?',
          image: KidsStoryShortsight,
          ttsKey: 'kidsStory1',
        },
        color: {
          title: 'Langsam wird es Herbst ...',
          description: '... und die Bäume verlieren ihre Blätter.\nHeidi und Peter Schnecke suchen Äpfel für das \
Abendessen. Das ist gar nicht so einfach.\nKannst du ihnen helfen?',
          image: KidsStoryColor,
          ttsKey: 'kidsStory2',
        },
        contrast: {
          title: 'Der Winter ist endlich da ...',
          description: '... es schneit und der Geruch von Plätzchen liegt in der Luft.\nTux der Pinguin sucht sein \
Zuhause, denn es wird schon langsam dunkel draußen.',
          image: KidsStoryContrast,
          ttsKey: 'kidsStory3',
        },
        end: {
          title: 'Es wird Frühling in Neu-Seh-Land ...',
          description: '... und die Natur erwacht wieder zu neuem Leben. Alle Tiere feiern zusammen ein großes Fest.',
          image: KidsStoryEnd,
          ttsKey: 'kidsStory4',
        },
      },
      tests: {
        shortsight: {
          image: KidsTestShortsight,
          correctOption: 'circle',
          text: 'Wo ist der Ball? Kannst du ihn finden? Zeige auf den Ball.',
          options: {
            square: KidsSquareSymbol,
            apple: KidsAppleSymbol,
            circle: KidsCircleSymbol,
            house: KidsHouseSymbol,
          },
          config: [ // test sizes in mm
            4 * 1.666,
            2 * 1.666,
            1 * 1.666,
          ],
        },
        color: {
          image: KidsTestColor,
          correctOption: 'apple',
          text: 'Wo ist der Apfel? Kannst du ihn finden? Zeige auf den Apfel.',
          controlSymbol: KidsColorAppleControlSymbol,
          options: {
            square: KidsColorSquareSymbol,
            apple: KidsColorAppleSymbol,
            circle: KidsColorCircleSymbol,
            house: KidsColorHouseSymbol,
          },
          config: [ // number of displayed test images
            2,
            3,
          ],
        },
        contrast: {
          image: KidsTestContrast,
          correctOption: 'house',
          text: 'Wo ist das Haus? Kannst du es finden? Zeige auf das Haus.',
          options: {
            square: KidsSquareSymbol,
            apple: KidsAppleSymbol,
            circle: KidsCircleSymbol,
            house: KidsHouseSymbol,
          },
          config: [ // opacity in %
            0.2,
            0.05,
          ],
        },
        end: {
          image: KidsTestEnd,
          text: 'Gleich geht es weiter zum Ergebnis des Seh-Checks ...',
        },
      },
    },
  },
};

export default VisionTests;
