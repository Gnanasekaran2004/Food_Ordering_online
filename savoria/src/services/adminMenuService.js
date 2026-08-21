import { db } from '../firebase/firestore';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';

/**
 * Subscribes to the real-time menu collection.
 * @param {function} callback - Called with (menuItems[], error)
 * @returns {function} unsubscribe function
 */
export function subscribeToMenu(callback) {
  const menuRef = collection(db, 'menuItems');
  const q = query(menuRef, orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snapshot) => {
    const menuItems = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
      };
    });
    callback(menuItems, null);
  }, (error) => {
    console.error("Error subscribing to menu:", error);
    callback([], error);
  });
}

/**
 * Creates a new menu item
 * @param {object} itemData 
 * @param {object} adminUser 
 */
export async function createMenuItem(itemData, adminUser) {
  const menuRef = collection(db, 'menuItems');
  const now = serverTimestamp();
  
  const newItemRef = await addDoc(menuRef, {
    ...itemData,
    price: Number(itemData.price),
    available: itemData.available !== undefined ? itemData.available : true,
    createdAt: now,
    updatedAt: now,
  });

  // Log activity
  if (adminUser) {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid: adminUser.uid,
      actorName: adminUser.displayName || adminUser.email || 'Admin',
      action: 'CREATE_MENU_ITEM',
      entityType: 'MENU',
      entityId: newItemRef.id,
      summary: `Admin created menu item "${itemData.name}"`,
      createdAt: now
    });
  }

  return newItemRef.id;
}

/**
 * Updates an existing menu item
 * @param {string} itemId 
 * @param {object} updates 
 * @param {object} adminUser 
 */
export async function updateMenuItem(itemId, updates, adminUser) {
  const itemRef = doc(db, 'menuItems', itemId);
  const now = serverTimestamp();
  
  const formattedUpdates = { ...updates, updatedAt: now };
  if ('price' in formattedUpdates) formattedUpdates.price = Number(formattedUpdates.price);

  await updateDoc(itemRef, formattedUpdates);

  // Log activity
  if (adminUser) {
    const actionDesc = updates.available !== undefined ? 
      (updates.available ? `marked "${updates.name}" available` : `marked "${updates.name}" unavailable`) : 
      `updated menu item "${updates.name || itemId}"`;

    await addDoc(collection(db, 'activityLogs'), {
      actorUid: adminUser.uid,
      actorName: adminUser.displayName || adminUser.email || 'Admin',
      action: 'UPDATE_MENU_ITEM',
      entityType: 'MENU',
      entityId: itemId,
      summary: `Admin ${actionDesc}`,
      createdAt: now
    });
  }
}

/**
 * Archives/Marks unavailable instead of hard deleting (or hard deletes if confirmed)
 * @param {string} itemId 
 * @param {string} name 
 * @param {object} adminUser 
 */
export async function deleteMenuItem(itemId, name, adminUser) {
  // Hard delete for now, but in practice, maybe just mark available = false
  const itemRef = doc(db, 'menuItems', itemId);
  await deleteDoc(itemRef);

  if (adminUser) {
    await addDoc(collection(db, 'activityLogs'), {
      actorUid: adminUser.uid,
      actorName: adminUser.displayName || adminUser.email || 'Admin',
      action: 'DELETE_MENU_ITEM',
      entityType: 'MENU',
      entityId: itemId,
      summary: `Admin deleted menu item "${name || itemId}"`,
      createdAt: serverTimestamp()
    });
  }
}
