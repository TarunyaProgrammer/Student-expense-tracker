import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { formatMoney } from '../core/money';
import { Sync } from '../core/sync';
import { exportCSV } from '../core/export';
import TransactionList from './TransactionList';
import AnalyticsView from './AnalyticsView';
import AIInsights from './AIInsights';

export default function Dashboard({ onLogout }) {
  const { user } = useAuth();
  const { 
    transactions, 
    filter, 
    setFilter, 
    addTransaction, 
    deleteTransaction,
    refreshData 
  } = useTransactions(user);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('others');
  const [note, setNote] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // Stats
  const totalIncome = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount_paise : acc, 0);
  const totalExpense = transactions.reduce((acc, t) => t.type === 'expense' ? acc + t.amount_paise : acc, 0);
  
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
        await addTransaction(amount, type, category, note);
        setAmount('');
        setNote('');
    } catch(err) {
        alert(err.message);
    }
  };

  const handleSync = async () => {
      setSyncing(true);
      try {
          await Sync.syncAll();
          await refreshData();
      } catch(e) {
          console.error(e);
          alert("Sync Failed");
      }
      setSyncing(false);
  };

  return (
    <section id="dashboard-view" className="view">
      <header>
        <div className="logo">
          Budgettt <span id="sync-status" className={`badge ${user ? 'online' : ''}`}>{user ? 'Online' : 'Offline'}</span>
        </div>
        <div className="actions">
          {user && (
            <button 
                id="sync-btn" 
                className={`icon-btn ${syncing ? 'spin' : ''}`} 
                onClick={handleSync} 
                title="Sync"
            >
                🔄
            </button>
          )}
          <button id="ai-btn" className="icon-btn" onClick={() => setShowAI(true)} title="AI Insights">✨</button>
          <button id="analytics-btn" className="icon-btn" onClick={() => setShowAnalytics(true)} title="Analytics">📊</button>
          <button id="export-btn" className="icon-btn" onClick={exportCSV} title="Export">⬇️</button>
          <button id="logout-btn" className="icon-btn" onClick={onLogout} title="Logout">🚪</button>
        </div>
      </header>

      {/* SUMMARY CARD */}
      <div className="summary-card">
        <div className="total-balance">
          <span className="label">Net Balance</span>
          <span className="amount">{formatMoney(totalIncome - totalExpense)}</span>
        </div>
        <div className="stats-row">
          <div className="stat income">
            <span className="label">Incoming</span>
            <span className="val">{formatMoney(totalIncome)}</span>
          </div>
          <div className="stat expense">
            <span className="label">Outgoing</span>
            <span className="val">{formatMoney(totalExpense)}</span>
          </div>
        </div>
      </div>

      {/* QUICK ADD FORM */}
      <div className="add-form-container">
        <form onSubmit={handleAdd}>
          <div className="amount-row">
            <div className="toggle-group">
              <input
                type="radio"
                name="type"
                id="type-expense"
                value="expense"
                checked={type === 'expense'}
                onChange={() => setType('expense')}
              />
              <label htmlFor="type-expense" className="toggle-btn expense">OUT</label>

              <input 
                type="radio" 
                name="type" 
                id="type-income" 
                value="income"
                checked={type === 'income'}
                onChange={() => setType('income')}
              />
              <label htmlFor="type-income" className="toggle-btn income">IN</label>
            </div>
            <input
              type="number"
              id="amount-input"
              placeholder="0"
              min="0"
              step="any"
              required
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="details-row">
            <select 
                id="category-input" 
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
              <option value="food">🍔 Food</option>
              <option value="essentials">🧴 Essentials</option>
              <option value="clothes">👕 Clothes</option>
              <option value="fun">🎉 Fun</option>
              <option value="others">📦 Others</option>
            </select>
            <input 
                type="text" 
                id="note-input" 
                placeholder="Note (optional)" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit" className="btn-submit">Add</button>
          </div>
        </form>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <button className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
        <button className={`filter-chip ${filter === 'food' ? 'active' : ''}`} onClick={() => setFilter('food')}>Food</button>
        <button className={`filter-chip ${filter === 'fun' ? 'active' : ''}`} onClick={() => setFilter('fun')}>Fun</button>
      </div>

      {/* TRANSACTION LIST */}
      <TransactionList transactions={transactions} onDelete={deleteTransaction} />
      
      {showAnalytics && <AnalyticsView transactions={transactions} onClose={() => setShowAnalytics(false)} />}
      {showAI && <AIInsights onClose={() => setShowAI(false)} />}
    </section>
  );
}
