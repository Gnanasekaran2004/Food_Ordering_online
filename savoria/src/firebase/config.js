/* ═══════════════════════════════════════════════════════════════════
   SAVORIA — Firebase Configuration
   ────────────────────────────────────────────────────────────────
   SINGLE initialization point. All Firebase services import from
   firebase/auth.js, firebase/firestore.js etc — never re-initialize.

   Config values come exclusively from environment variables.
   Never hardcode Firebase config in source files.
═══════════════════════════════════════════════════════════════════ */

import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Guard against duplicate initialization (HMR / fast refresh edge cases)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];

export default app;
