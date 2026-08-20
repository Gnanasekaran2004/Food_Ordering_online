/* ═══════════════════════════════════════════════════════════════════
   SAVORIA — Firebase Authentication Instance
   ────────────────────────────────────────────────────────────────
   Exports the single auth instance used throughout the app.
   Uses browserLocalPersistence so the user stays logged in across
   page refreshes (standard web behavior).

   In emulator mode, connects to localhost:9099.
═══════════════════════════════════════════════════════════════════ */

import { getAuth, browserLocalPersistence, setPersistence, connectAuthEmulator } from 'firebase/auth';
import app from './config';

const auth = getAuth(app);

// Set explicit persistence (browserLocalPersistence is the default,
// but being explicit prevents silent fallback to sessionPersistence)
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('[Firebase Auth] Could not set persistence:', err.message);
});

// Connect to local emulator in development
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: false });
}

export { auth };
