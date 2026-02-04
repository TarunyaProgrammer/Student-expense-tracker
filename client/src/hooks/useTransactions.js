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
      // Note: DB.init is idempotent usually, but let's ensure it's called.
      // In app.js init() called DB.init(). 
      // In React, we might need a global init or check inside methods.
      // The current core/db.js just exposes 'init', it doesn't self-run.
      // We should probably call DB.init() in App.jsx or main.jsx once.
      
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

  const getStats = () => {
      let income = 0;
      let expense = 0;
      // Stats usually calculated on ALL transactions, not just filtered view?
      // PWA implementation: `allTxns.forEach...` -> CALCULATES ON ALL.
      // So we need 'all' txns for stats, but 'filtered' for list.
      // Let's optimize: fetch all, then filter for list.
      // For now, I'll allow this hook to just return what it has, 
      // but maybe we need two states: allTransactions and visibleTransactions.
      // Re-reading logic: PWA `refreshData` gets ALL, calcs stats, then filters list.
      // I should replicate that.
      return { income, expense }; // Placeholder, logic needs to be inside refreshData to be efficient
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
