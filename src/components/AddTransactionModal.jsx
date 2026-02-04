import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';

export default function AddTransactionModal({ onClose, onTransactionAdded }) {
  const { addTransaction } = useTransactions(null); // We just need the add function
  
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;
    
    setLoading(true);
    try {
        await addTransaction(amount, type, category, note);
        if (onTransactionAdded) onTransactionAdded();
        onClose();
    } catch(e) {
        alert("Error adding transaction");
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
            <h3>Add Transaction</h3>
            <button onClick={onClose} className="btn-icon text-muted"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
            {/* TYPE TOGGLE */}
            <div className="type-toggle-container">
                <button 
                    type="button"
                    className={`type-btn ${type === 'expense' ? 'active-expense' : ''}`}
                    onClick={() => setType('expense')}
                >
                    Expense
                </button>
                <button 
                    type="button"
                    className={`type-btn ${type === 'income' ? 'active-income' : ''}`}
                    onClick={() => setType('income')}
                >
                    Income
                </button>
            </div>

            {/* AMOUNT */}
            <div className="input-group">
                <label>Amount</label>
                <div className="amount-input-wrapper">
                    <span>₹</span>
                    <input 
                        type="number" 
                        placeholder="0" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        autoFocus
                        inputMode="decimal"
                        step="any"
                    />
                </div>
            </div>

            {/* CATEGORY */}
            <div className="input-group">
                <label>Category</label>
                <div className="chip-grid">
                    {['food', 'essentials', 'clothes', 'fun', 'others'].map(cat => (
                        <button
                            key={cat}
                            type="button"
                            className={`chip ${category === cat ? 'active' : ''}`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* NOTE */}
            <div className="input-group">
                <label>Note</label>
                <input 
                    type="text" 
                    placeholder="What was this for?"
                    value={note}
                    onChange={(e) => setNote(e.target.value)} 
                    className="text-input"
                />
            </div>

            <button type="submit" className="btn-primary btn-block" disabled={loading}>
                {loading ? 'Adding...' : 'Save Transaction'}
            </button>
        </form>
      </div>
    </div>
  );
}
