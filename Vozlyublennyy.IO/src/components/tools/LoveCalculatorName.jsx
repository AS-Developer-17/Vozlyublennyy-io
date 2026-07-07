import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';

export default function LoveCalculatorName() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculateCompatibility = (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const n1 = name1.toLowerCase().trim();
      const n2 = name2.toLowerCase().trim();

      // Algorithm: Vowels ratio and letters intersection
      const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'а', 'е', 'ё', 'и', 'о', 'у', 'ы', 'э', 'ю', 'я'];
      
      const n1Vowels = n1.split('').filter(c => vowels.includes(c)).length;
      const n2Vowels = n2.split('').filter(c => vowels.includes(c)).length;
      
      // Percentage of vowels similarity
      const vRatio1 = n1.length > 0 ? n1Vowels / n1.length : 0;
      const vRatio2 = n2.length > 0 ? n2Vowels / n2.length : 0;
      const vowelMatch = 100 - Math.abs(vRatio1 - vRatio2) * 50;

      // Common characters count
      let common = 0;
      const set1 = new Set(n1.replace(/\s+/g, '').split(''));
      const set2 = new Set(n2.replace(/\s+/g, '').split(''));
      
      set1.forEach(char => {
        if (set2.has(char)) {
          common++;
        }
      });

      const intersectionMatch = set1.size + set2.size > 0 
        ? (common / Math.min(set1.size, set2.size)) * 30
        : 0;

      // Final score formula: base 60 + details
      let finalScore = Math.round(55 + (vowelMatch * 0.25) + (intersectionMatch * 0.7));
      if (finalScore > 100) finalScore = 100;
      if (finalScore < 45) finalScore = 45;

      let explanation = '';
      if (finalScore >= 85) {
        explanation = `The phonetics of "${name1}" and "${name2}" sync beautifully! Your names share a high concentration of compatible consonants and vowel structures, indicating effortless communication and alignment.`;
      } else if (finalScore >= 70) {
        explanation = `There is a lovely phonetic balance. Your name letters share a standard set of common sounds, suggesting you bring different strengths to the table while understanding each other well.`;
      } else {
        explanation = `Your names are phonetically distinct! While you have fewer overlapping letters, this suggests a relationship of "opposites attract," where both partners offer fresh perspectives and variety.`;
      }

      setResult({
        score: finalScore,
        explanation,
        vowelsShared: common,
        harmony: Math.round(vowelMatch)
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
          <span className="tool-emoji">💕</span>
          <h2>Love Calculator by Name</h2>
          <p>Analyze phonetic synergy, vowel harmonies, and letter overlap between your two names.</p>
        </div>

        <form onSubmit={calculateCompatibility} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">First Partner Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Emily" 
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Second Partner Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., James" 
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
            {loading ? 'Evaluating Letters...' : 'Match Names 💕'}
          </button>
        </form>

        {result && (
          <div className="result-card" style={{ textAlign: 'left' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div className="score-display">{result.score}%</div>
              <h3 style={{ color: 'var(--primary-dark)' }}>Name Harmony Rating</h3>
            </div>
            
            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '16px' }}>
              {result.explanation}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--primary-border)', paddingTop: '16px', fontSize: '0.85rem' }}>
              <div>
                <strong>Overlapping unique letters:</strong> {result.vowelsShared}
              </div>
              <div>
                <strong>Acoustic Rhythm Match:</strong> {result.harmony}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
