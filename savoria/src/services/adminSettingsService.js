import { db } from '../firebase/firestore';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  addDoc
} from 'firebase/firestore';

export function subscribeToRestaurantConfig(callback) {
  const configRef = doc(db, 'restaurant', 'config');
  
  return onSnapshot(configRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data(), null);
    } else {
      // Default config if it doesn't exist
      callback(null, null);
    }
  }, (error) => {
    console.error("Error subscribing to config:", error);
    callback(null, error);
  });
}

export async function updateRestaurantConfig(newConfig, adminUser) {
  const configRef = doc(db, 'restaurant', 'config');
  const now = serverTimestamp();
  
  const docSnap = await getDoc(configRef);
  if (docSnap.exists()) {
    await updateDoc(configRef, { ...newConfig, updatedAt: now });
  } else {
    await setDoc(configRef, { ...newConfig, createdAt: now, updatedAt: now });
  }

  if (adminUser) {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid: adminUser.uid,
      actorName: adminUser.displayName || adminUser.email || 'Admin',
      action: 'UPDATE_SETTINGS',
      entityType: 'SETTINGS',
      entityId: 'config',
      summary: `Admin updated restaurant settings`,
      createdAt: now
    });
  }
}
