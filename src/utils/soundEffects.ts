// Web Audio API and Speech Synthesis for Indian Tambola Game caller

export const TAMBOLA_HINDI_NAMES: Record<number, string> = {
  1: 'एक (Ek)',
  2: 'दो (Do)',
  3: 'तीन (Teen)',
  4: 'चार (Chaar)',
  5: 'पांच (Paanch)',
  6: 'छह (Chhah)',
  7: 'सात (Saat)',
  8: 'आठ (Aath)',
  9: 'नौ (Nau)',
  10: 'दस (Dus)',
  11: 'ग्यारह (Gyarah)',
  12: 'बारह (Baarah)',
  13: 'तेरह (Terah)',
  14: 'चौदह (Chaudah)',
  15: 'पंद्रह (Pandrah)',
  16: 'सोलह (Solah)',
  17: 'सत्रह (Satrah)',
  18: 'अठारह (Atharah)',
  19: 'उन्नीस (Unnees)',
  20: 'बीस (Bees)',
  21: 'इक्कीस (Ikkees)',
  22: 'बाईस (Baees)',
  23: 'तेईस (Tees)',
  24: 'चौबीस (Chaubees)',
  25: 'पच्चीस (Pachchees)',
  26: 'छब्बीस (Chhabbees)',
  27: 'सत्ताईस (Sattaees)',
  28: 'अट्ठाईस (Atthaees)',
  29: 'उनतीस (Untees)',
  30: 'तीस (Tees)',
  31: 'इकत्तीस (Ikatees)',
  32: 'बत्तीस (Battees)',
  33: 'तैंतीस (Taintees)',
  34: 'चौंतीस (Chauntees)',
  35: 'पैंतीस (Paintees)',
  36: 'छत्तीस (Chhattees)',
  37: 'सैंतीस (Saintees)',
  38: 'अड़तीस (Adtees)',
  39: 'उनतालीस (Untaalees)',
  40: 'चालीस (Chaalees)',
  41: 'इकतालीस (Iktaalees)',
  42: 'बयालीस (Bayaalees)',
  43: 'तैंतालीस (Taintaalees)',
  44: 'चवालीस (Chawaalees)',
  45: 'पैंतालीस (Paintaalees)',
  46: 'छियालीस (Chhiyaalees)',
  47: 'सैंतालीस (Saintaalees)',
  48: 'अड़तालीस (Adtaalees)',
  49: 'उनचास (Unchaas)',
  50: 'पचास (Pachaas)',
  51: 'इक्यावन (Ikyaawan)',
  52: 'बावन (Baawan)',
  53: 'तिरपन (Tirpan)',
  54: 'चौवन (Chauwan)',
  55: 'पचपन (Pachpan)',
  56: 'छप्पन (Chhappan)',
  57: 'सत्तावन (Sattawan)',
  58: 'अट्ठावन (Atthawan)',
  59: 'उनसठ (Unsath)',
  60: 'साठ (Saath)',
  61: 'इकसठ (Iksath)',
  62: 'बासठ (Baasath)',
  63: 'तिरसठ (Tirsath)',
  64: 'चौंसठ (Chaunsath)',
  65: 'पैंसठ (Painsath)',
  66: 'छियासठ (Chhiyaasath)',
  67: 'सरसठ (Sarsath)',
  68: 'अड़सठ (Adsath)',
  69: 'उनहत्तर (Unhattar)',
  70: 'सत्तर (Sattar)',
  71: 'इकहत्तर (Ikhattar)',
  72: 'बहत्तर (Bahattar)',
  73: 'तिहत्तर (Tihattar)',
  74: 'चौहत्तर (Chauhattar)',
  75: 'पचहत्तर (Pachhattar)',
  76: 'छिहत्तर (Chhihattar)',
  77: 'सतहत्तर (Sat-hattar)',
  78: 'अठहत्तर (Ath-hattar)',
  79: 'उन्यासी (Unyaasi)',
  80: 'अस्सी (Assi)',
  81: 'इक्यासी (Ikyaasi)',
  82: 'बयासी (Bayaasi)',
  83: 'तिरासी (Tiraasi)',
  84: 'चौरासी (Chauraasi)',
  85: 'पचासी (Pachaasi)',
  86: 'छियासी (Chhiyaasi)',
  87: 'सत्तासी (Sattaasi)',
  88: 'अट्ठासी (Atthaasi)',
  89: 'नवासी (Nawaasi)',
  90: 'नब्बे (Nabey)',
};

export const TAMBOLA_ENGLISH_NAMES: Record<number, string> = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
  15: 'Fifteen',
  16: 'Sixteen',
  17: 'Seventeen',
  18: 'Eighteen',
  19: 'Nineteen',
  20: 'Twenty',
  21: 'Twenty-One',
  22: 'Twenty-Two',
  23: 'Twenty-Three',
  24: 'Twenty-Four',
  25: 'Twenty-Five',
  26: 'Twenty-Six',
  27: 'Twenty-Seven',
  28: 'Twenty-Eight',
  29: 'Twenty-Nine',
  30: 'Thirty',
  31: 'Thirty-One',
  32: 'Thirty-Two',
  33: 'Thirty-Three',
  34: 'Thirty-Four',
  35: 'Thirty-Five',
  36: 'Thirty-Six',
  37: 'Thirty-Seven',
  38: 'Thirty-Eight',
  39: 'Thirty-Nine',
  40: 'Forty',
  41: 'Forty-One',
  42: 'Forty-Two',
  43: 'Forty-Three',
  44: 'Forty-Four',
  45: 'Forty-Five',
  46: 'Forty-Six',
  47: 'Forty-Seven',
  48: 'Forty-Eight',
  49: 'Forty-Nine',
  50: 'Fifty',
  51: 'Fifty-One',
  52: 'Fifty-Two',
  53: 'Fifty-Three',
  54: 'Fifty-Four',
  55: 'Fifty-Five',
  56: 'Fifty-Six',
  57: 'Fifty-Seven',
  58: 'Fifty-Eight',
  59: 'Fifty-Nine',
  60: 'Sixty',
  61: 'Sixty-One',
  62: 'Sixty-Two',
  63: 'Sixty-Three',
  64: 'Sixty-Four',
  65: 'Sixty-Five',
  66: 'Sixty-Six',
  67: 'Sixty-Seven',
  68: 'Sixty-Eight',
  69: 'Sixty-Nine',
  70: 'Seventy',
  71: 'Seventy-One',
  72: 'Seventy-Two',
  73: 'Seventy-Three',
  74: 'Seventy-Four',
  75: 'Seventy-Five',
  76: 'Seventy-Six',
  77: 'Seventy-Seven',
  78: 'Seventy-Eight',
  79: 'Seventy-Nine',
  80: 'Eighty',
  81: 'Eighty-One',
  82: 'Eighty-Two',
  83: 'Eighty-Three',
  84: 'Eighty-Four',
  85: 'Eighty-Five',
  86: 'Eighty-Six',
  87: 'Eighty-Seven',
  88: 'Eighty-Eight',
  89: 'Eighty-Nine',
  90: 'Ninety',
};

export const TAMBOLA_CALLS: Record<number, string> = {
  1: 'Top of the house, Number 1 (एक)',
  2: 'Kaala dhan, Number 2 (दो)',
  3: 'Goodness me, Number 3 (तीन)',
  4: 'Knock at the door, Number 4 (चार)',
  5: 'Fingers in your hand, Number 5 (पांच)',
  6: 'In a fix, Number 6 (छह)',
  7: 'Lucky Seven, Number 7 (सात)',
  8: 'One fat lady, Number 8 (आठ)',
  9: 'Doctor time, Number 9 (नौ)',
  10: 'A big fat hen, Number 10 (दस)',
  11: 'Two beautiful legs, Number 11 (ग्यारह)',
  12: 'One dozen, Number 12 (बारह)',
  13: 'Unlucky for some, Number 13 (तेरह)',
  14: 'Valentine day, Number 14 (चौदह)',
  15: 'Independence month, Number 15 (पंद्रह)',
  16: 'Sweet sixteen, Number 16 (सोलह)',
  17: 'Dancing queen, Number 17 (सत्रह)',
  18: 'Voting age, Number 18 (अठारह)',
  19: 'Goodbye teens, Number 19 (उन्नीस)',
  20: 'Blind 20, Number 20 (बीस)',
  21: 'Royal salute, Number 21 (इक्कीस)',
  22: 'Two little ducks, Number 22 (बाईस)',
  23: 'You and me, Number 23 (तेईस)',
  24: 'Two dozen, Number 24 (चौबीस)',
  25: 'Silver jubilee, Number 25 (पच्चीस)',
  26: 'Republic day, Number 26 (छब्बीस)',
  27: 'Gateway to heaven, Number 27 (सत्ताईस)',
  28: 'Duck and its mate, Number 28 (अट्ठाईस)',
  29: 'In your prime, Number 29 (उनतीस)',
  30: 'Flirty thirty, Number 30 (तीस)',
  31: 'Time for fun, Number 31 (इकत्तीस)',
  32: 'Mouth full of teeth, Number 32 (बत्तीस)',
  33: 'All the threes, Number 33 (तैंतीस)',
  34: 'Ask for more, Number 34 (चौंतीस)',
  35: 'Jump and jive, Number 35 (पैंतीस)',
  36: 'Popular size, Number 36 (छत्तीस)',
  37: 'More than eleven, Number 37 (सैंतीस)',
  38: 'Christmas cake, Number 38 (अड़तीस)',
  39: 'Steps to heaven, Number 39 (उनतालीस)',
  40: 'Naughty 40, Number 40 (चालीस)',
  41: 'Life begins at 41, Number 41 (इकतालीस)',
  42: 'Winnie the Pooh, Number 42 (बयालीस)',
  43: 'Down on your knee, Number 43 (तैंतालीस)',
  44: 'All the fours, Number 44 (चवालीस)',
  45: 'Halfway there, Number 45 (पैंतालीस)',
  46: 'Up to tricks, Number 46 (छियालीस)',
  47: 'Four and seven, Number 47 (सैंतालीस)',
  48: 'Four dozen, Number 48 (अड़तालीस)',
  49: 'Rise and shine, Number 49 (उनचास)',
  50: 'Half century, Number 50 (पचास)',
  51: 'Charity begins, Number 51 (इक्यावन)',
  52: 'Pack of cards, Number 52 (बावन)',
  53: 'Pack with a tree, Number 53 (तिरपन)',
  54: 'Clean the floor, Number 54 (चौवन)',
  55: 'All the fives, Number 55 (पचपन)',
  56: 'Was she worth it, Number 56 (छप्पन)',
  57: 'Heinz varieties, Number 57 (सत्तावन)',
  58: 'Make them wait, Number 58 (अट्ठावन)',
  59: 'Just in time, Number 59 (उनसठ)',
  60: 'Five dozen, Number 60 (साठ)',
  61: 'Bakers bun, Number 61 (इकसठ)',
  62: 'Turn the screw, Number 62 (बासठ)',
  63: 'Tickle me 63, Number 63 (तिरसठ)',
  64: 'Catch the shore, Number 64 (चौंसठ)',
  65: 'Old age retirement, Number 65 (पैंसठ)',
  66: 'Clickety click, Number 66 (छियासठ)',
  67: 'Made in heaven, Number 67 (सरसठ)',
  68: 'Saving grace, Number 68 (अड़सठ)',
  69: 'Your place or mine, Number 69 (उनहत्तर)',
  70: 'Lucky blind, Number 70 (सत्तर)',
  71: 'Bang on the drum, Number 71 (इकहत्तर)',
  72: 'Six dozen, Number 72 (बहत्तर)',
  73: 'Queen bee, Number 73 (तिहत्तर)',
  74: 'Candy store, Number 74 (चौहत्तर)',
  75: 'Diamond jubilee, Number 75 (पचहत्तर)',
  76: 'Trombones, Number 76 (छिहत्तर)',
  77: 'Sunset strip, Number 77 (सतहत्तर)',
  78: 'Heaven gate, Number 78 (अठहत्तर)',
  79: 'One more time, Number 79 (उन्यासी)',
  80: 'Gandhi ji ki lathi, Number 80 (अस्सी)',
  81: 'Fat lady with a bun, Number 81 (इक्यासी)',
  82: 'Fat lady with a duck, Number 82 (बयासी)',
  83: 'Time for tea, Number 83 (तिरासी)',
  84: 'Seven dozen, Number 84 (चौरासी)',
  85: 'Staying alive, Number 85 (पचासी)',
  86: 'Between the sticks, Number 86 (छियासी)',
  87: 'Torquay in Devon, Number 87 (सत्तासी)',
  88: 'Two fat ladies, Number 88 (अट्ठासी)',
  89: 'Nearly there, Number 89 (नवासी)',
  90: 'Top of the shop, Number 90 (नब्बे)',
};

class SoundController {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getMuted() {
    return this.isMuted;
  }

  public playTick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.08);
    } catch {
      // Audio context policy fallback
    }
  }

  public playNumberCalled() {
    this.playBallChime();
  }

  public playBallChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.3);
      osc2.stop(now + 0.3);
    } catch {
      // Audio fallback
    }
  }

  public playWinFanfare() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.18, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.25);
      });
    } catch {
      // Audio fallback
    }
  }

  /**
   * Speaks number in bilingual format:
   * "Number {num}, {Hindi Name}, {English Name}"
   * E.g. "Number 47. सैंतालीस. Forty Seven."
   */
  public speakNumber(num: number) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const hindi = TAMBOLA_HINDI_NAMES[num]?.split(' ')[0] || '';
      const eng = TAMBOLA_ENGLISH_NAMES[num] || `${num}`;
      const speechPhrase = `Number ${num}. ${hindi}. ${eng}.`;

      const utterance = new SpeechSynthesisUtterance(speechPhrase);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback
    }
  }
}

export const soundFx = new SoundController();

