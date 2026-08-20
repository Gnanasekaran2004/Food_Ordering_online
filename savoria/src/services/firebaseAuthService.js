/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Firebase Auth Service
   ─────────────────────────────────────────────────────────────
   Production authentication implementation.
   Connects to Firebase Auth and Firestore for profiles.
═══════════════════════════════════════════════════════════════ */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification, 
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  AuthErrorCodes
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  writeBatch 
} from 'firebase/firestore';
import { auth } from '../firebase/auth';
import { db } from '../firebase/firestore';

// ── Helpers ───────────────────────────────────────────────────

function normalizeUsername(username) {
  return username.toLowerCase().trim();
}

function authError(code, message) {
  const err = new Error(message);
  err.code = code;
  return err;
}

// Map Firebase auth errors to our UI error codes (which match the mock service)
function mapFirebaseError(error) {
  switch (error.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return authError('auth/email-already-in-use', 'An account with this email already exists.');
    case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
    case AuthErrorCodes.INVALID_PASSWORD:
    case AuthErrorCodes.USER_DELETED:
      return authError('auth/invalid-credential', 'Invalid email or password.');
    case AuthErrorCodes.WEAK_PASSWORD:
      return authError('auth/weak-password', 'Your password is too weak. Please choose a stronger one.');
    case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
      return authError('auth/too-many-requests', 'Too many attempts. Please wait a moment before trying again.');
    case AuthErrorCodes.NETWORK_REQUEST_FAILED:
      return authError('auth/network-request-failed', 'A network error occurred. Please check your connection.');
    default:
      return authError(error.code, error.message);
  }
}

// ── Register ──────────────────────────────────────────────────
export async function register({ displayName, username, email, password, phone = '' }) {
  const normUsername = normalizeUsername(username);
  const usernameRef = doc(db, 'usernames', normUsername);

  try {
    // 1. Check username uniqueness BEFORE creating auth user
    const usernameDoc = await getDoc(usernameRef);
    if (usernameDoc.exists()) {
      throw authError('auth/username-taken', 'This username is already taken. Please choose another.');
    }

    // 2. Create Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 3. Update Firebase Auth Profile
    await firebaseUpdateProfile(user, { displayName: displayName.trim() });

    // 4. Create Firestore User Profile and reserve Username (in a batch or sequential)
    const userRef = doc(db, 'users', user.uid);
    
    // We use a batch to safely create both without read dependencies
    const batch = writeBatch(db);
    batch.set(usernameRef, { uid: user.uid });
    
    const profileData = {
      uid: user.uid,
      username: normUsername,
      displayName: displayName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      photoURL: null,
      dietaryPreference: 'no-preference',
      allergies: [],
      diningPreference: 'no-preference',
      role: 'customer',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    batch.set(userRef, profileData);
    await batch.commit();

    // 5. Send Verification Email
    await sendEmailVerification(user);

    // 6. Return public user object
    return await getProfile(user.uid);

  } catch (error) {
    if (error.code === 'auth/username-taken') throw error;
    throw mapFirebaseError(error);
  }
}

// ── Login ─────────────────────────────────────────────────────
export async function login({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getProfile(userCredential.user.uid);
    return profile;
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

// ── Logout ────────────────────────────────────────────────────
export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw mapFirebaseError(error);
  }
}

// ── Get current session user (Internal Profile Fetcher) ───────
export async function getProfile(uid) {
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Handle serverTimestamps that might be pending locally
      return {
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

// ── Get current session user ──────────────────────────────────
// Note: AuthContext handles the listener, this is just for synchronous checks if needed
export function getCurrentUser() {
  return auth.currentUser;
}

// ── Update profile ────────────────────────────────────────────
export async function updateProfile(uid, updates) {
  try {
    const userRef = doc(db, 'users', uid);
    
    // If username is changing, we need to handle the uniqueness check and swapping
    if (updates.username) {
      const normNewUsername = normalizeUsername(updates.username);
      
      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists()) throw authError('auth/user-not-found', 'User not found.');
        
        const currentNormUsername = userDoc.data().username;
        
        if (currentNormUsername !== normNewUsername) {
          const newUsernameRef = doc(db, 'usernames', normNewUsername);
          const newUsernameDoc = await transaction.get(newUsernameRef);
          
          if (newUsernameDoc.exists()) {
            throw authError('auth/username-taken', 'This username is already taken.');
          }
          
          // Claim new, release old
          transaction.set(newUsernameRef, { uid });
          transaction.delete(doc(db, 'usernames', currentNormUsername));
          
          // Update profile with new username
          transaction.update(userRef, { 
            ...updates,
            username: normNewUsername,
            updatedAt: serverTimestamp() 
          });
        } else {
          // Username didn't actually change
          const safeUpdates = { ...updates };
          delete safeUpdates.username;
          transaction.update(userRef, { ...safeUpdates, updatedAt: serverTimestamp() });
        }
      });
    } else {
      // Simple update
      await updateDoc(userRef, { ...updates, updatedAt: serverTimestamp() });
    }

    // Update Firebase Auth display name if provided
    if (updates.displayName && auth.currentUser) {
      await firebaseUpdateProfile(auth.currentUser, { displayName: updates.displayName });
    }

    return await getProfile(uid);
  } catch (error) {
    if (error.code === 'auth/username-taken') throw error;
    throw mapFirebaseError(error);
  }
}

// ── Reset password ────────────────────────────────────────────
export async function sendPasswordResetEmail(email) {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { sent: true };
  } catch (error) {
    // We intentionally don't throw errors here for unknown emails to prevent enumeration
    console.error("Password reset error:", error);
    return { sent: true };
  }
}
