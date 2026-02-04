import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTransactions } from '../hooks/useTransactions';
import { formatMoney } from '../core/money';
import { Sync } from '../core/sync';
import { exportCSV } from '../core/export';
import TransactionList from './TransactionList';
import { Wallet, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

export default function Dashboard({ onAddClick, transactions, refreshData }) {
  const { user } = useAuth();
  // useTransactions state is now passed in
  const [syncing, setSyncing] = useState(false);

  // Stats
  const totalIncome = transactions.reduce((acc, t) => t.type === 'income' ? acc + t.amount_paise : acc, 0);
  const totalExpense = transactions.reduce((acc, t) => t.type === 'expense' ? acc + t.amount_paise : acc, 0);
  
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
    <div className="view-dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <div>
           <h1 className="page-title">Overview</h1>
           <p className="text-muted">Welcome back!</p>
        </div>
        <div className="actions" style={{display:'flex', gap:'10px'}}>
             {user && (
                <button onClick={handleSync} className={`btn-icon ${syncing ? 'spin' : ''}`} title="Sync">
                    <RefreshCw size={20} className={syncing ? 'animate-spin' : ''} />
                </button>
             )}
             <button onClick={onAddClick} className="btn-primary">
                + Add Transaction
             </button>
        </div>
      </div>

      {/* BALANCE CARD */}
      <div className="card balance-card">
        <div className="balance-label">Net Balance</div>
        <div className="balance-amount">{formatMoney(totalIncome - totalExpense)}</div>
        
        <div className="stats-grid">
            <div className="stat-item">
                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
                    <div className="icon-box" style={{background: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)'}}>
                        <TrendingUp size={18} />
                    </div>
                    <span className="text-muted" style={{fontSize:'0.85rem'}}>Income</span>
                </div>
                <div className="val text-success" style={{fontSize:'1.1rem', fontWeight:600}}>
                    {formatMoney(totalIncome)}
                </div>
            </div>

            <div className="stat-item">
                <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px'}}>
                    <div className="icon-box" style={{background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)'}}>
                        <TrendingDown size={18} />
                    </div>
                    <span className="text-muted" style={{fontSize:'0.85rem'}}>Expense</span>
                </div>
                <div className="val text-danger" style={{fontSize:'1.1rem', fontWeight:600}}>
                    {formatMoney(totalExpense)}
                </div>
            </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS (Limit 5) */}
      <div style={{marginBottom:'10px'}}>
        <h3 style={{fontSize:'1rem', fontWeight:600, marginBottom:'10px'}}>Recent Activity</h3>
        <TransactionList transactions={transactions.slice(0, 5)} onDelete={() => {}} />
      </div>

    </div>
  );
}

