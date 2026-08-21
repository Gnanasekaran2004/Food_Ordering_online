import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { dishes } from '../src/data/menuData.js';

// Since this is just a quick local script, and the user already has a service account from their backend. 
// Wait, do they have a service account? In scripts/setAdminClaim.mjs they used a serviceAccountKey.json.
import serviceAccount from './serviceAccountKey.json' with { type: 'json' };

const app = initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore(app);

async function seed() {
  console.log('Seeding menuItems...');
  for (const dish of dishes) {
    const dishRef = db.collection('menuItems').doc(dish.id);
    const data = {
      ...dish,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    await dishRef.set(data);
    console.log(`Seeded: ${dish.name}`);
  }
  console.log('Done!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
