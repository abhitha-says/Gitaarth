export const APP_NAME = 'Gitaarth';
export const APP_TAGLINE = 'Wisdom of the Bhagavad Gita';

export const LANGUAGES = [
  { code: 'en', name: 'English', short: 'English' },
  { code: 'hi', name: 'Hindi (Hinglish)', short: 'Hinglish' },
];

/** Backend REST base. Auth routes live at the same origin without the /api suffix. */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const AUTH_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

/** India's national mental-health helpline (Tele-MANAS), free and available 24×7. */
export const HELPLINE = { name: 'Tele-MANAS', number: '14416', tel: 'tel:14416' };
