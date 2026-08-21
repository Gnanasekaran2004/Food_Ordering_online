/**
 * SAVORIA — Admin Claim Setup Script
 * ════════════════════════════════════════════════════════════════
 * This script grants or revokes the Firebase 'admin' custom claim
 * on a user account. Custom claims are the ONLY secure way to
 * enforce admin access — they are set server-side and verified
 * via getIdTokenResult() in the frontend.
 *
 * USAGE:
 *   node scripts/set-admin-claim.cjs <email> [--revoke]
 *
 * PREREQUISITES:
 *   1. Install firebase-admin: already in devDependencies
 *   2. Download a Service Account key from:
 *      Firebase Console → Project Settings → Service Accounts → Generate new private key
 *   3. Save it as: scripts/serviceAccountKey.json (NEVER commit this file)
 *      OR set the environment variable: GOOGLE_APPLICATION_CREDENTIALS=<path>
 *
 * EXAMPLES:
 *   Grant admin:  node scripts/set-admin-claim.cjs admin@savoria.com
 *   Revoke admin: node scripts/set-admin-claim.cjs admin@savoria.com --revoke
 *
 * SECURITY NOTES:
 *   - The serviceAccountKey.json is in .gitignore
 *   - Never expose this key in the frontend or commit it to source control
 *   - After setting the claim, the user must sign out and sign in again
 *     for the new claim to be reflected in their ID token
 * ════════════════════════════════════════════════════════════════
 */

const admin = require('firebase-admin');
const path  = require('path');

// ── Load service account ──────────────────────────────────────
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const credentialEnv      = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialEnv) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  } catch (e) {
    console.error('\n❌  Cannot load service account credentials.');
    console.error('   Download your key from:');
    console.error('   Firebase Console → Project Settings → Service Accounts → Generate new private key');
    console.error('   Save as: scripts/serviceAccountKey.json\n');
    process.exit(1);
  }
} else {
  admin.initializeApp();
}

// ── Parse arguments ───────────────────────────────────────────
const args    = process.argv.slice(2);
const email   = args.find(a => !a.startsWith('--'));
const revoke  = args.includes('--revoke');

if (!email) {
  console.error('\n❌  Usage: node scripts/set-admin-claim.cjs <email> [--revoke]\n');
  process.exit(1);
}

// ── Set / revoke claim ────────────────────────────────────────
async function run() {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    
    const claims = revoke
      ? { admin: false }
      : { admin: true  };

    await admin.auth().setCustomUserClaims(userRecord.uid, claims);

    if (revoke) {
      console.log(`\n✅  Admin claim REVOKED for ${email} (uid: ${userRecord.uid})`);
    } else {
      console.log(`\n✅  Admin claim GRANTED to ${email} (uid: ${userRecord.uid})`);
    }

    console.log('   The user must sign out and sign in again for the change to take effect.\n');
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      console.error(`\n❌  No user found with email: ${email}\n`);
    } else {
      console.error('\n❌  Error:', err.message, '\n');
    }
    process.exit(1);
  }
}

run();
