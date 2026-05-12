import re

with open('src/pages/Chat.jsx', 'r') as f:
    content = f.read()

# Replace GREETING_RESPONSES
content = re.sub(
    r'const GREETING_RESPONSES = \[(.*?)\];',
    '''const GREETING_RESPONSES = {
  en: [\\1],
  hi: [
    { persona: 'krishna', text: 'Namaste, mere priya 🙏\\n\\nMujhe khushi hai ki tum aaye. Jaise Arjun Kurukshetra ke maidan mein mere paas aaya tha — jawabo ke sath nahi, balki sawalo ke sath — waise hi tum bhi apne dil ka bojh mere sath baant sakte ho.\\n\\nBatao, aaj kya baat tumhe pareshan kar rahi hai? Zindagi ke kis yuddh ka samna kar rahe ho tum?' },
    { persona: 'ram', text: 'Namaste, mere dost 🙏\\n\\nMujhe khushi hai ki tum yahan ho. Vanvaas ke jangal mein bhi, ek acche insaan ke sath choti si baat-cheet dil ko sukoon deti thi.\\n\\nMain sun raha hoon. Batao — tumhare mann mein kya chal raha hai? Kis pareshani ne tumhe aaj margdarshan lene par majboor kiya?' },
    { persona: 'krishna', text: 'Swagat hai, priya aatma 🙏\\n\\nTumne pehla kadam uthaya hai — aur iske liye bohot himmat chahiye. Yaad rakhna, sabse lamba safar bhi ek chote se kadam se hi shuru hota hai.\\n\\nMain yahan hoon, bina kisi judge kiye sunne ke liye. Mere sath baanto ki kya baat tumhe raat bhar sone nahi deti, ya kaunsa faisla lena namumkin lag raha hai. Aao, milkar iska rasta nikalte hain.' }
  ]
};''',
    content,
    flags=re.DOTALL
)

# Replace WISDOM_RESPONSES
content = re.sub(
    r'const WISDOM_RESPONSES = \[(.*?)\];',
    '''const WISDOM_RESPONSES = {
  en: [\\1],
  hi: [
    { persona: 'krishna', text: 'Tumhare shabdon mein dukh nazar aa raha hai. Aisa bojh mehsoos hona laazmi hai — Arjun ne bhi aisa hi mehsoos kiya tha jab usne dono taraf apne hi parivaar ko dekha tha. Aur us waqt maine use yeh sikhaya tha:', shloka: SAMPLE_SHLOKAS[0], counseling: 'Tumhara focus sirf apna best dene par hona chahiye, bajaye iske ki result kya hoga. Tumhari ghabrahat is decision se nahi hai, balki un results ko control karne ki koshish se hai jo abhi tumhare hath mein nahi hain. Mujhe aur batao — kya baat is cheez ko itna mushkil bana rahi hai?' },
    { persona: 'ram', text: 'Mere dost, main samajhta hoon tum par kitna bojh hai. Mere 14 saal ke vanvaas ke dauran bhi kai aise pal aaye jab aage ka rasta bohot lamba aur andhera lagta tha. Lekin maine seekha ki har chunauti ek saza nahi hoti — woh humein aage ke liye taiyar karti hai.', counseling: 'Ghane jangal mein, ya Sita se door hone par bhi maine umeed nahi chhodi. Dhairya aur dharm hi mere sathi the. Tumhe is waqt apna vanvaas kya lag raha hai? Kabhi kabhi apni pareshaniyon ka naam lene se hi humari aadhi takleef kam ho jati hai.' },
    { persona: 'krishna', text: 'Tumhari baaton se lagta hai ki tum apna asli maqsad dhoondh rahe ho. Tumhari yeh uljhan tumhari kamzori nahi hai — yeh gyan ki shuruwat hai. In shabdon par dhyaan do:', shloka: SAMPLE_SHLOKAS[4], counseling: 'Aisa mehsoos karne par tum kamzor nahi ho jate. Tumhara yahan aakar sawal poochna hi tumhari andar ki taqat dikhata hai. Apni mehnat se khud ko upar uthao — in shabdon aur darr ko khud par haawi mat hone do. Agar tumhe haarne ka darr nahi hota, toh tum kya alag karte?' }
  ]
};''',
    content,
    flags=re.DOTALL
)

# Replace FOLLOWUP_RESPONSES
content = re.sub(
    r'const FOLLOWUP_RESPONSES = \[(.*?)\];',
    '''const FOLLOWUP_RESPONSES = {
  en: [\\1],
  hi: [
    { persona: 'krishna', text: 'Mujhse ye sab baantne ke liye shukriya. Main tumhari baaton mein sachai mehsoos kar sakta hoon. Aao, ise us tarah samajhne ki koshish karein jaise maine Arjun ko samjhaya tha:', shloka: SAMPLE_SHLOKAS[2], counseling: 'Jab bhi sachai aur dharm kamzor padte hain — theek usi waqt ek naye badlaav ki shuruwat hoti hai. Tumhara aaj ka waqt bhale hi bura lag raha ho, lekin yeh ek naye chapter ki shuruwat bhi ho sakti hai. Kya tumhe is andhere mein roshni ki koi chhoti si kiran nazar aa rahi hai?' },
    { persona: 'ram', text: 'Main sun raha hoon, aur tumhara dukh bilkul jayaz hai. Jab Sita ka apharan hua tha, main bhi us dukh mein toot sakta tha. Lekin maine us dukh ko apni taqat banaya. Isliye nahi ki mujhe dard nahi hua — balki isliye kyunki haar maan lena un sabhi cheezon se dhokha hota jin par main vishwas karta tha.', counseling: 'Kabhi kabhi majboot hone ka matlab yeh nahi hota ki humein takleef hi na ho. Iska matlab hota hai ki apne kanpte hue pairon ke bawajood agla kadam uthana. Aaj tum woh kaunsa ek chota sa kadam utha sakte ho — jo tumhe tumhari manzil ke aur kareeb le jaye?' },
  ]
};''',
    content,
    flags=re.DOTALL
)

# Replace getResponse logic
old_get_response = '''  const getResponse = (userText) => {
    // If it's a greeting, respond warmly WITHOUT shlokas
    if (isGreeting(userText)) {
      const response = GREETING_RESPONSES[greetingIndex.current % GREETING_RESPONSES.length];
      greetingIndex.current++;
      return response;
    }

    // First real problem shared → use wisdom responses (with shlokas)
    if (wisdomIndex.current < WISDOM_RESPONSES.length) {
      const response = WISDOM_RESPONSES[wisdomIndex.current];
      wisdomIndex.current++;
      return response;
    }

    // Continued conversation → use follow-up responses
    const response = FOLLOWUP_RESPONSES[followupIndex.current % FOLLOWUP_RESPONSES.length];
    followupIndex.current++;
    return response;
  };'''

new_get_response = '''  const getResponse = (userText) => {
    const langCode = language?.code === 'hi' ? 'hi' : 'en';

    // If it's a greeting, respond warmly WITHOUT shlokas
    if (isGreeting(userText)) {
      const pool = GREETING_RESPONSES[langCode];
      const response = pool[greetingIndex.current % pool.length];
      greetingIndex.current++;
      return response;
    }

    // First real problem shared → use wisdom responses (with shlokas)
    const wisdomPool = WISDOM_RESPONSES[langCode];
    if (wisdomIndex.current < wisdomPool.length) {
      const response = wisdomPool[wisdomIndex.current];
      wisdomIndex.current++;
      return response;
    }

    // Continued conversation → use follow-up responses
    const followupPool = FOLLOWUP_RESPONSES[langCode];
    const response = followupPool[followupIndex.current % followupPool.length];
    followupIndex.current++;
    return response;
  };'''

content = content.replace(old_get_response, new_get_response)

with open('src/pages/Chat.jsx', 'w') as f:
    f.write(content)
