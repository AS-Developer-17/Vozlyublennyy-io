import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Quote, Sparkles, Copy, Check } from 'lucide-react';
import { getCustomLoveQuote } from '../../services/gemini';

export default function LoveQuotes() {
  const [activeCategory, setActiveCategory] = useState('romantic');
  const [customQuote, setCustomQuote] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const staticQuotes = {
    romantic: [
      { text: "I swear I couldn't love you more than I do right now, and yet I know I will tomorrow.", author: "Leo Christopher" },
      { text: "If I had a flower for every time I thought of you... I could walk through my garden forever.", author: "Alfred Tennyson" },
      { text: "Grow old along with me! The best is yet to be.", author: "Robert Browning" }
    ],
    sad: [
      { text: "It is better to have loved and lost than never to have loved at all.", author: "Alfred Tennyson" },
      { text: "Pleasure of love lasts but a moment. Pain of love lasts a lifetime.", author: "Bette Davis" },
      { text: "The worst feeling in the world is knowing you've done the best you could, and it still wasn't good enough.", author: "Anonymous" }
    ],
    inspirational: [
      { text: "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage.", author: "Lao Tzu" },
      { text: "We are shaped and fashioned by what we love.", author: "Johann Wolfgang von Goethe" },
      { text: "Love itself is what is left over when being in love has burned away.", author: "Louis de Bernières" }
    ]
  };

  const handleGenerateQuote = async () => {
    setLoading(true);
    setCustomQuote('');
    setCopied(false);
    try {
      const q = await getCustomLoveQuote(activeCategory);
      setCustomQuote(q);
    } catch (e) {
      setCustomQuote("Failed to generate quote. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">💌</span>
          <h2>Love Quotes</h2>
          <p>Find beautiful words of affection or request Gemini to write a completely original quote just for you.</p>
        </div>

        {/* Categories Tab selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center' }}>
          {['romantic', 'sad', 'inspirational'].map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setCustomQuote(''); }}
              className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{ textTransform: 'capitalize', padding: '8px 16px', fontSize: '0.9rem' }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Selected Category static quotes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {staticQuotes[activeCategory].map((q, idx) => (
            <div key={idx} style={{ border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-md)', padding: '20px', position: 'relative', backgroundColor: 'var(--bg-tertiary)' }}>
              <Quote size={24} color="var(--primary-light)" style={{ position: 'absolute', top: '10px', left: '10px', opacity: 0.5 }} />
              <p style={{ fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-main)', marginBottom: '8px', paddingLeft: '16px' }}>
                "{q.text}"
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 600 }}>— {q.author}</span>
                <button 
                  onClick={() => copyToClipboard(`"${q.text}" — ${q.author}`)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
                  title="Copy quote"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Gemini Generator section */}
        <div style={{ borderTop: '2px dashed var(--primary-border)', paddingTop: '28px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '12px' }}>Need something completely original?</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Generate a brand new quote in the selected category using Gemini AI.</p>
          
          <button 
            onClick={handleGenerateQuote} 
            className="btn btn-primary" 
            disabled={loading}
            style={{ margin: '0 auto' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} className="animate-spin" /> Sparking Creativity...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Generate AI Quote
              </span>
            )}
          </button>

          {customQuote && (
            <div className="result-card" style={{ marginTop: '24px', backgroundColor: 'var(--bg-secondary)', position: 'relative' }}>
              <p style={{ fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '12px', lineHeight: '1.6' }}>
                {customQuote}
              </p>
              <button
                onClick={() => copyToClipboard(customQuote)}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.8rem', margin: '0 auto' }}
              >
                {copied ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={14} color="green" /> Copied!
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Copy size={14} /> Copy to Clipboard
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
