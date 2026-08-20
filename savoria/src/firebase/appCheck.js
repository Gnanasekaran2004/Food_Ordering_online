/* ═══════════════════════════════════════════════════════════════════
   SAVORIA — Firebase App Check
   ────────────────────────────────────────────────────────────────
   App Check adds an extra layer of protection by verifying requests
   come from your actual app (not scrapers/attackers).

   CURRENT STATE: Monitoring mode (no enforcement).
   App Check collects data but does NOT block unenforced requests.

   TO ENABLE ENFORCEMENT:
   1. In Firebase Console → App Check → Apps → click your web app
   2. Click "Enforce" for Firestore and Authentication
   3. Monitor for 1–2 days first to ensure no legitimate traffic is blocked
   4. Remove the `isTokenAutoRefreshEnabled: false` if you enforce.

   PROVIDER: reCAPTCHA v3
   - In Google Cloud Console → reCAPTCHA → create a v3 site key
   - Add your domain (and localhost for dev)
   - Set VITE_RECAPTCHA_SITE_KEY in .env.local
═══════════════════════════════════════════════════════════════════ */

import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import app from './config';

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// Only initialize App Check if a site key is configured.
// This allows the app to work during development without App Check
// until the reCAPTCHA site key is properly set up.
if (siteKey) {
  // Debug token for local development — set this in browser console:
  //   self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  // Then Firebase will generate a debug token for your local machine.
  if (import.meta.env.DEV) {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(siteKey),
    // Auto-refresh tokens before they expire
    isTokenAutoRefreshEnabled: true,
  });
} else if (import.meta.env.DEV) {
  // In dev without a key: enable debug token mode so other Firebase
  // services (Auth, Firestore) still work without App Check enforcement
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

// This module is imported for its side effects (initializeAppCheck).
// Import it once in main.jsx or App.jsx before any Firebase usage.
