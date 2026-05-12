export const APP_NAME = 'Gitaarth AI';
export const APP_TAGLINE = 'Ancient Wisdom for Modern Problems';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi (Hinglish)', nativeName: 'Hinglish', flag: '🇮🇳' },
];

export const PERSONAS = {
  KRISHNA: {
    id: 'krishna',
    name: 'Lord Krishna',
    title: 'The Divine Charioteer',
    color: 'gold',
    source: 'Bhagavad Gita',
  },
  RAM: {
    id: 'ram',
    name: 'Lord Ram',
    title: 'Maryada Purushottam',
    color: 'blue',
    source: 'Ramayana',
  },
};

export const NAV_LINKS = [
  { path: '/', label: 'Home', id: 'nav-home' },
  { path: '/chat', label: 'Seek Guidance', id: 'nav-chat' },
  { path: '/library', label: 'Library', id: 'nav-library' },
  { path: '/profile', label: 'Profile', id: 'nav-profile' },
];

// Sample shlokas for frontend demo (until backend is ready)
export const SAMPLE_SHLOKAS = [
  {
    id: 1,
    chapter: 2,
    verse: 47,
    chapterName: 'Sankhya Yoga',
    chapterNameSanskrit: 'सांख्ययोग',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    translation: {
      en: 'You have the right to perform your duty, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, and never be attached to inaction.',
      hi: 'Karm karne mein hi tumhara adhikaar hai, phal mein kabhi nahi. Karm ke phal ka hetu mat bano aur akarm mein bhi tumhari aasakti na ho.',
    },
  },
  {
    id: 2,
    chapter: 2,
    verse: 14,
    chapterName: 'Sankhya Yoga',
    chapterNameSanskrit: 'सांख्ययोग',
    sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    translation: {
      en: 'O son of Kunti, the contact between the senses and their objects gives rise to fleeting sensations of happiness and distress. These are temporary; learn to endure them.',
      hi: 'Hey Kunti putra! Sardi-garmi aur sukh-dukh ko dene wale indriya aur vishayon ke sanyog anitya hain, unko sahan karo.',
    },
  },
  {
    id: 3,
    chapter: 4,
    verse: 7,
    chapterName: 'Jnana Karma Sanyasa Yoga',
    chapterNameSanskrit: 'ज्ञानकर्मसंन्यासयोग',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    translation: {
      en: 'Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself on earth.',
      hi: 'Hey Bharat! Jab-jab dharm ki haani aur adharm ki vriddhi hoti hai, tab-tab main swayam ki rachna karta hoon arthaat avatar leta hoon.',
    },
  },
  {
    id: 4,
    chapter: 11,
    verse: 32,
    chapterName: 'Vishwaroop Darshan Yoga',
    chapterNameSanskrit: 'विश्वरूपदर्शनयोग',
    sanskrit: 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो लोकान्समाहर्तुमिह प्रवृत्तः।',
    translation: {
      en: 'I am Time, the great destroyer of worlds, and I have come here to engage all people.',
      hi: 'Main lokon ka naash karne wala badha hua mahakaal hoon. Is samay in lokon ko nasht karne ke liye pravritt hua hoon.',
    },
  },
  {
    id: 5,
    chapter: 6,
    verse: 5,
    chapterName: 'Dhyana Yoga',
    chapterNameSanskrit: 'ध्यानयोग',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    translation: {
      en: 'Elevate yourself by your own mind, and do not degrade yourself. The mind alone is the friend of the soul, and the mind alone is its enemy.',
      hi: 'Apne dwara apna uddhaar karein aur apne ko adhogati mein na daalein. Kyunki aatma hi aatma ka mitra hai aur aatma hi aatma ka shatru hai.',
    },
  },
  {
    id: 6,
    chapter: 9,
    verse: 22,
    chapterName: 'Raja Vidya Raja Guhya Yoga',
    chapterNameSanskrit: 'राजविद्याराजगुह्ययोग',
    sanskrit: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
    translation: {
      en: 'Those who worship me with undivided devotion, meditating on me with no other thought — to them I carry what they lack and preserve what they already have.',
      hi: 'Jo ananya bhakt mera chintan karte hue meri upasana karte hain, un nitya-yukt bhakton ka yogkshem main swayam vahan karta hoon.',
    },
  },
];

// Sample chat messages for demo
export const DEMO_MESSAGES = [
  {
    id: 1,
    role: 'user',
    text: 'I feel lost in my career. I don\'t know if I should stay in my current job or take a risk on something new.',
  },
  {
    id: 2,
    role: 'assistant',
    persona: 'krishna',
    text: 'Arjuna too stood at such a crossroads — torn between duty and desire, frozen by the fear of the unknown. But remember what I told him:',
    shloka: SAMPLE_SHLOKAS[0],
    counseling: 'Focus on giving your best to whatever path you choose, rather than being paralyzed by the outcomes. The anxiety you feel comes not from the decision itself, but from trying to control results that are not yet yours to know. What is it about the new path that calls to you?',
  },
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
