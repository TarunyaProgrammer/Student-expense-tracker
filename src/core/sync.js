/**
 * Sync Engine for Budgettt
 * Syncs IndexedDB <-> Vercel Backend API
 */
import { DB } from './db.js';
import { auth } from './firebase.js'; // Use auth instance to get tokens

export const Sync = {
    // Push Local -> Cloud
    push: async () => {
        const user = auth.currentUser;
        if (!user) return; 

        // Get Pending Items
        const pending = await DB.getPendingSync();
        if (pending.length === 0) return;

        try {
            const token = await user.getIdToken();
            
            // Push to Backend
            const res = await fetch('/api/sync/push', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ transactions: pending })
            });

            if (!res.ok) throw new Error("Sync Push Failed: " + res.statusText);

            // Mark local as synced
            const syncedItems = pending.map(t => ({ ...t, synced: true }));
            await DB.batchUpdate(syncedItems);
            
            console.log(`Synced ${pending.length} items to cloud.`);
        } catch (e) {
            console.error("Sync Push Error:", e);
            // Don't mark as synced so we retry later
        }
    },

    // Pull Cloud -> Local
    pull: async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
            const token = await user.getIdToken();
            
            // Pull from Backend
            const res = await fetch('/api/sync/pull', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Sync Pull Failed: " + res.statusText);
            
            const data = await res.json();
            const cloudTxns = data.transactions || [];

            if (cloudTxns.length > 0) {
                await DB.batchUpdate(cloudTxns);
                console.log(`Pulled ${cloudTxns.length} items from cloud.`);
            }
        } catch (e) {
            console.error("Sync Pull Error:", e);
        }
    },

    // Full Sync
    syncAll: async () => {
        await Sync.push();
        await Sync.pull();
    }
};
