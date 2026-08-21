import { useState, useEffect } from 'react';
import { db } from '../../../firebase/firestore';
import { collection, query, getDocs, onSnapshot, where } from 'firebase/firestore';

export function usePublicMenu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const menuRef = collection(db, 'menuItems');
    const unsubscribe = onSnapshot(menuRef, (snapshot) => {
      const fetchedDishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDishes(fetchedDishes);
      setLoading(false);
      setError(null);
    }, (err) => {
      console.error("Error fetching public menu:", err);
      setError(err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { dishes, loading, error };
}
