import fs from 'fs';
import path from 'path';

// Note: Ensure package.json has "type": "module" if using ES imports, or just run with Node > 14
// This script requires firebase-admin to be installed. We'll require it dynamically.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

async function setAdminClaim() {
  const identifier = process.argv[2];
  if (!identifier) {
    console.error('Usage: node scripts/setAdminClaim.mjs <user-email-or-uid>');
    process.exit(1);
  }

  const { getApps, initializeApp } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('ERROR: GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
    process.exit(1);
  }

  if (getApps().length === 0) {
    initializeApp();
  }

  try {
    const auth = getAuth();
    let user;
    
    if (identifier.includes('@')) {
      console.log(`Looking up user by email: ${identifier}...`);
      user = await auth.getUserByEmail(identifier);
    } else {
      console.log(`Looking up user by UID: ${identifier}...`);
      user = await auth.getUser(identifier);
    }

    console.log(`Found user: ${user.email} (UID: ${user.uid}). Setting admin claim...`);
    await auth.setCustomUserClaims(user.uid, { admin: true });
    console.log('Success! The user must log out and log back in to receive the new token.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

setAdminClaim();
