/**
 * Sync Engine for Budgettt
 * Syncs IndexedDB <-> Firestore
 */
import { db as firestore } from './firebase.js';
import { DB } from './db.js';
import { getCurrentUserId } from './auth.js';
import { 
    collection, 
    doc, 
    writeBatch, 
    getDocs, 
    query, 
    where,
    Timestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const Sync = {
    // Push Local -> Cloud
    push: async () => {
        const uid = getCurrentUserId();
        if (!uid) return; // Not logged in

        const pending = await DB.getPendingSync();
        if (pending.length === 0) return;

        const batch = writeBatch(firestore);
        const userRef = collection(firestore, 'users', uid, 'transactions');

        pending.forEach(txn => {
            const docRef = doc(userRef, txn.id);
            // Prepare payload (exclude local only fields if any, but we sync everything)
            // Ensure we update sync status in cloud to true? No, cloud doesn't care.
            // But we must NOT sync 'synced' boolean to cloud ideally, or it doesn't matter.
            // Cloud version is source of truth.
            
            // We strip 'synced' before sending to keep cloud clean? 
            // The prompt data model says: source, synced, deleted, version...
            // It includes 'synced' in the object definition, but that's likely local state. 
            // I'll send it as true to cloud so if we pull it back we know it's synced.
            const payload = { ...txn, synced: true }; 
            batch.set(docRef, payload);
        });

        await batch.commit();

        // Mark local as synced
        const syncedItems = pending.map(t => ({ ...t, synced: true }));
        await DB.batchUpdate(syncedItems);
        
        console.log(`Synced ${pending.length} items to cloud.`);
    },

    // Pull Cloud -> Local
    pull: async () => {
        const uid = getCurrentUserId();
        if (!uid) return;

        // In a real optimized app, we'd track 'lastDataFetchTime'.
        // For MVP, we can fetch all or careful fetch.
        // Let's fetch all for simplicity and merge. 
        // Optimized: where('version', '>', localMaxVersion) - but we don't track versions explicitly globally.
        // We will fetch all from cloud for this MVP to ensure consistency on load.
        
        const userRef = collection(firestore, 'users', uid, 'transactions');
        const q = query(userRef); 
        const snapshot = await getDocs(q);
        
        const cloudTxns = [];
        snapshot.forEach(doc => {
            cloudTxns.push(doc.data());
        });

        if (cloudTxns.length > 0) {
            await DB.batchUpdate(cloudTxns);
            console.log(`Pulled ${cloudTxns.length} items from cloud.`);
        }
    },

    // Full Sync
    syncAll: async () => {
        await Sync.push();
        await Sync.pull();
    }
};
