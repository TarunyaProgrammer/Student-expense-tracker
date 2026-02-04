const DB_NAME = 'budgettt_db';
const DB_VERSION = 1;
const STORE_KEY = 'transactions';

export const DB = {
  db: null,
  initPromise: null,

  init: () => {
    if (DB.initPromise) return DB.initPromise;
    
    DB.initPromise = new Promise((resolve, reject) => {
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
        DB.db = event.target.result;
        resolve(DB.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB Error:', event.target.error);
        reject(event.target.error);
      };
    });
    return DB.initPromise;
  },

  getAllTransactions: async () => {
    if (!DB.db) await DB.init();
    return new Promise((resolve, reject) => {
      const transaction = DB.db.transaction([STORE_KEY], 'readonly');
      const store = transaction.objectStore(STORE_KEY);
      const index = store.index('created_at_utc'); 
      const request = index.getAll();

      request.onsuccess = () => {
        // Filter out deleted items locally if needed, but usually we just show all non-deleted
        // Logic: if deleted=true, don't show.
        const all = request.result;
        const visible = all.filter(t => !t.deleted);
        resolve(visible);
      };
      request.onerror = () => reject(request.error);
    });
  },

  addTransaction: async (txn) => {
    if (!DB.db) await DB.init();
    return new Promise((resolve, reject) => {
      const transaction = DB.db.transaction([STORE_KEY], 'readwrite');
      const store = transaction.objectStore(STORE_KEY);
      const request = store.put(txn);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Soft delete
  deleteTransaction: async (id) => {
      if (!DB.db) await DB.init();
      // We need to fetch it first to preserve other fields?
      // Or just patch? IDB put overwrites. 
      // Helper to get first.
      return new Promise((resolve, reject) => {
          const tx = DB.db.transaction([STORE_KEY], 'readwrite');
          const store = tx.objectStore(STORE_KEY);
          const getReq = store.get(id);

          getReq.onsuccess = () => {
              const item = getReq.result;
              if (item) {
                  item.deleted = true;
                  item.synced = false; // Needs sync
                  store.put(item);
              }
              resolve();
          };
          getReq.onerror = () => reject(getReq.error);
      });
  },

  getPendingSync: async () => {
    if (!DB.db) await DB.init();
    return new Promise((resolve, reject) => {
         const tx = DB.db.transaction([STORE_KEY], 'readonly');
         const store = tx.objectStore(STORE_KEY);
         const index = store.index('synced');
         // We want synced=false (0 in IDB boolean sorting? No, boolean works)
         const request = index.getAll(IDBKeyRange.only(false));
         
         request.onsuccess = () => resolve(request.result);
         request.onerror = () => reject(request.error);
    });
  },

  batchUpdate: async (items) => {
      if (!DB.db) await DB.init();
      return new Promise((resolve, reject) => {
          const tx = DB.db.transaction([STORE_KEY], 'readwrite');
          const store = tx.objectStore(STORE_KEY);
          
          items.forEach(item => {
              store.put(item);
          });
          
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
      });
  }
};
