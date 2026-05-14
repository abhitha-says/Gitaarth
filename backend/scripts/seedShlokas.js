/**
 * Gitaarth AI — Shloka Seed Script
 * Seeds the shlokas collection with verified Bhagavad Gita verses.
 * Idempotent — uses upsert on { chapter, verse } compound key.
 *
 * Usage: node scripts/seedShlokas.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import Shloka from '../models/Shloka.js';

const SEED_DATA = [
  {
    chapter: 2,
    verse: 3,
    chapterName: 'Sankhya Yoga',
    chapterNameSanskrit: 'सांख्ययोग',
    sanskrit: 'क्लैब्यं मा स्म गमः पार्थ नैतत्त्वय्युपपद्यते।\nक्षुद्रं हृदयदौर्बल्यं त्यक्त्वोत्तिष्ठ परन्तप॥',
    translation: {
      en: 'Do not yield to cowardice, O Arjuna. It does not become you. Shake off this weakness of heart and arise!',
      hi: 'Hey Parth! Namardi ko mat prapt ho, yeh tere liye uchit nahi hai. Hey Parantap! Hriday ki tucch kamzori ko tyaag kar khada ho ja.',
    },
    themes: ['courage', 'fear', 'cowardice', 'weakness', 'strength', 'arise', 'fight', 'motivation'],
  },
  {
    chapter: 2,
    verse: 14,
    chapterName: 'Sankhya Yoga',
    chapterNameSanskrit: 'सांख्ययोग',
    sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः।\nआगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत॥',
    translation: {
      en: 'O son of Kunti, the contact between the senses and their objects gives rise to fleeting sensations of happiness and distress. These are temporary; learn to endure them.',
      hi: 'Hey Kunti putra! Sardi-garmi aur sukh-dukh ko dene wale indriya aur vishayon ke sanyog anitya hain, unko sahan karo.',
    },
    themes: ['pain', 'suffering', 'patience', 'temporary', 'loss', 'breakup', 'sadness', 'endurance', 'impermanence'],
  },
  {
    chapter: 2,
    verse: 47,
    chapterName: 'Sankhya Yoga',
    chapterNameSanskrit: 'सांख्ययोग',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥',
    translation: {
      en: 'You have the right to perform your duty, but you are not entitled to the fruits of your actions. Never consider yourself the cause of the results, and never be attached to inaction.',
      hi: 'Karm karne mein hi tumhara adhikaar hai, phal mein kabhi nahi. Karm ke phal ka hetu mat bano aur akarm mein bhi tumhari aasakti na ho.',
    },
    themes: ['duty', 'action', 'anxiety', 'career', 'work', 'results', 'karma', 'detachment', 'purpose'],
  },
  {
    chapter: 2,
    verse: 62,
    chapterName: 'Sankhya Yoga',
    chapterNameSanskrit: 'सांख्ययोग',
    sanskrit: 'ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।\nसङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥',
    translation: {
      en: 'When a person dwells on sense objects, attachment arises. From attachment comes desire, and from desire comes anger.',
      hi: 'Vishayon ka chintan karne wale purush ki un vishayon mein aasakti ho jaati hai. Aasakti se kaamna aur kaamna se krodh utpann hota hai.',
    },
    themes: ['addiction', 'desire', 'anger', 'attachment', 'temptation', 'habits', 'craving', 'mindfulness'],
  },
  {
    chapter: 3,
    verse: 35,
    chapterName: 'Karma Yoga',
    chapterNameSanskrit: 'कर्मयोग',
    sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।\nस्वधर्मे निधनं श्रेयः परधर्मो भयावहः॥',
    translation: {
      en: 'It is better to do your own duty imperfectly than to do another\'s duty perfectly. It is better to perish in one\'s own dharma than to follow another\'s dharma, which is perilous.',
      hi: 'Apna dharm gunheen hone par bhi doosre ke dharm se uttam hai. Apne dharm mein marna bhi kalyankaari hai, doosre ka dharm bhay dene wala hai.',
    },
    themes: ['comparison', 'jealousy', 'identity', 'purpose', 'career', 'calling', 'dharma', 'self-acceptance'],
  },
  {
    chapter: 4,
    verse: 7,
    chapterName: 'Jnana Karma Sanyasa Yoga',
    chapterNameSanskrit: 'ज्ञानकर्मसंन्यासयोग',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
    translation: {
      en: 'Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself on earth.',
      hi: 'Hey Bharat! Jab-jab dharm ki haani aur adharm ki vriddhi hoti hai, tab-tab main swayam ki rachna karta hoon arthaat avatar leta hoon.',
    },
    themes: ['injustice', 'wrong', 'righteousness', 'hope', 'faith', 'change', 'divine intervention', 'justice'],
  },
  {
    chapter: 4,
    verse: 8,
    chapterName: 'Jnana Karma Sanyasa Yoga',
    chapterNameSanskrit: 'ज्ञानकर्मसंन्यासयोग',
    sanskrit: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम्।\nधर्मसंस्थापनार्थाय सम्भवामि युगे युगे॥',
    translation: {
      en: 'To protect the righteous, to annihilate the wicked, and to re-establish dharma, I appear in every age.',
      hi: 'Sajjan purusho ki raksha aur dushton ke vinaash ke liye tatha dharm ki sthapna ke liye main yug-yug mein prakat hota hoon.',
    },
    themes: ['protection', 'righteousness', 'dharma', 'evil', 'divine', 'hope', 'faith'],
  },
  {
    chapter: 6,
    verse: 5,
    chapterName: 'Dhyana Yoga',
    chapterNameSanskrit: 'ध्यानयोग',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥',
    translation: {
      en: 'Elevate yourself by your own mind, and do not degrade yourself. The mind alone is the friend of the soul, and the mind alone is its enemy.',
      hi: 'Apne dwara apna uddhaar karein aur apne ko adhogati mein na daalein. Kyunki aatma hi aatma ka mitra hai aur aatma hi aatma ka shatru hai.',
    },
    themes: ['self-improvement', 'confidence', 'mental health', 'depression', 'self-doubt', 'motivation', 'mindset', 'inner strength'],
  },
  {
    chapter: 6,
    verse: 34,
    chapterName: 'Dhyana Yoga',
    chapterNameSanskrit: 'ध्यानयोग',
    sanskrit: 'चञ्चलं हि मनः कृष्ण प्रमाथि बलवद्दृढम्।\nतस्याहं निग्रहं मन्ये वायोरिव सुदुष्करम्॥',
    translation: {
      en: 'The mind is restless, turbulent, obstinate and very strong, O Krishna. Subduing it, I think, is more difficult than controlling the wind.',
      hi: 'Hey Krishna! Yeh man bahut chanchal, prakshubdh, balavaan aur dridh hai. Main iska nigraha karna vayu ko rokne ke samaan ati kathin maanta hoon.',
    },
    themes: ['mind', 'restless', 'anxiety', 'focus', 'meditation', 'overthinking', 'peace', 'calm'],
  },
  {
    chapter: 9,
    verse: 22,
    chapterName: 'Raja Vidya Raja Guhya Yoga',
    chapterNameSanskrit: 'राजविद्याराजगुह्ययोग',
    sanskrit: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥',
    translation: {
      en: 'Those who worship me with undivided devotion, meditating on me with no other thought — to them I carry what they lack and preserve what they already have.',
      hi: 'Jo ananya bhakt mera chintan karte hue meri upasana karte hain, un nitya-yukt bhakton ka yogkshem main swayam vahan karta hoon.',
    },
    themes: ['devotion', 'faith', 'trust', 'surrender', 'god', 'prayer', 'spiritual', 'protection'],
  },
  {
    chapter: 11,
    verse: 32,
    chapterName: 'Vishwaroop Darshan Yoga',
    chapterNameSanskrit: 'विश्वरूपदर्शनयोग',
    sanskrit: 'कालोऽस्मि लोकक्षयकृत्प्रवृद्धो लोकान्समाहर्तुमिह प्रवृत्तः।',
    translation: {
      en: 'I am Time, the great destroyer of worlds, and I have come here to engage all people.',
      hi: 'Main lokon ka naash karne wala badha hua mahakaal hoon. Is samay in lokon ko nasht karne ke liye pravritt hua hoon.',
    },
    themes: ['time', 'death', 'mortality', 'perspective', 'impermanence', 'fear', 'cosmic', 'reality'],
  },
  {
    chapter: 18,
    verse: 66,
    chapterName: 'Moksha Sanyasa Yoga',
    chapterNameSanskrit: 'मोक्षसंन्यासयोग',
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
    translation: {
      en: 'Abandon all varieties of dharma and simply surrender unto Me. I shall deliver you from all sins. Do not fear.',
      hi: 'Sab dharmon ko tyaag kar kevl mujh ek ki sharan mein aa ja. Main tujhe sampoorn paapon se mukt kar doonga, tu shok mat kar.',
    },
    themes: ['surrender', 'guilt', 'sin', 'forgiveness', 'relief', 'peace', 'liberation', 'moksha', 'fear'],
  },
  {
    chapter: 18,
    verse: 78,
    chapterName: 'Moksha Sanyasa Yoga',
    chapterNameSanskrit: 'मोक्षसंन्यासयोग',
    sanskrit: 'यत्र योगेश्वरः कृष्णो यत्र पार्थो धनुर्धरः।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम॥',
    translation: {
      en: 'Wherever there is Krishna, the Lord of Yoga, and Arjuna, the supreme archer, there will certainly be opulence, victory, prosperity and righteousness.',
      hi: 'Jahan yogeshwar Krishna aur dhanurdhari Arjun hain, wahan shri, vijay, vibhuti aur dhruv niti hai — yeh mera nishchit mat hai.',
    },
    themes: ['victory', 'success', 'prosperity', 'teamwork', 'partnership', 'divine guidance', 'devotion'],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env file');
    process.exit(1);
  }

  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(uri, {
      dbName: process.env.DB_NAME || 'gitaarth',
    });
    console.log('✅ Connected');

    console.log(`📦 Seeding ${SEED_DATA.length} shlokas...`);

    let created = 0;
    let updated = 0;

    for (const shloka of SEED_DATA) {
      const result = await Shloka.findOneAndUpdate(
        { chapter: shloka.chapter, verse: shloka.verse },
        { $set: shloka },
        { upsert: true, new: true, rawResult: true }
      );

      if (result.lastErrorObject?.updatedExisting) {
        updated++;
      } else {
        created++;
      }
    }

    const total = await Shloka.countDocuments();
    console.log(`\n✅ Seed complete!`);
    console.log(`   📗 Created: ${created}`);
    console.log(`   📝 Updated: ${updated}`);
    console.log(`   📚 Total shlokas in DB: ${total}`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
}

seed();
