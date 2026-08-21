import { db } from '../firebase/firestore';
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';

export function subscribeToActivity(callback) {
  const activityRef = collection(db, 'activityLogs');
  const q = query(activityRef, orderBy('createdAt', 'desc'), limit(100));

  return onSnapshot(q, (snapshot) => {
    const activities = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    callback(activities, null);
  }, (error) => {
    console.error("Error subscribing to activity:", error);
    callback([], error);
  });
}
