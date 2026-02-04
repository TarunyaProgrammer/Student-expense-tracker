import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions'; // Lifted state
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';
import TransactionsView from './components/TransactionsView';
import AnalyticsView from './components/AnalyticsPage';
import Layout from './components/Layout';
import AddTransactionModal from './components/AddTransactionModal';
import './index.css';

function App() {
  const { user, loading, logout } = useAuth();
  const [skipped, setSkipped] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);

  // Hook instantiated here to share state
  const { transactions, refreshData, deleteTransaction, filter, setFilter } = useTransactions(user);

  if (loading) return null;

  const showDashboard = user || skipped;

  const handleLogout = async () => {
    if (user) await logout();
    setSkipped(false);
  };

  if (!showDashboard) {
      return <AuthView onSkip={() => setSkipped(true)} />;
  }

  return (
    <Layout 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onAddClick={() => setShowAddModal(true)}
    >
      {activeTab === 'dashboard' && (
          <Dashboard 
            onAddClick={() => setShowAddModal(true)} 
            transactions={transactions} 
            refreshData={refreshData}
          />
      )}
      {activeTab === 'transactions' && (
          <TransactionsView 
            transactions={transactions}
            deleteTransaction={deleteTransaction}
            filter={filter}
            setFilter={setFilter}
          />
      )}
      {activeTab === 'analytics' && <AnalyticsView transactions={transactions} />}

      {/* Global Add Modal */}
      {showAddModal && (
          <AddTransactionModal 
            onClose={() => setShowAddModal(false)} 
            onTransactionAdded={refreshData} 
          />
      )}
    </Layout>
  );
}

export default App
