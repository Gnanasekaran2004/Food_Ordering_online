import { db } from '../firebase/firestore';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

/**
 * Subscribes to real-time orders for the admin dashboard.
 * @param {string} dateRange - 'today', '7d', '30d', '3m', '12m'
 * @param {function} callback - Called with (orders[], error)
 * @returns {function} unsubscribe function
 */
export function subscribeToOrders(dateRange = '30d', callback) {
  const ordersRef = collection(db, 'orders');
  
  // Calculate start date based on range
  const now = new Date();
  let startDate = new Date();
  
  if (dateRange === 'today') {
    startDate.setHours(0, 0, 0, 0);
  } else if (dateRange === '7d') {
    startDate.setDate(now.getDate() - 7);
  } else if (dateRange === '30d') {
    startDate.setDate(now.getDate() - 30);
  } else if (dateRange === '3m') {
    startDate.setMonth(now.getMonth() - 3);
  } else if (dateRange === '12m') {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  // We order by createdAt. Note: Requires index on createdAt
  const q = query(
    ordersRef,
    where('createdAt', '>=', startDate),
    orderBy('createdAt', 'desc'),
    limit(1000) // Hard limit to prevent massive memory usage
  );

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Format for the UI
        date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        customer: data.customerSnapshot?.name || 'Unknown',
        email: data.customerSnapshot?.email || 'Unknown',
        amount: data.total || 0,
        status: data.orderStatus || 'Pending',
        payment: data.paymentStatus || 'Pending',
      };
    });
    callback(orders, null);
  }, (error) => {
    console.error("Error subscribing to orders:", error);
    callback([], error);
  });
}

/**
 * Updates an order's status and logs the activity.
 * @param {string} orderId 
 * @param {string} newStatus 
 * @param {object} adminUser - The authenticated admin user (to record actor)
 */
export async function updateOrderStatus(orderId, newStatus, adminUser) {
  if (!orderId || !newStatus) return;

  const orderRef = doc(db, 'orders', orderId);
  const now = serverTimestamp();
  
  // Map status to specific timestamp fields if needed
  const updateData = {
    orderStatus: newStatus,
    updatedAt: now
  };
  
  // Add operational timestamps
  if (newStatus === 'Confirmed') updateData.confirmedAt = now;
  else if (newStatus === 'Preparing') updateData.preparingAt = now;
  else if (newStatus === 'Ready') updateData.readyAt = now;
  else if (newStatus === 'Completed') updateData.completedAt = now;
  else if (newStatus === 'Cancelled') updateData.cancelledAt = now;

  await updateDoc(orderRef, updateData);

  // Log activity
  if (adminUser) {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid: adminUser.uid,
      actorName: adminUser.displayName || adminUser.email || 'Admin',
      action: 'UPDATE_ORDER_STATUS',
      entityType: 'ORDER',
      entityId: orderId,
      summary: `Admin updated order ${orderId} to ${newStatus}`,
      createdAt: now
    });
  }
}
