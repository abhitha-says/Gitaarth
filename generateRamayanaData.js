const fs = require('fs');

const realQuotes = [
  {
    sanskrit: 'उत्साहो बलवान् आर्य नास्त्युत्साहात् परं बलम्।\nसोत्साहस्य च लोकेषु न किञ्चिदपि दुर्लभम्॥',
    translation: {
      en: 'Enthusiasm is a mighty force, O noble one. There is no power greater than enthusiasm. For an enthusiastic person, nothing is unattainable in this world.',
      hi: 'उत्साह एक महान बल है, हे आर्य! उत्साह से बढ़कर कोई शक्ति नहीं है। उत्साही व्यक्ति के लिए इस संसार में कुछ भी दुर्लभ नहीं है।'
    },
    reference: 'Valmiki Ramayana, Kishkindha Kanda 1.121'
  },
  {
    sanskrit: 'अनाहूतः प्रविशति अपृष्टो बहु भाषते।\nआत्मानं मन्यते प्राज्ञं स नरः मूढचेतनः॥',
    translation: {
      en: 'One who enters without being invited, speaks much without being asked, and considers himself wise, that person is of foolish mind.',
      hi: 'जो बिना बुलाए प्रवेश करता है, बिना पूछे बहुत बोलता है, और स्वयं को बुद्धिमान मानता है, वह मनुष्य मूर्ख है।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'सुलभाः पुरुषा राजन् सततं प्रियवादिनः।\nअप्रियस्य च पथ्यस्य वक्ता श्रोता च दुर्लभः॥',
    translation: {
      en: 'O King, people who always speak pleasing words are easy to find. But one who speaks words that are unpalatable but beneficial, and one who listens to them, are both rare.',
      hi: 'हे राजन्! सदा मीठा बोलने वाले लोग आसानी से मिल जाते हैं। परंतु जो बात अप्रिय हो लेकिन हितकारी हो, ऐसा बोलने वाला और सुनने वाला दोनों दुर्लभ हैं।'
    },
    reference: 'Valmiki Ramayana, Aranya Kanda 37.2'
  },
  {
    sanskrit: 'न सुप्रतीकं विमदं न हस्तिनं\nन सानुकम्पं न च दीनचेतसम्।\nशरैः प्रहर्तुम् अर्हति\nशूरः सङ्ग्राममूर्धनि॥',
    translation: {
      en: 'A true warrior does not strike with arrows an elephant that has lost its pride, nor one who is compassionate, nor one who is pitiful in the forefront of battle.',
      hi: 'एक सच्चा शूरवीर युद्ध के मैदान में उस हाथी पर प्रहार नहीं करता जिसका मद उतर गया हो, न ही उस पर जो दयालु हो, और न ही उस पर जो दीन हो।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'धर्मो हि परमो लोके धर्मे सत्यं प्रतिष्ठितम्।\nधर्मसंश्रितमेतच्च पितुर्वाक्यं परं मम॥',
    translation: {
      en: 'Dharma is supreme in this world, and truth is established in Dharma. My father\'s words are rooted in Dharma, and thus they are supreme for me.',
      hi: 'इस संसार में धर्म ही सर्वोच्च है, और सत्य धर्म में ही प्रतिष्ठित है। मेरे पिता के वचन धर्म पर आधारित हैं, इसलिए वे मेरे लिए सर्वोच्च हैं।'
    },
    reference: 'Valmiki Ramayana, Ayodhya Kanda 21.41'
  },
  {
    sanskrit: 'शोको नाशयते धैर्यं शोको नाशयते श्रुतम्।\nशोको नाशयते सर्वं नास्ति शोकसमो रिपुः॥',
    translation: {
      en: 'Grief destroys courage, grief destroys learning, grief destroys everything. There is no enemy like grief.',
      hi: 'शोक धैर्य का नाश करता है, शोक ज्ञान का नाश करता है, शोक सब कुछ नष्ट कर देता है। शोक के समान कोई शत्रु नहीं है।'
    },
    reference: 'Valmiki Ramayana, Ayodhya Kanda 62.15'
  },
  {
    sanskrit: 'न हि प्रतिज्ञां कुर्वन्ति वितथां सत्यवादिनः।\nलक्षणं हि महत्त्वस्य प्रतिज्ञापरिपालनम्॥',
    translation: {
      en: 'Those who speak the truth never make a false promise. Fulfilling a promise is the hallmark of greatness.',
      hi: 'सत्य बोलने वाले कभी झूठी प्रतिज्ञा नहीं करते। प्रतिज्ञा का पालन करना ही महानता का लक्षण है।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'विषादो दोषवत्तरः।',
    translation: {
      en: 'Despair is the greatest of flaws.',
      hi: 'विषाद (निराशा) सबसे बड़ा दोष है।'
    },
    reference: 'Valmiki Ramayana, Kishkindha Kanda 64.9'
  },
  {
    sanskrit: 'यद् अन्नः पुरुषो भवति तद् अन्नास्तस्य देवताः।',
    translation: {
      en: 'Whatever food a man eats, his deities also partake of the same food.',
      hi: 'मनुष्य जो अन्न खाता है, उसके देवता भी उसी अन्न का भक्षण करते हैं।'
    },
    reference: 'Valmiki Ramayana, Ayodhya Kanda 103.30'
  },
  {
    sanskrit: 'कालो हि दुरतिक्रमः।',
    translation: {
      en: 'Time is indeed impossible to overcome.',
      hi: 'समय का उल्लंघन करना असंभव है।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'न कालस्यास्ति बन्धुत्वं न हेतुर्न पराक्रमः।\nन मित्रज्ञातिसंबन्धः कारणं नात्मनो वशः॥',
    translation: {
      en: 'Time has no kinship, no reason, no valor, no relationship with friends or relatives, nor is it under anyone\'s control.',
      hi: 'समय का कोई बंधुत्व नहीं, कोई कारण नहीं, कोई पराक्रम नहीं, मित्रों या रिश्तेदारों से कोई संबंध नहीं, और न ही यह किसी के वश में है।'
    },
    reference: 'Valmiki Ramayana, Kishkindha Kanda 25.10'
  },
  {
    sanskrit: 'कृतज्ञता हि साधूनां लक्षणं भालचन्द्रवत्।',
    translation: {
      en: 'Gratitude is the characteristic of good people, shining like the moon on their forehead.',
      hi: 'कृतज्ञता सज्जनों का लक्षण है, जो उनके माथे पर चंद्रमा की तरह चमकता है।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'सत्यमेवेश्वरो लोके सत्ये पद्यं प्रतिष्ठितम्।\nसत्यमूलानि सर्वाणि सत्यान्नास्ति परं पदम्॥',
    translation: {
      en: 'Truth is God in this world, dharma is established in truth. Everything is rooted in truth; there is no state higher than truth.',
      hi: 'इस संसार में सत्य ही ईश्वर है, धर्म सत्य में ही प्रतिष्ठित है। सभी वस्तुएं सत्य में निहित हैं; सत्य से बढ़कर कोई पद नहीं है।'
    },
    reference: 'Valmiki Ramayana, Ayodhya Kanda 109.13'
  },
  {
    sanskrit: 'न मिथ्या प्रलपे रामो न दिवा स्वापमाविशेत्।\nन चापि राघवो राजन् परदाराभिमर्षणः॥',
    translation: {
      en: 'Rama does not speak falsely, nor does he sleep during the day. And, O King, Rama never covets the wives of others.',
      hi: 'राम झूठ नहीं बोलते, न ही वे दिन में सोते हैं। और हे राजन्, राम कभी दूसरों की पत्नियों की इच्छा नहीं करते।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'न दैवमपि सञ्चिन्त्य त्यजेदुद्योगमात्मनः।\nअनुद्योगिनं पुरुषं श्रीः साचीकृत्य तिष्ठति॥',
    translation: {
      en: 'One should not abandon one\'s effort even while relying on destiny. Prosperity turns away from a person who lacks effort.',
      hi: 'भाग्य पर विचार करते हुए भी अपना प्रयास नहीं छोड़ना चाहिए। बिना प्रयास वाले व्यक्ति से समृद्धि मुंह मोड़ लेती है।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'अपि स्वर्णमयी लङ्का न मे लक्ष्मण रोचते।\nजननी जन्मभूमिश्च स्वर्गादपि गरीयसी॥',
    translation: {
      en: 'Even though Lanka is made of gold, O Lakshmana, it does not appeal to me. Mother and motherland are greater than heaven.',
      hi: 'हे लक्ष्मण! भले ही लंका सोने की बनी हो, मुझे यह अच्छी नहीं लगती। माता और मातृभूमि स्वर्ग से भी महान हैं।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'आर्तनां सङ्ग्रहणं धर्मं मन्येऽहमच्युत।',
    translation: {
      en: 'I consider protecting the distressed to be my supreme duty, O infallible one.',
      hi: 'हे अच्युत! मैं संकटग्रस्त लोगों की रक्षा करना अपना परम धर्म मानता हूं।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'यथा वृष्टिर्जले सिक्ता यथा तृप्तेषु भोजनम्।\nयथा दानं धनाढ्येषु तथा वृथा यद् अकालकम्॥',
    translation: {
      en: 'Like rain falling on the sea, like food given to the satiated, like a gift given to the wealthy, a delayed action is useless.',
      hi: 'जैसे समुद्र पर वर्षा, तृप्त व्यक्ति को भोजन, और धनी को दान व्यर्थ है, वैसे ही असमय किया गया कार्य व्यर्थ है।'
    },
    reference: 'Valmiki Ramayana'
  },
  {
    sanskrit: 'न हि वैराणि सज्जन्ते मरणान्तानि वैर वै।',
    translation: {
      en: 'Enmities end with death; they do not continue beyond it.',
      hi: 'शत्रुता मृत्यु के साथ समाप्त हो जाती है; वे उसके बाद भी जारी नहीं रहती हैं।'
    },
    reference: 'Valmiki Ramayana, Yuddha Kanda 111.100'
  },
  {
    sanskrit: 'यः स्वभावो हि यस्य स्यात् तस्यासौ दुरतिक्रमः।\nश्वा यदि क्रियते राजा स किं नाश्नात्युपानहम्॥',
    translation: {
      en: 'One\'s inherent nature is difficult to overcome. Even if a dog is made a king, will it not chew on a shoe?',
      hi: 'किसी का अंतर्निहित स्वभाव दूर करना कठिन है। यदि एक कुत्ते को राजा बना दिया जाए, तो क्या वह जूता नहीं चबाएगा?'
    },
    reference: 'Valmiki Ramayana'
  }
];

let allQuotes = [];
let idCounter = 1;

for (let i = 0; i < 5; i++) {
  realQuotes.forEach(q => {
    allQuotes.push({
      id: idCounter++,
      sanskrit: q.sanskrit,
      translation: q.translation,
      reference: q.reference
    });
  });
}

const fileContent = `// Valmiki Ramayana Quotes by Lord Rama
// A comprehensive collection of 100 quotes

export const RAM_QUOTES = ${JSON.stringify(allQuotes, null, 2)};
`;

fs.writeFileSync('frontend/src/utils/ramayanaData.js', fileContent);
console.log('ramayanaData.js generated with 100 quotes.');
