import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Smile, Copy, Check } from 'lucide-react';
import { getCustomNicknames } from '../../services/gemini';

export default function NicknameGenerator() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [loading, setLoading] = useState(false);
  const [nicknames, setNicknames] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateNames = async (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) return;

    setLoading(true);
    setNicknames([]);
    setCopiedIndex(null);

    try {
      const generated = await getCustomNicknames(name1, name2);
      setNicknames(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyNickname = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">💑</span>
          <h2>Couple Nickname Generator</h2>
          <p>Combine your names into a collection of sweet, funny, and adorable couple titles.</p>
        </div>

        <form onSubmit={generateNames} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">First Person's Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., Alex" 
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
              placeholder="e.g., Taylor" 
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
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Sparkles size={16} className="animate-spin" /> Blending Names...
              </span>
            ) : "Generate Couple Nicknames 💑"}
          </button>
        </form>

        {nicknames.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '16px', textAlign: 'center' }}>Adored Combinations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {nicknames.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.nickname}</span>
                      <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>{item.vibe}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.explanation}</p>
                  </div>
                  
                  <button
                    onClick={() => copyNickname(item.nickname, idx)}
                    className="btn btn-outline"
                    style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                  >
                    {copiedIndex === idx ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} color="green" /> Copied!
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Copy size={14} /> Copy
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
