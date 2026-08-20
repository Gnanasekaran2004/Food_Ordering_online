/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Mock Authentication Service
   ─────────────────────────────────────────────────────────────
   TEMPORARY FRONTEND-ONLY IMPLEMENTATION.
   Purpose: full UI/UX testing without a backend.

   FIREBASE MIGRATION:
   Replace this file with firebaseAuthService.js and update the
   single import in authService.js. No page components change.

   Storage: sessionStorage (tabs share state, clears on close).
   Passwords are NOT hashed — this is a UI prototype only.
═══════════════════════════════════════════════════════════════ */

const USERS_KEY   = 'savoria_users_v1';
const SESSION_KEY = 'savoria_session_v1';

// ── Helpers ───────────────────────────────────────────────────
function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}
function saveSession(user) {
  if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(SESSION_KEY);
}

// ── Create a safe public user object (no password) ────────────
function toPublicUser(u) {
  return {
    uid:              u.uid,
    username:         u.username,
    displayName:      u.displayName,
    email:            u.email,
    phone:            u.phone || '',
    photoURL:         u.photoURL || null,
    dietaryPreference: u.dietaryPreference || 'no-preference',
    allergies:        u.allergies || [],
    diningPreference: u.diningPreference || 'no-preference',
    role:             u.role || 'customer',
    createdAt:        u.createdAt,
    updatedAt:        u.updatedAt || u.createdAt,
  };
}

// ── Mock error factory ────────────────────────────────────────
function authError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

// ── Register ──────────────────────────────────────────────────
export async function register({ displayName, username, email, password, phone = '' }) {
  await delay(600); // simulate network
  const users = getUsers();

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw authError('auth/email-already-in-use', 'An account with this email already exists.');
  }
  if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
    throw authError('auth/username-taken', 'This username is already taken.');
  }

  const user = {
    uid:         crypto.randomUUID(),
    username:    username.trim(),
    displayName: displayName.trim(),
    email:       email.toLowerCase().trim(),
    password,            // ⚠ prototype only — never do this in production
    phone:       phone.trim(),
    photoURL:    null,
    dietaryPreference: 'no-preference',
    allergies:   [],
    diningPreference: 'no-preference',
    role:        'customer',
    createdAt:   new Date().toISOString(),
    updatedAt:   new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  const publicUser = toPublicUser(user);
  saveSession(publicUser);
  return publicUser;
}

// ── Login ─────────────────────────────────────────────────────
export async function login({ email, password }) {
  await delay(600);
  const users = getUsers();
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user || user.password !== password) {
    throw authError('auth/invalid-credential', 'Invalid email or password.');
  }

  const publicUser = toPublicUser(user);
  saveSession(publicUser);
  return publicUser;
}

// ── Logout ────────────────────────────────────────────────────
export async function logout() {
  await delay(200);
  saveSession(null);
}

// ── Get current session user ──────────────────────────────────
export function getCurrentUser() {
  return getSession();
}

// ── Update profile ────────────────────────────────────────────
export async function updateProfile(uid, updates) {
  await delay(500);
  const users = getUsers();
  const idx   = users.findIndex(u => u.uid === uid);
  if (idx === -1) throw authError('auth/user-not-found', 'User not found.');

  // Username uniqueness (skip self)
  if (updates.username) {
    const conflict = users.find(
      (u, i) => i !== idx && u.username.toLowerCase() === updates.username.toLowerCase()
    );
    if (conflict) throw authError('auth/username-taken', 'This username is already taken.');
  }

  const updated = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
  users[idx] = updated;
  saveUsers(users);

  const publicUser = toPublicUser(updated);
  saveSession(publicUser);
  return publicUser;
}

// ── Reset password (UI stub — will connect to Firebase later) ──
export async function sendPasswordResetEmail(email) {
  await delay(800);
  const users = getUsers();
  // Don't reveal whether the email exists (security best practice)
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
  return { sent: exists }; // UI shows same message regardless
}

// ── Utility ───────────────────────────────────────────────────
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}
