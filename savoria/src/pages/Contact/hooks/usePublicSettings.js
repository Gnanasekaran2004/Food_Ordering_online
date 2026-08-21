import { useState, useEffect } from 'react';
import { db } from '../../../firebase/firestore';
import { doc, onSnapshot } from 'firebase/firestore';

export function usePublicSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const configRef = doc(db, 'restaurant', 'config');
    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      } else {
        setSettings(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching public settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { settings, loading };
}
