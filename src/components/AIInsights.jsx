import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AIInsights({ onClose }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [error, setError] = useState('');

  const generateInsight = async () => {
    setLoading(true);
    setError('');
    try {
        const token = await user.getIdToken();
        const res = await fetch('/api/insights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!res.ok) throw new Error("Failed to generate insight");
        
        const data = await res.json();
        setInsight(data.insight);
    } catch (e) {
        console.error(e);
        setError("Could not generate insights at this time.");
    }
    setLoading(false);
  };

  return (
    <div className="analytics-modal glass">
      <div className="analytics-header">
         <h2>AI Spending Insights</h2>
         <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="ai-container">
        {!insight ? (
            <div className="ai-intro">
                <p><strong>✨ Unlock Smart Insights</strong></p>
                <p>Generate a personalized summary of your spending habits using Google Gemini.</p>
                <div className="privacy-note">
                    <small>⚠️ Privacy Notice: This will send an anonymous summary of your recent transactions to Google's AI servers. Access is read-only and transient.</small>
                </div>
                <button onClick={generateInsight} className="btn-primary" disabled={loading}>
                    {loading ? 'Generating...' : 'Analyze My Spending'}
                </button>
            </div>
        ) : (
            <div className="ai-result">
                <h3>Your Monthly Briefing</h3>
                <div className="ai-text">
                    {insight.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                </div>
                <button onClick={() => setInsight('')} className="btn-secondary" style={{marginTop: 20}}>
                    Start Over
                </button>
            </div>
        )}
        {error && <p className="error-msg" style={{marginTop: 20}}>{error}</p>}
      </div>
    </div>
  );
}
