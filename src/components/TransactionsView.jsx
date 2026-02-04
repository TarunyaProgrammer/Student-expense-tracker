export default function TransactionsView({ transactions, deleteTransaction, filter, setFilter }) {
    const { user } = useAuth();
    // useTransactions hook usage removed, props used instead

    return (
        <div>
            <div className="dashboard-header">
                <h1 className="page-title">Recent Transactions</h1>
                <div className="filters">
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', background: 'var(--bg-card)', color: 'white' }}
                    >
                        <option value="all">All Categories</option>
                        <option value="food">Food</option>
                        <option value="essentials">Essentials</option>
                        <option value="fun">Fun</option>
                    </select>
                </div>
            </div>

            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </div>
    )
}
