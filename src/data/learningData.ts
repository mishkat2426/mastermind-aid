export interface AlphabetItem {
  letter: string;
  word: string;
  wordBn?: string; // Bengali word
  emoji: string;
}

export interface AlphabetBnItem {
  letter: string;
  word: string;
  meaning: string;
  emoji: string;
}

export interface AnimalItem {
  name: string;
  nameBn?: string;
  emoji: string;
}

export interface FruitItem {
  name: string;
  nameBn?: string;
  emoji: string;
}

export interface MonthItem {
  name: string;
  shortName: string;
  season: 'winter' | 'spring' | 'summer' | 'monsoon' | 'autumn';
  emoji: string;
}

export interface NumberItem {
  number: string;
  numberBn: string; // Bengali (1-20: ১-২০)
  word: string;
  wordBn: string;
}

export interface RhymeItem {
  title: string;
  titleBn: string;
  lyrics: string[];
  lyricsBn: string[]; // Bengali lyrics line-by-line
  emoji: string;
}

export const alphabets: AlphabetItem[] = [
  { letter: 'A', word: 'Ant', wordBn: 'পিপঁড়া', emoji: '🐜' },
  { letter: 'B', word: 'Ball', wordBn: 'বল', emoji: '⚽' },
  { letter: 'C', word: 'Cat', wordBn: 'বিড়াল', emoji: '🐱' },
  { letter: 'D', word: 'Dog', wordBn: 'কুকুর', emoji: '🐕' },
  { letter: 'E', word: 'Elephant', wordBn: 'হাতি', emoji: '🐘' },
  { letter: 'F', word: 'Fish', wordBn: 'মাছ', emoji: '🐟' },
  { letter: 'G', word: 'Goat', wordBn: 'ছাগল', emoji: '🐐' },
  { letter: 'H', word: 'House', wordBn: 'ঘর', emoji: '🏠' },
  { letter: 'I', word: 'Ice Cream', wordBn: 'আইসক্রিম', emoji: '🍦' },
  { letter: 'J', word: 'Jug', wordBn: 'জগ', emoji: '🏺' },
  { letter: 'K', word: 'Kite', wordBn: 'ঘুড়ি', emoji: '🪁' },
  { letter: 'L', word: 'Lion', wordBn: 'সিংহ', emoji: '🦁' },
  { letter: 'M', word: 'Mango', wordBn: 'আম', emoji: '🥭' },
  { letter: 'N', word: 'Nest', wordBn: 'পাখির বাসা', emoji: '🪺' },
  { letter: 'O', word: 'Orange', wordBn: 'কমলা', emoji: '🍊' },
  { letter: 'P', word: 'Parrot', wordBn: 'তোতা', emoji: '🦜' },
  { letter: 'Q', word: 'Queen', wordBn: 'রানী', emoji: '👑' },
  { letter: 'R', word: 'Rabbit', wordBn: 'খরগোশ', emoji: '🐰' },
  { letter: 'S', word: 'Sun', wordBn: 'সূর্য', emoji: '☀️' },
  { letter: 'T', word: 'Tiger', wordBn: 'বাঘ', emoji: '🐯' },
  { letter: 'U', word: 'Umbrella', wordBn: 'ছাতা', emoji: '☂️' },
  { letter: 'V', word: 'Van', wordBn: 'ভ্যান', emoji: '🚐' },
  { letter: 'W', word: 'Watch', wordBn: 'ঘড়ি', emoji: '⌚' },
  { letter: 'X', word: 'Xylophone', wordBn: 'জাইলোফোন', emoji: '🎵' },
  { letter: 'Y', word: 'Yak', wordBn: 'চামরী গাই', emoji: '🦬' },
  { letter: 'Z', word: 'Zebra', wordBn: 'জেব্রা', emoji: '🦓' },
];

export const alphabetsBn: AlphabetBnItem[] = [
  { letter: 'অ', word: 'অজগর', meaning: 'Python', emoji: '🐍' },
  { letter: 'আ', word: 'আম', meaning: 'Mango', emoji: '🥭' },
  { letter: 'ই', word: 'ইঁদুর', meaning: 'Rat', emoji: '🐁' },
  { letter: 'ঈ', word: 'ঈগল', meaning: 'Eagle', emoji: '🦅' },
  { letter: 'উ', word: 'উট', meaning: 'Camel', emoji: '🐪' },
  { letter: 'ঊ', word: 'ঊষা', meaning: 'Dawn', emoji: '🌅' },
  { letter: 'ঋ', word: 'ঋতু', meaning: 'Season', emoji: '🌦️' },
  { letter: 'এ', word: 'একতারা', meaning: 'Ektara', emoji: '🎸' },
  { letter: 'ঐ', word: 'ঐক্য', meaning: 'Unity', emoji: '🤝' },
  { letter: 'ও', word: 'ওজন', meaning: 'Weight', emoji: '⚖️' },
  { letter: 'ঔ', word: 'ঔষধ', meaning: 'Medicine', emoji: '💊' },
  { letter: 'ক', word: 'কলম', meaning: 'Pen', emoji: '🖊️' },
  { letter: 'খ', word: 'খাতা', meaning: 'Notebook', emoji: '📓' },
  { letter: 'গ', word: 'গরু', meaning: 'Cow', emoji: '🐄' },
  { letter: 'ঘ', word: 'ঘড়ি', meaning: 'Clock', emoji: '⏰' },
  { letter: 'ঙ', word: 'ব্যাঙ', meaning: 'Frog', emoji: '🐸' },
  { letter: 'চ', word: 'চশমা', meaning: 'Glasses', emoji: '👓' },
  { letter: 'ছ', word: 'ছাতা', meaning: 'Umbrella', emoji: '☂️' },
  { letter: 'জ', word: 'জাহাজ', meaning: 'Ship', emoji: '🚢' },
  { letter: 'ঝ', word: 'ঝিনুক', meaning: 'Oyster', emoji: '🦪' },
  { letter: 'ঞ', word: 'মিঞা', meaning: 'Cat', emoji: '🐱' },
  { letter: 'ট', word: 'টুপি', meaning: 'Cap', emoji: '🧢' },
  { letter: 'ঠ', word: 'ঠোঁট', meaning: 'Lips', emoji: '👄' },
  { letter: 'ড', word: 'ডাব', meaning: 'Green Coconut', emoji: '🥥' },
  { letter: 'ঢ', word: 'ঢোল', meaning: 'Drum', emoji: '🥁' },
  { letter: 'ণ', word: 'হরিণ', meaning: 'Deer', emoji: '🦌' },
  { letter: 'ত', word: 'তাল', meaning: 'Palm', emoji: '🌴' },
  { letter: 'থ', word: 'থালা', meaning: 'Plate', emoji: '🍽️' },
  { letter: 'দ', word: 'দুধ', meaning: 'Milk', emoji: '🥛' },
  { letter: 'ধ', word: 'ধান', meaning: 'Paddy', emoji: '🌾' },
  { letter: 'ন', word: 'নৌকা', meaning: 'Boat', emoji: '🛶' },
  { letter: 'প', word: 'পাখি', meaning: 'Bird', emoji: '🐦' },
  { letter: 'ফ', word: 'ফল', meaning: 'Fruit', emoji: '🍎' },
  { letter: 'ব', word: 'বই', meaning: 'Book', emoji: '📖' },
  { letter: 'ভ', word: 'ভালুক', meaning: 'Bear', emoji: '🐻' },
  { letter: 'ম', word: 'মাছ', meaning: 'Fish', emoji: '🐟' },
  { letter: 'য', word: 'যাঁতা', meaning: 'Grindstone', emoji: '⚙️' },
  { letter: 'র', word: 'রাজহাঁস', meaning: 'Swan', emoji: '🦢' },
  { letter: 'ল', word: 'লাটিম', meaning: 'Top', emoji: '🧶' },
  { letter: 'শ', word: 'শাপলা', meaning: 'Water Lily', emoji: '🪷' },
  { letter: 'ষ', word: 'ষাঁড়', meaning: 'Bull', emoji: '🐂' },
  { letter: 'স', word: 'সূর্য', meaning: 'Sun', emoji: '☀️' },
  { letter: 'হ', word: 'হাঁস', meaning: 'Duck', emoji: '🦆' },
];

export const animals: AnimalItem[] = [
  { name: 'Elephant', nameBn: 'হাতি', emoji: '🐘' },
  { name: 'Peacock', nameBn: 'ময়ূর', emoji: '🦚' },
  { name: 'Tiger', nameBn: 'বাঘ', emoji: '🐯' },
  { name: 'Cow', nameBn: 'গরু', emoji: '🐄' },
  { name: 'Monkey', nameBn: 'বানর', emoji: '🐒' },
  { name: 'Goat', nameBn: 'ছাগল', emoji: '🐐' },
  { name: 'Parrot', nameBn: 'তোতা', emoji: '🦜' },
  { name: 'Buffalo', nameBn: 'মহিষ', emoji: '🐃' },
  { name: 'Camel', nameBn: 'উট', emoji: '🐪' },
  { name: 'Deer', nameBn: 'হরিণ', emoji: '🦌' },
  { name: 'Rabbit', nameBn: 'খরগোশ', emoji: '🐰' },
  { name: 'Squirrel', nameBn: 'কাঠবিড়ালি', emoji: '🐿️' },
];

export const fruits: FruitItem[] = [
  { name: 'Mango', nameBn: 'আম', emoji: '🥭' },
  { name: 'Banana', nameBn: 'কলা', emoji: '🍌' },
  { name: 'Guava', nameBn: 'পেয়ারা', emoji: '🍐' },
  { name: 'Jackfruit', nameBn: 'কাঁঠাল', emoji: '🍈' },
  { name: 'Papaya', nameBn: 'পেঁপে', emoji: '🍑' },
  { name: 'Lychee', nameBn: 'লিচু', emoji: '🍇' },
  { name: 'Coconut', nameBn: 'নারকেল', emoji: '🥥' },
  { name: 'Watermelon', nameBn: 'তরমুজ', emoji: '🍉' },
  { name: 'Pomegranate', nameBn: 'ডালিম', emoji: '🍎' },
  { name: 'Orange', nameBn: 'কমলা', emoji: '🍊' },
  { name: 'Grapes', nameBn: 'আঙুর', emoji: '🍇' },
  { name: 'Pineapple', nameBn: 'আনারস', emoji: '🍍' },
];

export const months: MonthItem[] = [
  { name: 'January', shortName: 'Jan', season: 'winter', emoji: '❄️' },
  { name: 'February', shortName: 'Feb', season: 'winter', emoji: '🌸' },
  { name: 'March', shortName: 'Mar', season: 'spring', emoji: '🌷' },
  { name: 'April', shortName: 'Apr', season: 'summer', emoji: '☀️' },
  { name: 'May', shortName: 'May', season: 'summer', emoji: '🔥' },
  { name: 'June', shortName: 'Jun', season: 'summer', emoji: '🌴' },
  { name: 'July', shortName: 'Jul', season: 'monsoon', emoji: '🌧️' },
  { name: 'August', shortName: 'Aug', season: 'monsoon', emoji: '⛈️' },
  { name: 'September', shortName: 'Sep', season: 'monsoon', emoji: '🌈' },
  { name: 'October', shortName: 'Oct', season: 'autumn', emoji: '🍂' },
  { name: 'November', shortName: 'Nov', season: 'autumn', emoji: '🪔' },
  { name: 'December', shortName: 'Dec', season: 'winter', emoji: '🎄' },
];

export const numbers: NumberItem[] = [
  { number: '1', numberBn: '১', word: 'One', wordBn: 'এক' },
  { number: '2', numberBn: '২', word: 'Two', wordBn: 'দুই' },
  { number: '3', numberBn: '৩', word: 'Three', wordBn: 'তিন' },
  { number: '4', numberBn: '৪', word: 'Four', wordBn: 'চার' },
  { number: '5', numberBn: '৫', word: 'Five', wordBn: 'পাঁচ' },
  { number: '6', numberBn: '৬', word: 'Six', wordBn: 'ছয়' },
  { number: '7', numberBn: '৭', word: 'Seven', wordBn: 'সাত' },
  { number: '8', numberBn: '৮', word: 'Eight', wordBn: 'আট' },
  { number: '9', numberBn: '৯', word: 'Nine', wordBn: 'নয়' },
  { number: '10', numberBn: '১০', word: 'Ten', wordBn: 'দশ' },
  { number: '11', numberBn: '১১', word: 'Eleven', wordBn: 'এগারো' },
  { number: '12', numberBn: '১২', word: 'Twelve', wordBn: 'বারো' },
  { number: '13', numberBn: '১৩', word: 'Thirteen', wordBn: 'তেরো' },
  { number: '14', numberBn: '১৪', word: 'Fourteen', wordBn: 'চৌদ্দ' },
  { number: '15', numberBn: '১৫', word: 'Fifteen', wordBn: 'পনেরো' },
  { number: '16', numberBn: '১৬', word: 'Sixteen', wordBn: 'ষোল' },
  { number: '17', numberBn: '১৭', word: 'Seventeen', wordBn: 'সতেরো' },
  { number: '18', numberBn: '১৮', word: 'Eighteen', wordBn: 'আঠারো' },
  { number: '19', numberBn: '১৯', word: 'Nineteen', wordBn: 'উনিশ' },
  { number: '20', numberBn: '২০', word: 'Twenty', wordBn: 'কুড়ি' },
];

export const rhymes: RhymeItem[] = [
  {
    title: 'Twinkle Twinkle Little Star',
    titleBn: 'টুইঙ্কল টুইঙ্কল লিটল স্টার',
    emoji: '⭐',
    lyrics: [
      'Twinkle, twinkle, little star,',
      'How I wonder what you are!',
      'Up above the world so high,',
      'Like a diamond in the sky.'
    ],
    lyricsBn: [
      'টুইঙ্কল টুইঙ্কল লিটল স্টার,',
      'হাউ আই ওয়ান্ডার হোয়াট ইউ আর!',
      'আপ অ্যাবাভ দ্য ওয়ার্ল্ড সো হাই,',
      'লাইক আ ডায়মন্ড ইন দ্য স্কাই।'
    ]
  },
  {
    title: 'Baba Black Sheep',
    titleBn: 'বাবা ব্ল্যাক শিপ',
    emoji: '🐑',
    lyrics: [
      'Baa, baa, black sheep,',
      'Have you any wool?',
      'Yes, sir, yes, sir,',
      'Three bags full'
    ],
    lyricsBn: [
      'বা, বা, ব্ল্যাক শিপ,',
      'হ্যাভ ইউ এনি উল?',
      'ইয়েস স্যার, ইয়েস স্যার,',
      'থ্রি ব্যাগস ফুল'
    ]
  },
  {
    title: 'Humpty Dumpty',
    titleBn: 'হামটি ডামটি',
    emoji: '🥚',
    lyrics: [
      'Humpty Dumpty sat on a wall,',
      'Humpty Dumpty had a great fall;',
      'All the king\'s horses and all the king\'s men',
      'Couldn\'t put Humpty together again.'
    ],
    lyricsBn: [
      'হামটি ডামটি স্যাট অন আ ওয়াল,',
      'হামটি ডামটি হ্যাড আ গ্রেট ফল;',
      'অল দ্য কিংস হর্সেস অ্যান্ড অল দ্য কিংস মেন',
      'কুডন্ট পুট হামটি টুগেদার অ্যাগেইন।'
    ]
  }
];

export const categoryColors = {
  saffron: 'gradient-saffron',
  teal: 'gradient-teal',
  pink: 'gradient-pink',
  yellow: 'gradient-yellow',
} as const;

export const getCardColor = (index: number): string => {
  const colors = ['gradient-saffron', 'gradient-teal', 'gradient-pink', 'gradient-yellow'];
  return colors[index % colors.length];
};
