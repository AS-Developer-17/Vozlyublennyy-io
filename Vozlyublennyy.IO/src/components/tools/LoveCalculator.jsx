import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Flame } from 'lucide-react';

export default function LoveCalculator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculateLove = (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    setLoading(true);
    setResult(null);

    // Simple deterministic calculation based on name characters
    setTimeout(() => {
      const combined = (name1 + name2).toLowerCase().replace(/\s+/g, '');
      let sum = 0;
      for (let i = 0; i < combined.length; i++) {
        sum += combined.charCodeAt(i);
      }
      const score = (sum % 41) + 60; // range 60-100 for fun vibes!

      let message = '';
      if (score >= 90) {
        message = "Soulmates! Your compatibility is written in the stars. 🌌";
      } else if (score >= 80) {
        message = "A vibrant spark! You share deep empathy and connection. 💕";
      } else if (score >= 70) {
        message = "Great compatibility! A wonderful potential for a strong bond. 🌱";
      } else {
        message = "Warm feelings. With work and trust, this can grow beautifully. ✨";
      }

      setResult({ score, message });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>
      
      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">💞</span>
          <h2>Love Calculator</h2>
          <p>Determine your compatibility score based on name synergy and relationship vibes.</p>
        </div>

        <form onSubmit={calculateLove} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter your name..." 
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Their Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter their name..." 
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !name1.trim() || !name2.trim()}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={18} className="heart-icon animate-bounce" fill="#fff" /> Calculating Compatibility...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Heart size={18} /> Calculate Love Score
              </span>
            )}
          </button>
        </form>

        {result && (
          <div className="result-card">
            <Heart size={48} fill="var(--primary)" color="var(--primary)" style={{ margin: '0 auto 16px', display: 'block' }} />
            <div className="score-display">{result.score}%</div>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }}>Compatibility Result</h3>
            <p style={{ fontWeight: '500', color: 'var(--text-main)' }}>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
