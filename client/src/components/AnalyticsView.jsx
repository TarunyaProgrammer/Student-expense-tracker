import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatMoney } from '../core/money';

const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#8884d8'];

export default function AnalyticsView({ transactions, onClose }) {
  // Aggregate data for Pie Chart (Expenses by Category)
  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const grouped = {};
    expenses.forEach(t => {
       if (!grouped[t.category]) grouped[t.category] = 0;
       grouped[t.category] += t.amount_paise / 100; // Convert to Rupee for charts
    });
    
    return Object.keys(grouped).map(cat => ({
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        value: grouped[cat]
    })).filter(d => d.value > 0);
  }, [transactions]);

  return (
    <div className="analytics-modal glass">
      <div className="analytics-header">
         <h2>Spending Analytics</h2>
         <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="chart-container">
        <h3>Expenses by Category</h3>
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
                    <Tooltip formatter={(val) => `₹${val.toFixed(2)}`} />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <p className="no-data">No expense data to display.</p>
        )}
      </div>
    </div>
  );
}
