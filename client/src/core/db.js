/**
 * IndexedDB Wrapper for Budgettt
 * Local-First Database
 */

const DB_NAME = 'budgettt_db';
const DB_VERSION = 1;
const STORE_KEY = 'transactions';

let db = null;

export const DB = {
  // Initialize Database
  init: () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_KEY)) {
          const store = db.createObjectStore(STORE_KEY, { keyPath: 'id' });
          store.createIndex('created_at_utc', 'created_at_utc', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
          store.createIndex('deleted', 'deleted', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        db = event.target.result;
        resolve(db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB Error:', event.target.error);
        reject(event.target.error);
      };
    });
  },

  // Add or Update Transaction
  addTransaction: (transaction) => {
    return new Promise((resolve, reject) => {
      if (!db) return reject("DB not initialized");
      const tx = db.transaction(STORE_KEY, 'readwrite');
      const store = tx.objectStore(STORE_KEY);
      
      // Force synced=false on edit so it gets pushed again
      transaction.synced = false;
      const request = store.put(transaction);

      request.onsuccess = () => resolve(transaction);
      request.onerror = () => reject(request.error);
    });
  },

  // Get All Transactions (sorted by date desc)
  getAllTransactions: () => {
    return new Promise((resolve, reject) => {
      if (!db) return reject("DB not initialized");
      const tx = db.transaction(STORE_KEY, 'readonly');
      const store = tx.objectStore(STORE_KEY);
      const index = store.index('created_at_utc');
      const request = index.getAll();

      request.onsuccess = () => {
        // Return only non-deleted items, sorted desc
        const res = request.result
          .filter(t => !t.deleted)
          .sort((a, b) => new Date(b.created_at_utc) - new Date(a.created_at_utc));
        resolve(res);
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Get Transactions pending sync
  getPendingSync: () => {
    return new Promise((resolve, reject) => {
      if (!db) return reject("DB not initialized");
      const tx = db.transaction(STORE_KEY, 'readonly');
      const store = tx.objectStore(STORE_KEY);
      const index = store.index('synced');
      const request = index.getAll(IDBKeyRange.only(0)); // 0 represents false in IDB indices sometimes, but let's be safe with boolean usage if supported or use filter manually for robustness
      
      request.onsuccess = () => {
         // Manual filter is safer across browsers if boolean index behavior varies
         const all = tx.db.transaction(STORE_KEY).objectStore(STORE_KEY).getAll();
         all.onsuccess = (e) => {
             const pending = e.target.result.filter(t => t.synced === false);
             resolve(pending);
         };
      };
      request.onerror = () => reject(request.error);
    });
  },

  // Soft Delete
  deleteTransaction: (id) => {
    return new Promise((resolve, reject) => {
       if (!db) return reject("DB not initialized");
       const tx = db.transaction(STORE_KEY, 'readwrite');
       const store = tx.objectStore(STORE_KEY);
       
       const getReq = store.get(id);
       getReq.onsuccess = () => {
           if (getReq.result) {
               const item = getReq.result;
               item.deleted = true;
               item.synced = false; // Mark needs sync to propagate delete
               store.put(item).onsuccess = () => resolve();
           } else {
               resolve(); // Already gone
           }
       };
       getReq.onerror = () => reject(getReq.error);
    });
  },
  
  // Batch update (for sync pull)
  batchUpdate: (transactions) => {
      return new Promise((resolve, reject) => {
         if (!db) return reject("DB not initialized");
         const tx = db.transaction(STORE_KEY, 'readwrite');
         const store = tx.objectStore(STORE_KEY);
         
         transactions.forEach(t => {
             // When pulling from cloud, we assume it's synced
             t.synced = true;
             store.put(t);
         });
         
         tx.oncomplete = () => resolve();
         tx.onerror = () => reject(tx.error);
      });
  },

  // Hard Reset (Logout/Clear)
  clearAll: () => {
      return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const tx = db.transaction(STORE_KEY, 'readwrite');
        const store = tx.objectStore(STORE_KEY);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
  }
};
