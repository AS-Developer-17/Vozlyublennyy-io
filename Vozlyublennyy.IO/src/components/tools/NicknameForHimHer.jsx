import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Copy, Check, Heart, User } from 'lucide-react';
import { getNicknamesForHimHer } from '../../services/gemini';

export default function NicknameForHimHer() {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Him');
  const [loading, setLoading] = useState(false);
  const [nicknames, setNicknames] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setNicknames([]);
    setCopiedIndex(null);

    try {
      const generated = await getNicknamesForHimHer(name, gender);
      setNicknames(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getVibeColor = (vibe) => {
    const v = vibe.toLowerCase();
    if (v.includes('romantic') || v.includes('love')) return { bg: 'rgba(244, 63, 94, 0.1)', text: '#f43f5e' };
    if (v.includes('cute') || v.includes('sweet')) return { bg: 'rgba(236, 72, 153, 0.1)', text: '#ec4899' };
    if (v.includes('funny') || v.includes('playful')) return { bg: 'rgba(245, 158, 11, 0.1)', text: '#d97706' };
    if (v.includes('deep') || v.includes('poetic')) return { bg: 'rgba(99, 102, 241, 0.1)', text: '#4f46e5' };
    return { bg: 'rgba(16, 185, 129, 0.1)', text: '#059669' };
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container" style={{ maxWidth: '800px' }}>
        <div className="tool-header" style={{ marginBottom: '32px' }}>
          <span className="tool-emoji">💝</span>
          <h2>Nicknames for Him/Her</h2>
          <p>Generate 10 sweet, playful, and completely original nicknames customized for your special someone.</p>
        </div>

        <form onSubmit={handleGenerate} className="glass-panel" style={{ padding: '28px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--primary-border)', backgroundColor: 'var(--bg-secondary)', boxShadow: '0 8px 32px 0 rgba(236, 72, 153, 0.05)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="var(--primary)" /> Their Name
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g., James or Emily" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '1rem', border: '1px solid var(--primary-border)', transition: 'border-color 0.2s' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <Heart size={16} color="var(--primary)" /> Generate Nicknames For:
            </label>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['Him', 'Her'].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setGender(option)}
                  className={`btn ${gender === option ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    boxShadow: gender === option ? '0 4px 12px rgba(236, 72, 153, 0.2)' : 'none'
                  }}
                >
                  {option === 'Him' ? '👨 For Him' : '👩 For Her'}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !name.trim()}
            style={{ 
              width: '100%', 
              padding: '14px 20px', 
              fontSize: '1.05rem', 
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
              marginTop: '8px'
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <Sparkles size={18} className="animate-spin" /> Whispering Sweet Nothings...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <Sparkles size={18} /> Generate 10 Nicknames ✨
              </span>
            )}
          </button>
        </form>

        {nicknames.length > 0 && (
          <div style={{ marginTop: '40px' }} className="fade-in">
            <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              💖 10 Adorable Nicknames for {name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {nicknames.map((item, idx) => {
                const colors = getVibeColor(item.vibe);
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      border: '1px solid var(--primary-border)', 
                      borderRadius: 'var(--radius-md)', 
                      padding: '18px 24px', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      backgroundColor: 'var(--bg-tertiary)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                      transition: 'transform 0.2s, box-shadow 0.2s'
                    }}
                    className="card-hover-effect"
                  >
                    <div style={{ flex: 1, paddingRight: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{item.nickname}</span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          backgroundColor: colors.bg, 
                          color: colors.text, 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontWeight: 600,
                          textTransform: 'capitalize' 
                        }}>{item.vibe}</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>{item.explanation}</p>
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(item.nickname, idx)}
                      className="btn btn-outline"
                      style={{ padding: '8px 14px', fontSize: '0.85rem', flexShrink: 0 }}
                    >
                      {copiedIndex === idx ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={14} color="#10b981" /> Copied!
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Copy size={14} /> Copy
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
