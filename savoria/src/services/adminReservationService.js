import { db } from '../firebase/firestore';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

export function subscribeToReservations(callback) {
  const resRef = collection(db, 'reservations');
  const q = query(resRef, orderBy('createdAt', 'desc'), limit(500));

  return onSnapshot(q, (snapshot) => {
    const reservations = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    callback(reservations, null);
  }, (error) => {
    console.error("Error subscribing to reservations:", error);
    callback([], error);
  });
}

export async function updateReservationStatus(resId, status, adminUser) {
  if (!resId) return;

  const resRef = doc(db, 'reservations', resId);
  const now = serverTimestamp();
  
  await updateDoc(resRef, {
    status,
    updatedAt: now
  });

  if (adminUser) {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid: adminUser.uid,
      actorName: adminUser.displayName || adminUser.email || 'Admin',
      action: 'UPDATE_RESERVATION',
      entityType: 'RESERVATION',
      entityId: resId,
      summary: `Admin marked reservation ${resId} as ${status}`,
      createdAt: now
    });
  }
}
