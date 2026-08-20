/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Order Service
   ─────────────────────────────────────────────────────────────
   Handles creating and fetching orders from Firestore.
═══════════════════════════════════════════════════════════════ */

import { db } from '../firebase/firestore';
import { 
  collection, 
  doc, 
  setDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Persist a finalized order to Firestore
 * @param {string} userId - The authenticated user's ID
 * @param {object} publicUser - The user's public profile data (name, email)
 * @param {object} paymentResult - The result object from processPayment
 */
export async function createOrder(userId, publicUser, paymentResult) {
  if (!userId || !paymentResult) throw new Error("Missing required order data");

  const orderRef = doc(collection(db, 'orders'));
  
  const orderData = {
    userId,
    customerSnapshot: {
      name: publicUser.displayName || publicUser.username,
      email: publicUser.email,
      phone: publicUser.phone || ''
    },
    items: paymentResult.items, // already includes qty and price
    subtotal: paymentResult.subtotal,
    tax: paymentResult.tax,
    total: paymentResult.total,
    currency: 'INR',
    paymentMethod: paymentResult.method,
    paymentStatus: 'Paid', // Assuming mock payment succeeded
    orderStatus: 'Pending',
    orderId: paymentResult.orderId,
    transactionId: paymentResult.transactionId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(orderRef, orderData);
  return orderRef.id;
}

/**
 * Fetch a user's order history
 * @param {string} userId 
 * @param {number} maxResults 
 */
export async function getUserOrders(userId, maxResults = 10) {
  if (!userId) return [];
  
  const ordersRef = collection(db, 'orders');
  const q = query(
    ordersRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(maxResults)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
    };
  });
}
