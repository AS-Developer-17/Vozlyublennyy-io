import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

export default function FriendshipCalculator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [qualities, setQualities] = useState({
    trust: false,
    humor: false,
    loyalty: false,
    hobbies: false,
    support: false,
    texting: false
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCheckbox = (key) => {
    setQualities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateFriendship = (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      // Calculate quality points (up to 30)
      const qualityScore = Object.values(qualities).filter(Boolean).length * 5;
      
      // Calculate alphabetical compatibility base (60 - 70)
      const combined = (name1 + name2).toLowerCase().replace(/\s+/g, '');
      let charSum = 0;
      for (let i = 0; i < combined.length; i++) {
        charSum += combined.charCodeAt(i);
      }
      const baseScore = (charSum % 11) + 60; // 60 to 70

      const finalScore = Math.min(100, baseScore + qualityScore);

      let verdict = '';
      let desc = '';

      if (finalScore >= 90) {
        verdict = "Inseparable Besties! 🌟";
        desc = "Your friendship is a solid gold standard. You share trust, laughter, and mutual support that can withstand any distance or time.";
      } else if (finalScore >= 75) {
        verdict = "Loyal Companions! 🤝";
        desc = "You share a wonderful connection with plenty of common ground. You can count on each other and have great conversations.";
      } else if (finalScore >= 60) {
        verdict = "Fun Buddies! 🎉";
        desc = "A cheerful connection filled with laughter and lightweight chats. Focus on expanding shared hobbies to deepen the bond.";
      } else {
        verdict = "Emerging Connection. 🌱";
        desc = "You're still getting to know each other! Take time to build trust and find common grounds to see your bond flourish.";
      }

      setResult({
        score: finalScore,
        verdict,
        desc
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">🤝</span>
          <h2>Friendship Calculator</h2>
          <p>Find out your friendship compatibility index by selecting shared values and traits.</p>
        </div>

        <form onSubmit={calculateFriendship} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Your name..."
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Your Friend's Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Friend's name..."
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '12px' }}>Select all qualities that describe your friendship:</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={qualities.trust} 
                  onChange={() => handleCheckbox('trust')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                Complete Trust & Secrets
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={qualities.humor} 
                  onChange={() => handleCheckbox('humor')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                Uncontrollable Laughter
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={qualities.loyalty} 
                  onChange={() => handleCheckbox('loyalty')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                Always Have Each Other's Backs
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={qualities.hobbies} 
                  onChange={() => handleCheckbox('hobbies')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                Shared Interests / Games
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={qualities.support} 
                  onChange={() => handleCheckbox('support')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                Emotional Support / Listening
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.95rem' }}>
                <input 
                  type="checkbox" 
                  checked={qualities.texting} 
                  onChange={() => handleCheckbox('texting')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                />
                Late Night Chats / Constant DMs
              </label>

            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !name1.trim() || !name2.trim()}
            style={{ width: '100%' }}
          >
            {loading ? 'Evaluating Bond...' : 'Check Friendship Score 🤝'}
          </button>
        </form>

        {result && (
          <div className="result-card">
            <div className="score-display" style={{ color: 'var(--primary-dark)' }}>{result.score}%</div>
            <h3 style={{ color: 'var(--text-main)', marginBottom: '8px' }}>{result.verdict}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{result.desc}</p>
          </div>
        )}
      </div>
    </div>
  );
}
