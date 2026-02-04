import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthView from './components/AuthView';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const { user, loading, logout } = useAuth();
  const [skipped, setSkipped] = useState(false);

  if (loading) return null;

  const showDashboard = user || skipped;

  const handleLogout = async () => {
    if (user) {
        await logout();
    }
    setSkipped(false); // Reset to auth view
  };

  return (
    <div className="app-container">
      {!showDashboard ? (
        <AuthView onSkip={() => setSkipped(true)} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App
