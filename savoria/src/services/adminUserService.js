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
  addDoc,
  where
} from 'firebase/firestore';

/**
 * Subscribes to real-time users/customers for the admin dashboard.
 * @param {function} callback - Called with (customers[], error)
 * @returns {function} unsubscribe function
 */
export function subscribeToCustomers(callback) {
  const usersRef = collection(db, 'users');
  
  // We only fetch those with role 'customer'
  const q = query(
    usersRef,
    where('role', '==', 'customer'),
    orderBy('createdAt', 'desc'),
    limit(500)
  );

  return onSnapshot(q, (snapshot) => {
    const customers = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        name: data.displayName || data.username || 'Unknown',
        email: data.email || 'Unknown',
        phone: data.phone || 'Not provided',
        status: data.disabled ? 'Inactive' : 'Active',
        joinDate: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        // Compute mock or real metrics if stored on the user document
        orders: data.orderCount || 0,
        totalSpent: data.totalSpent || 0,
      };
    });
    callback(customers, null);
  }, (error) => {
    console.error("Error subscribing to customers:", error);
    callback([], error);
  });
}

/**
 * Update a customer profile (e.g. disable account)
 * @param {string} customerId 
 * @param {object} updates 
 * @param {object} adminUser
 */
export async function updateCustomerStatus(customerId, status, adminUser) {
  if (!customerId) return;

  const userRef = doc(db, 'users', customerId);
  const now = serverTimestamp();
  
  const isDisabled = status === 'Inactive';
  
  await updateDoc(userRef, {
    disabled: isDisabled,
    updatedAt: now
  });

  // Log activity
  if (adminUser) {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid: adminUser.uid,
      actorName: adminUser.displayName || adminUser.email || 'Admin',
      action: isDisabled ? 'DISABLE_CUSTOMER' : 'ENABLE_CUSTOMER',
      entityType: 'USER',
      entityId: customerId,
      summary: `Admin marked customer ${customerId} as ${status}`,
      createdAt: now
    });
  }
}
