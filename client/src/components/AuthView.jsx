import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthView({ onSkip }) {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const action = isLogin ? login : register;
    const res = await action(email, password);

    if (res.error) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <section id="auth-view" className="view auth-container">
        <h1>Budgettt</h1>
        <p>Privacy-First Money Tracker</p>

        <div id="auth-forms">
          {error && <div className="error-msg">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>

          <p className="auth-switch">
            Or <a href="#" onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Create Account' : 'Login'}
            </a>
          </p>
          <button id="skip-login" className="btn-secondary" onClick={onSkip}>
            Skip / Offline Mode
          </button>
        </div>
    </section>
  );
}
