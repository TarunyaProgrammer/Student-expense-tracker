import { useState } from 'react';
import TransactionList from './TransactionList';
import { Search, Filter } from 'lucide-react';

export default function TransactionsView({ transactions, deleteTransaction, filter, setFilter }) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter Logic
    const filteredTransactions = transactions.filter(t => {
        const matchesCategory = filter === 'all' || t.category === filter;
        const matchesSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              t.amount_paise.toString().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="view-transactions">
            <div className="dashboard-header">
                <div>
                   <h1 className="page-title">Transactions</h1>
                   <p className="text-muted">{filteredTransactions.length} items found</p>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="controls-bar card" style={{ padding: '16px', display: 'flex', gap: '10px', flexDirection: 'column', marginBottom:'20px' }}>
                
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search className="text-muted" size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                        type="text" 
                        placeholder="Search notes or amount..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="text-input"
                        style={{ paddingLeft: '40px' }}
                    />
                </div>

                {/* Filter Chips */}
                <div className="chip-grid" style={{ marginTop: '10px' }}>
                    {['all', 'food', 'essentials', 'fun', 'clothes', 'others'].map(cat => (
                        <button
                            key={cat}
                            className={`chip ${filter === cat ? 'active' : ''}`}
                            onClick={() => setFilter(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card" style={{ padding: '0 20px 20px 20px' }}>
                <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
            </div>
        </div>
    )
}
