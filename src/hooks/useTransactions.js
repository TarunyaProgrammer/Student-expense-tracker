import { useState, useEffect, useCallback } from 'react';
import { DB } from '../core/db';
import { Sync } from '../core/sync';
import { generateUUID, getUTCNow } from '../core/utils';
import { toPaise } from '../core/money';

export function useTransactions(user) {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');

  const refreshData = useCallback(async () => {
    try {
      if (!DB.initPromise) await DB.init(); 
      
      const all = await DB.getAllTransactions();
      const filtered = all.filter(t => {
        if (filter === 'all') return true;
        return t.category === filter;
      });
      setTransactions(filtered);
    } catch (e) {
      console.error("Failed to fetch transactions", e);
    }
  }, [filter]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync on mount if user exists
  useEffect(() => {
    if (user) {
        Sync.pull().then(refreshData);
    }
  }, [user, refreshData]);

  const addTransaction = async (amountStr, type, category, note) => {
    const amountPaise = toPaise(amountStr);
    if (amountPaise <= 0) throw new Error("Invalid Amount");

    const txn = {
      id: generateUUID(),
      amount_paise: amountPaise,
      type,
      category,
      note,
      created_at_utc: getUTCNow(),
      source: "pwa-react",
      synced: false,
      deleted: false,
      version: 1,
    };

    await DB.addTransaction(txn);
    await refreshData();
    
    if (user) {
        Sync.push(); // fire and forget
    }
  };

  const deleteTransaction = async (id) => {
      if (!confirm("Delete this transaction?")) return;
      await DB.deleteTransaction(id);
      await refreshData();
      if (user) Sync.push();
  };

  return {
    transactions,
    filter,
    setFilter,
    addTransaction,
    deleteTransaction,
    refreshData
  };
}
