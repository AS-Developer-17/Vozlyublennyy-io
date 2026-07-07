import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Calendar } from 'lucide-react';

export default function LoveCalculatorDob() {
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const getLifePath = (dateString) => {
    if (!dateString) return 0;
    const digits = dateString.replace(/\D/g, '');
    let sum = digits.split('').reduce((acc, char) => acc + parseInt(char), 0);
    
    while (sum > 9 && sum !== 11 && sum !== 22) { // 11 and 22 are master numbers
      sum = sum.toString().split('').reduce((acc, char) => acc + parseInt(char), 0);
    }
    return sum;
  };

  const calculateDobCompatibility = (e) => {
    e.preventDefault();
    if (!dob1 || !dob2) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const lp1 = getLifePath(dob1);
      const lp2 = getLifePath(dob2);

      // Simple, fun compatibility matrix mapping
      const matrix = {
        // Equal master numbers / path numbers
        same: { score: 92, text: "Mirror Souls. You share the exact same core life frequency, leading to instant understanding and identical motivations." },
        compl: { score: 96, text: "Divine Harmonics! Your life paths form an ideal cosmic pair (like action and wisdom), building a highly stable and inspiring duo." },
        neutral: { score: 82, text: "Comfortable Resonance. You have minor differences in communication but share compatible life cycles that keep you balanced." },
        opp: { score: 68, text: "Spiritual Growth Partner. You walk contrasting paths, which means you might experience friction, but you push each other to grow." }
      };

      let type = 'neutral';
      if (lp1 === lp2) {
        type = 'same';
      } else if (
        (lp1 === 1 && lp2 === 9) || (lp1 === 9 && lp2 === 1) ||
        (lp1 === 3 && lp2 === 5) || (lp1 === 5 && lp2 === 3) ||
        (lp1 === 2 && lp2 === 8) || (lp1 === 8 && lp2 === 2) ||
        (lp1 === 7 && lp2 === 11) || (lp1 === 11 && lp2 === 7)
      ) {
        type = 'compl';
      } else if (Math.abs(lp1 - lp2) === 4 || Math.abs(lp1 - lp2) === 6) {
        type = 'opp';
      }

      const match = matrix[type];

      setResult({
        lp1,
        lp2,
        score: match.score,
        verdict: match.text
      });
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
          <span className="tool-emoji">📅</span>
          <h2>Love Calculator by DOB</h2>
          <p>Discover relationship compatibility using numerology principles and Life Path vibration numbers.</p>
        </div>

        <form onSubmit={calculateDobCompatibility} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">Your Date of Birth</label>
            <input 
              type="date" 
              className="form-input" 
              value={dob1}
              onChange={(e) => setDob1(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Their Date of Birth</label>
            <input 
              type="date" 
              className="form-input" 
              value={dob2}
              onChange={(e) => setDob2(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !dob1 || !dob2}
            style={{ width: '100%' }}
          >
            {loading ? 'Analyzing Numerology charts...' : 'Calculate DOB Compatibility 📅'}
          </button>
        </form>

        {result && (
          <div className="result-card" style={{ textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div className="score-display">{result.score}%</div>
              <h3 style={{ color: 'var(--primary-dark)' }}>Numerological Alignment</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0', borderBottom: '1px solid var(--primary-border)', paddingBottom: '16px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>YOUR LIFE PATH</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>#{result.lp1}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', color: 'var(--primary-border)' }}>&amp;</div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>THEIR LIFE PATH</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>#{result.lp2}</div>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
              <strong>Interpretation:</strong> {result.verdict}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
