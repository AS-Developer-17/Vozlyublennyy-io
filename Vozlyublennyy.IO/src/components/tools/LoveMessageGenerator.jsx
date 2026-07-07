import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Copy, Check, Send } from 'lucide-react';
import { getCustomLoveMessage } from '../../services/gemini';

export default function LoveMessageGenerator() {
  const [msgType, setMsgType] = useState('Love Letter');
  const [recipient, setRecipient] = useState('Crush');
  const [tone, setTone] = useState('Romantic');
  const [loading, setLoading] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessageData(null);
    setCopied(false);

    try {
      const result = await getCustomLoveMessage(msgType, recipient, tone);
      setMessageData(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!messageData) return;
    navigator.clipboard.writeText(messageData.text);
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
          <span className="tool-emoji">💝</span>
          <h2>Love Message Generator</h2>
          <p>Instantly generate romantic texts, pickup lines, apology notes, or proposal letters using AI.</p>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">Message Type</label>
            <select className="form-select" value={msgType} onChange={(e) => setMsgType(e.target.value)}>
              <option value="Love Letter">Love Letter</option>
              <option value="Pickup Line">Pickup Line</option>
              <option value="Proposal text">Proposal Text</option>
              <option value="Apology Note">Apology Note</option>
              <option value="Cute Text">Cute Good Morning/Night text</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Recipient</label>
            <select className="form-select" value={recipient} onChange={(e) => setRecipient(e.target.value)}>
              <option value="Crush">My Crush</option>
              <option value="Boyfriend">My Boyfriend</option>
              <option value="Girlfriend">My Girlfriend</option>
              <option value="Husband">My Husband</option>
              <option value="Wife">My Wife</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Tone</label>
            <select className="form-select" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="Romantic">Romantic & Sweet</option>
              <option value="Flirty">Playful & Flirty</option>
              <option value="Deep/Poetic">Deep & Poetic</option>
              <option value="Humorous">Funny & Cute</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Sparkles size={16} className="animate-spin" /> Drafting Message...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Send size={16} /> Compose Message
              </span>
            )}
          </button>
        </form>

        {messageData && (
          <div className="result-card" style={{ textAlign: 'left', marginTop: '32px' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '8px', borderBottom: '1px solid var(--primary-border)', paddingBottom: '8px' }}>
              {messageData.title || "Generated Message"}
            </h3>
            
            <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontStyle: 'italic', margin: '16px 0', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              "{messageData.text}"
            </p>

            {messageData.advice && (
              <div style={{ backgroundColor: 'rgba(255,255,255,0.6)', borderLeft: '3px solid var(--primary)', padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <strong>Tip:</strong> {messageData.advice}
              </div>
            )}

            <button
              onClick={handleCopy}
              className="btn btn-outline"
              style={{ width: '100%', padding: '10px' }}
            >
              {copied ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  <Check size={16} color="green" /> Copied to Clipboard!
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                  <Copy size={16} /> Copy Message
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
