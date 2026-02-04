import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { formatMoney } from '../core/money';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsView({ transactions }) {
    // 1. Expense Breakdown by Category
    const categoryData = useMemo(() => {
        const expenses = transactions.filter(t => t.type === 'expense');
        const grouped = {};
        expenses.forEach(t => {
            if (!grouped[t.category]) grouped[t.category] = 0;
            grouped[t.category] += t.amount_paise / 100;
        });

        return Object.keys(grouped).map(cat => ({
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            value: grouped[cat]
        })).sort((a, b) => b.value - a.value);
    }, [transactions]);

    // 2. Monthly Trend (Income vs Expense)
    const trendData = useMemo(() => {
        const grouped = {};
        // Group by Mon-Year (e.g., "Jan 24")
        transactions.forEach(t => {
            const date = new Date(t.created_at_utc);
            const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            
            if (!grouped[key]) grouped[key] = { name: key, income: 0, expense: 0 };
            
            if (t.type === 'income') grouped[key].income += t.amount_paise / 100;
            else grouped[key].expense += t.amount_paise / 100;
        });

        // Sort by date logic roughly (or just reverse chronological if simple list)
        // For simplicity, we just take keys. Real app would sort by time.
        return Object.values(grouped).reverse(); 
    }, [transactions]);

    return (
        <div className="view-analytics">
             <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Analytics</h1>
                    <p className="text-muted">Analyze your spending habits</p>
                </div>
            </div>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* PIE CHART */}
                <div className="card">
                    <h3 style={{ marginBottom: '20px', fontSize: '1rem', fontWeight: 600 }}>Expense Breakdown</h3>
                    {categoryData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        formatter={(val) => `₹${val.toFixed(2)}`}
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="no-data text-muted" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            No expense data yet
                        </div>
                    )}
                </div>

                {/* BAR CHART */}
                <div className="card">
                    <h3 style={{ marginBottom: '20px', fontSize: '1rem', fontWeight: 600 }}>Monthly Trends</h3>
                    {trendData.length > 0 ? (
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                                    <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
                                    <YAxis stroke="var(--color-text-muted)" fontSize={12} />
                                    <Tooltip 
                                        formatter={(val) => `₹${val.toFixed(2)}`}
                                        contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--color-border)', color: 'var(--color-text-main)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" name="Expense" fill="var(--color-danger)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                         <div className="no-data text-muted" style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            No trend data yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
