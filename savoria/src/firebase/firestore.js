/* ═══════════════════════════════════════════════════════════════════
   SAVORIA — Firestore Instance
   ────────────────────────────────────────────────────────────────
   Exports the single Firestore db instance.

   In emulator mode, connects to localhost:8080.
═══════════════════════════════════════════════════════════════════ */

import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import app from './config';

const db = getFirestore(app);

// Connect to local emulator in development
if (import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}

export { db };
