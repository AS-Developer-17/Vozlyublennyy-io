import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function FlamesGame() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runFlames = (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      // Standard FLAMES algorithm
      let n1Str = name1.toLowerCase().replace(/\s+/g, '');
      let n2Str = name2.toLowerCase().replace(/\s+/g, '');

      // Cross out common letters
      const n1Arr = n1Str.split('');
      const n2Arr = n2Str.split('');

      for (let i = 0; i < n1Arr.length; i++) {
        const char = n1Arr[i];
        const matchIdx = n2Arr.indexOf(char);
        if (matchIdx !== -1) {
          n1Arr[i] = null;
          n2Arr[matchIdx] = null;
        }
      }

      const remaining1 = n1Arr.filter(c => c !== null);
      const remaining2 = n2Arr.filter(c => c !== null);
      const count = remaining1.length + remaining2.length;

      // Flames elimination
      let flames = ['F', 'L', 'A', 'M', 'E', 'S'];
      
      if (count > 0) {
        let tempFlames = [...flames];
        let startIdx = 0;
        while (tempFlames.length > 1) {
          let eliminateIdx = (startIdx + count - 1) % tempFlames.length;
          tempFlames.splice(eliminateIdx, 1);
          startIdx = eliminateIdx;
        }
        flames = tempFlames;
      } else {
        // default if 0 remaining
        flames = ['F'];
      }

      const relationshipMap = {
        'F': { name: 'Friendship 🤝', desc: 'A comfortable, long-lasting, and supportive bond.' },
        'L': { name: 'Love ❤️', desc: 'Deep romantic feelings and strong mutual attraction.' },
        'A': { name: 'Affection 💖', desc: 'Fondness, caring gestures, and emotional closeness.' },
        'M': { name: 'Marriage 💍', desc: 'Lifetime commitment and sharing a home together.' },
        'E': { name: 'Enemy ⚡', desc: 'Sparks fly, but sometimes conflict or friction happens.' },
        'S': { name: 'Sister / Sibling 🌸', desc: 'A protective, sibling-like connection of platonic care.' }
      };

      const finalKey = flames[0];
      setResult({
        count,
        key: finalKey,
        name: relationshipMap[finalKey].name,
        desc: relationshipMap[finalKey].desc,
        remainingN1: n1Arr,
        remainingN2: n2Arr
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
          <span className="tool-emoji">✨</span>
          <h2>FLAMES Game</h2>
          <p>The nostalgic schoolyard game to discover your ultimate relationship connection.</p>
        </div>

        <form onSubmit={runFlames} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">First Person's Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Romeo" 
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Second Person's Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Juliet" 
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !name1.trim() || !name2.trim()}
            style={{ width: '100%' }}
          >
            {loading ? 'Crossing Out Letters...' : 'Play FLAMES ✨'}
          </button>
        </form>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <div className="typing-dots" style={{ justifyContent: 'center' }}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        {result && (
          <div className="result-card" style={{ textAlign: 'left' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '16px', textAlign: 'center' }}>FLAMES Analysis</h3>
            
            <p style={{ marginBottom: '12px', fontSize: '0.95rem' }}>
              <strong>Remaining character count:</strong> {result.count}
            </p>

            <div className="flames-grid">
              {['F', 'L', 'A', 'M', 'E', 'S'].map((letter, idx) => {
                const labelMap = { 'F': 'Friends', 'L': 'Love', 'A': 'Affection', 'M': 'Marriage', 'E': 'Enemy', 'S': 'Sibling' };
                const isActive = result.key === letter;
                return (
                  <div 
                    key={idx} 
                    className={`flames-result-box ${isActive ? 'active' : ''}`}
                  >
                    <div style={{ fontSize: '1.2rem' }}>{letter}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{labelMap[letter]}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid var(--primary-border)', paddingTop: '20px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: '8px' }}>
                {result.name}
              </div>
              <p style={{ color: 'var(--text-muted)' }}>{result.desc}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
