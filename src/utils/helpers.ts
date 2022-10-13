import { SHOW_DEV_TOOLS } from '@env';
import { EdgeInsets } from 'react-native-safe-area-context';
import VoiceCommands from '../config/voice_commands';
import { Sizing } from '../styles';
import { Digit } from '../types/global';

export default class Helpers {
  /**
   * Checks if a given string is valid JSON.
   * @param {string} str The string to check.
   * @return {boolean} True if str is valid JSON, false if not.
   */
  static isValidJson(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Converts a given hex code color to RGBA with opacity.
   * @param {string} hexCode The hex code color to convert to RGBA.
   * @param {number} opacity The wanted opacity as a decimal number (e.g. 0.2 for 20%).
   * @return {string} The RGBA color.
   */
  static convertHexToRGBA(hexCode: string, opacity: number) {
    let hex = hexCode.replace('#', '');

    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r},${g},${b},${opacity})`;
  }

  /**
   * Takes a CSS size string (like "5%" or "16px") and divides the number by the given divisor, then
   * returns it back as a string in the original format.
   * @param {string} dividendStr The CSS string (like "5%" or "16px").
   * @param {number} divisor The divisor to use for the divison.
   * @returns {number} The CSS string with the newly calculated number.
   */
  static dividePixels(dividendStr: string, divisor: number) {
    const num = dividendStr.match(/[+-]?\d+(\.\d+)?/g)!.map((v) => parseFloat(v))[0];
    return dividendStr.replace(num.toString(), (num / divisor).toString());
  }

  /**
   * Calculates the difference from now to a given date and checks if the given number of seconds has passed since
   * then.
   * @param {Date} lastActivity Date to check.
   * @param {number} waitSeconds Amount of seconds to compare the difference against. Defaults to 30.
   * @returns {boolean} False if the amount of seconds is bigger than the calculated difference (= user is
   *                    inactive), True if the given amount of seconds has not passed yet.
   */
  static checkActivity(lastActivity: Date, waitSeconds: number = 30) {
    const secondDifference = Math.abs((new Date()).getTime() - lastActivity.getTime()) / 1000;
    if (secondDifference > waitSeconds) return false;
    return true;
  }

  static randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Takes two numbers and checks if they are phonetically similar to each other in German (e.g. "zwei" und "drei").
   * @param {Digit} x First number to compare.
   * @param {Digit} y Second number to compare.
   * @returns {boolean} True if the two numbers are phonetically similar, False otherwise.
   */
  static checkNumbersPhoneticSimilarity(x: Digit, y: Digit) {
    if (x === 2 && y === 3) return true;
    if (x === 3 && y === 2) return true;
    return false;
  }

  static generateTestNumbers() {
    const numbers: Digit[] = [];
    for (let i = 0; i < 9; i += 1) {
      let foundNumber = false;
      while (!foundNumber) {
        const number = (Helpers.randomIntFromInterval(2, 9) as Digit);
        const prevNumber = numbers[numbers.length - 1];
        if (number === 7) foundNumber = false;
        else if (number === prevNumber) foundNumber = false;
        else if (Helpers.checkNumbersPhoneticSimilarity(number, prevNumber)) foundNumber = false;
        else {
          numbers.push(number);
          foundNumber = true;
        }
      }
    }
    return numbers;
  }

  static generateRemainingTestAnswerNumbers(correctAnswer: Digit): [number, number, number] {
    const result: number[] = [];
    while (result.length < 3) {
      const number = (Helpers.randomIntFromInterval(2, 9) as Digit);
      if (number === 7) continue;
      if (correctAnswer === number || this.checkNumbersPhoneticSimilarity(correctAnswer, number)) continue;
      if (result.includes(number)) continue;
      let shouldContinue = false;
      for (const existingAnswer of result) {
        if (this.checkNumbersPhoneticSimilarity(existingAnswer as Digit, number)) {
          shouldContinue = true;
          break;
        }
      }
      if (shouldContinue) continue;
      result.push(number);
    }
    return result as [number, number, number];
  }

  static isNumeric(str: string) {
    return /^-?\d+$/.test(str);
  }

  static setStateAsync(self: any, state: any) {
    return new Promise((resolve) => {
      self.setState(state, resolve);
    });
  }

  static sleep(ms: number) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static shuffleArray<T extends number[]>(a: T): T {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  static getHeaderHeight(insets: EdgeInsets) {
    return Sizing.logo + 20 + insets.top;
  }

  static replaceUmlauts(text: string) {
    return text
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/Ä/g, 'AE')
      .replace(/Ö/g, 'OE')
      .replace(/Ü/g, 'UE');
  }

  static cmToDp(cm: number) {
    return (cm / 2.54) * 160;
  }

  static sanitizeTranscript(transcript: string | null) {
    if (transcript === null) return null;
    return transcript.toLowerCase().trim();
  }

  // eslint-disable-next-line function-paren-newline
  static checkVoiceCommand<T extends Record<string, (string | RegExp)[]>>(
    transcript: string,
    voiceCommands: T,
  ): keyof T | null {
    for (const [commandKey, voiceCommand] of Object.entries(voiceCommands)) {
      for (const commandString of voiceCommand) {
        if (Object.prototype.toString.call(commandString) === '[object RegExp]') {
          if ((commandString as RegExp).test(transcript)) return commandKey as keyof T;
        } else if (transcript === commandString) return commandKey as keyof T;
      }
    }
    return null;
  }

  static checkVoiceCommandForNumbers(transcript: string) {
    if (this.isNumeric(transcript)) return parseInt(transcript, 10);
    const voiceCommands = VoiceCommands.numbers;
    for (const [commandKey, voiceCommand] of Object.entries(voiceCommands)) {
      for (const commandString of voiceCommand) {
        if (Object.prototype.toString.call(commandString) === '[object RegExp]') {
          if ((commandString as RegExp).test(transcript)) return parseInt(commandKey, 10);
        } else if (transcript === commandString) return parseInt(commandKey, 10);
      }
    }
    return null;
  }

  static getColorForResultLetter(resultLetter: string) {
    let color = '#DC3545';
    switch (resultLetter) {
      case 'F':
        color = '#E75742';
        break;
      case 'E':
        color = '#F27940';
        break;
      case 'D':
        color = '#FD9B3D';
        break;
      case 'C':
        color = '#BAAA46';
        break;
      case 'B':
        color = '#77B850';
        break;
      case 'A':
      case 'A+':
        color = '#34C759';
        break;
      default:
        color = '#DC3545';
    }
    return color;
  }

  static shouldDevToolsBeShown() {
    const envShowDevTools = (process.env as any).SHOW_DEV_TOOLS;
    if (envShowDevTools && envShowDevTools.length) {
      return envShowDevTools === '1';
    }
    return SHOW_DEV_TOOLS === '1';
  }
}
