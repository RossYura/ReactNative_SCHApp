const yesCommands = ['ja', 'yes', 'jawoll', 'jawohl', 'jo', 'joa'];
const noCommands = ['nein', 'ne', 'nix', 'nö', 'no'];

const VoiceCommands = {
  visionTests: {
    sharpness: {
      buttonYes: yesCommands,
      buttonNo: noCommands,
    },
    color: {
      buttonNone: ['keine', 'keins', 'kein', 'nichts', ...noCommands],
    },
    makula: {
      buttonYes: yesCommands,
      buttonNo: noCommands,
    },
    shortsight: {},
    landolt: {},
    farsight: {
      buttonYes: yesCommands,
      buttonNo: noCommands,
    },
  },
  numbers: {
    1: ['one', '1'],
    2: ['two', '2'],
    3: ['three', '3'],
    4: ['four', '4'],
    5: ['five', '5'],
    6: ['six', '6'],
    7: ['seven', '7'],
    8: ['eight', '8'],
    9: ['nine', '9'],
    10: ['ten', '10'],
    11: ['eleven', '11'],
    12: ['twelve', '12'],
    29: ['twentynine', '29'],
    45: ['fortyfive', '45'],
    70: ['seventy', '70'],
    71: ['seventyone', '71'],
    74: ['seventyfour', '74'],
  },
};

export default VoiceCommands;
