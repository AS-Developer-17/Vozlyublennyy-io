import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { evaluateCouplesAlignment } from '../../services/gemini';

const LOVE_LANGS = [
  "Words of Affirmation",
  "Quality Time",
  "Receiving Gifts",
  "Acts of Service",
  "Physical Touch"
];

export default function CouplesLoveLanguageTest() {
  const [p1Name, setP1Name] = useState('');
  const [p2Name, setP2Name] = useState('');
  const [p1Primary, setP1Primary] = useState(LOVE_LANGS[0]);
  const [p1Secondary, setP1Secondary] = useState(LOVE_LANGS[1]);
  const [p2Primary, setP2Primary] = useState(LOVE_LANGS[2]);
  const [p2Secondary, setP2Secondary] = useState(LOVE_LANGS[3]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!p1Name.trim() || !p2Name.trim()) return;

    setLoading(true);
    setResult(null);

    const partner1Langs = { primary: p1Primary, secondary: p1Secondary };
    const partner2Langs = { primary: p2Primary, secondary: p2Secondary };

    try {
      const evaluation = await evaluateCouplesAlignment(p1Name, partner1Langs, p2Name, partner2Langs);
      setResult(evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">💑</span>
          <h2>Couples Love Language Test</h2>
          <p>Compare profiles and see how your languages interact. Discover how to satisfy each other's emotional needs.</p>
        </div>

        <form onSubmit={handleEvaluate} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Partner 1 card */}
            <div style={{ border: '1px solid var(--primary-border)', padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)' }}>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '16px' }}>Partner 1</h3>
              
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Partner 1 name..." 
                  value={p1Name}
                  onChange={(e) => setP1Name(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Love Language</label>
                <select className="form-select" value={p1Primary} onChange={(e) => setP1Primary(e.target.value)}>
                  {LOVE_LANGS.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Secondary Love Language</label>
                <select className="form-select" value={p1Secondary} onChange={(e) => setP1Secondary(e.target.value)}>
                  {LOVE_LANGS.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
            </div>

            {/* Partner 2 card */}
            <div style={{ border: '1px solid var(--primary-border)', padding: '20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-tertiary)' }}>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.1rem', marginBottom: '16px' }}>Partner 2</h3>
              
              <div className="form-group">
                <label className="form-label">Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Partner 2 name..." 
                  value={p2Name}
                  onChange={(e) => setP2Name(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Love Language</label>
                <select className="form-select" value={p2Primary} onChange={(e) => setP2Primary(e.target.value)}>
                  {LOVE_LANGS.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Secondary Love Language</label>
                <select className="form-select" value={p2Secondary} onChange={(e) => setP2Secondary(e.target.value)}>
                  {LOVE_LANGS.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                </select>
              </div>
            </div>

          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !p1Name.trim() || !p2Name.trim()}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Sparkles size={16} className="animate-spin" /> Analyzing Connection Chemistry...
              </span>
            ) : "Calculate Couples Alignment 💑"}
          </button>
        </form>

        {result && (
          <div className="result-card" style={{ textAlign: 'left', marginTop: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="score-display">{result.harmonyIndex}%</div>
              <h3 style={{ color: 'var(--primary-dark)' }}>{result.summary || "Relational Alignment"}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>
                {p1Name} &amp; {p2Name}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--primary-border)', paddingTop: '20px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              <strong>Points of Harmony:</strong>
              <p style={{ marginTop: '6px', color: 'var(--text-muted)' }}>{result.harmonyAnalysis}</p>
            </div>

            <div style={{ marginTop: '20px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)' }}>
              <strong>Potential Friction Zones:</strong>
              <p style={{ marginTop: '6px', color: 'var(--text-muted)' }}>{result.frictionAnalysis}</p>
            </div>

            {result.tips && result.tips.length > 0 && (
              <div style={{ borderTop: '1px solid var(--primary-border)', paddingTop: '20px', marginTop: '20px' }}>
                <strong>Relational Therapy Tips:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {result.tips.map((tip, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
