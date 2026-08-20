/* ═══════════════════════════════════════════════════════════════
   SAVORIA — Admin Service
   ─────────────────────────────────────────────────────────────
   Firestore queries for the Admin Dashboard.
═══════════════════════════════════════════════════════════════ */

import { db } from '../firebase/firestore';
import { 
  collection, 
  query, 
  orderBy, 
  limit as fsLimit, 
  getDocs, 
  doc, 
  updateDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';

/**
 * Get recent orders across all customers
 */
export async function getRecentOrders(limitCount = 20) {
  const ordersRef = collection(db, 'orders');
  const q = query(ordersRef, orderBy('createdAt', 'desc'), fsLimit(limitCount));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: data.orderId || doc.id,
      docId: doc.id,
      customer: data.customerSnapshot?.name || 'Unknown',
      email: data.customerSnapshot?.email || '',
      date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      items: data.items?.length || 0,
      amount: data.total || 0,
      status: data.orderStatus || 'Pending',
      payment: data.paymentStatus || 'Pending',
      orderItems: data.items || []
    };
  });
}

/**
 * Get recent customers
 */
export async function getRecentCustomers(limitCount = 15) {
  const usersRef = collection(db, 'users');
  // Usually we'd order by createdAt desc, but we'll just get a generic list for now
  const q = query(usersRef, fsLimit(limitCount));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.displayName || data.username || 'Unknown',
      email: data.email,
      phone: data.phone || 'N/A',
      orders: 0, // Would require aggregation or a field on user
      totalSpent: 0, // Would require aggregation
      lastOrder: 'N/A',
      status: 'Active',
      joinDate: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      favoriteDish: data.diningPreference || 'None'
    };
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderDocId, newStatus) {
  const orderRef = doc(db, 'orders', orderDocId);
  await updateDoc(orderRef, {
    orderStatus: newStatus,
    updatedAt: serverTimestamp()
  });
}
