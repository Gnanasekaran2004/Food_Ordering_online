/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Auth Service Interface
   ─────────────────────────────────────────────────────────────
   SINGLE SWAP POINT for the authentication backend.

   To migrate to Firebase:
   1. Create firebaseAuthService.js with the same exported functions.
   2. Change the import below from mockAuthService to firebaseAuthService.
   3. Done — no page components change.
═══════════════════════════════════════════════════════════════ */

export {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  sendPasswordResetEmail,
} from './firebaseAuthService';
