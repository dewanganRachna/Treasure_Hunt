/**
 * Interface strings. Questions come from questions.json and are shown in
 * English only when a question provides questionEn / optionsEn.
 */
const STRINGS = {
  hi: {
    title: 'छत्तीसगढ़ डिजिटल एक्सप्लोरर',
    gov: 'छत्तीसगढ़ शासन',
    fest: 'राज्योत्सव विशेष',
    sound: 'SOUND',
    restart: 'RESTART',
    fullscreen: 'फ़ुलस्क्रीन',
    eyebrow: 'राज्योत्सव विशेष · डिजिटल खोज अभियान',
    tag: '10 पड़ावों से गुज़रें, सही उत्तर दें और छत्तीसगढ़ का खज़ाना खोजें!',
    t1: 'विषय 1 · सरगुजा से',
    t2: 'विषय 2 · मैदानी क्षेत्र',
    t3: 'विषय 3 · बस्तर तक',
    c1: 'साइबर सुरक्षा',
    c2: 'डिजिटल सेवा',
    c3: 'एआई एक्सप्लोरर',
    note: 'हर पड़ाव पर एक सवाल · गलत उत्तर पर दोबारा कोशिश कर सकते हैं',
    start: 'START GAME · शुरू करें',
    tryAgain: 'फिर कोशिश कीजिए',
    correct: 'सही उत्तर ✓',
    won: 'बधाई हो!',
    wonSub: 'सभी दस पड़ाव पूरे हुए',
    cert: 'प्रमाण पत्र पाएं →',
    again: 'फिर से खेलें',
    certToast: 'प्रमाण पत्र स्क्रीन जल्द उपलब्ध होगी'
  },
  en: {
    title: 'Chhattisgarh Digital Explorer',
    gov: 'Govt. of Chhattisgarh',
    fest: 'RAJYOTSAV SPECIAL',
    sound: 'SOUND',
    restart: 'RESTART',
    fullscreen: 'Fullscreen',
    eyebrow: 'Rajyotsav Special · Digital Discovery Mission',
    tag: 'Travel 10 waypoints, answer correctly and find the treasure of Chhattisgarh!',
    t1: 'Theme 1 · from Surguja',
    t2: 'Theme 2 · the plains',
    t3: 'Theme 3 · to Bastar',
    c1: 'Cyber Safety',
    c2: 'Digital Seva',
    c3: 'AI Explorer',
    note: 'One question at each waypoint · wrong answers can be retried',
    start: 'START GAME',
    tryAgain: 'Try again',
    correct: 'Correct ✓',
    won: 'Congratulations!',
    wonSub: 'All ten waypoints complete',
    cert: 'Get certificate →',
    again: 'Play again',
    certToast: 'Certificate screen coming soon'
  }
};

export function t(lang, key) {
  return STRINGS[lang]?.[key] ?? STRINGS.hi[key] ?? key;
}
