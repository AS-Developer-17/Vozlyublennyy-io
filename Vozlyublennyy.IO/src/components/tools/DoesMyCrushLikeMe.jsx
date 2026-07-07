import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowLeft, Sparkles, MessageSquare, Compass, Send } from 'lucide-react';
import { analyzeCrushCrush } from '../../services/gemini';

export default function DoesMyCrushLikeMe() {
  const [crushName, setCrushName] = useState('');
  const [howMet, setHowMet] = useState('School/College');
  const [eyeContact, setEyeContact] = useState('Avoids eye contact but glances');
  const [replySpeed, setReplySpeed] = useState('Takes several hours');
  const [extraDetails, setExtraDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!crushName.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    const answers = {
      crushName,
      howMet,
      eyeContact,
      replySpeed,
      behaviorDescription: extraDetails
    };

    try {
      const evaluation = await analyzeCrushCrush(answers);
      setResult(evaluation);
    } catch (err) {
      setError("We encountered an issue reading the vibes. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page container">
      <RouterLink to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </RouterLink>

      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">💭</span>
          <h2>Does My Crush Like Me?</h2>
          <p>Describe your crush's behavior and let our Gemini Relationship Engine perform a detailed diagnostic.</p>
        </div>

        <form onSubmit={handleEvaluate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">What is their name?</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Crush's name..."
              value={crushName}
              onChange={(e) => setCrushName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">How do you usually interact?</label>
            <select className="form-select" value={howMet} onChange={(e) => setHowMet(e.target.value)}>
              <option value="School/College">School, College, or Classes</option>
              <option value="Workplace">At work / Professional setting</option>
              <option value="Online/Social Media">Online, Dating Apps, or Instagram</option>
              <option value="Mutual Friends">Through mutual friends / parties</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">What is their eye contact style when you are near?</label>
            <select className="form-select" value={eyeContact} onChange={(e) => setEyeContact(e.target.value)}>
              <option value="Direct lock & smile">Intense eye contact and a warm smile</option>
              <option value="Avoids eye contact but glances">Shyly avoids direct look but constantly glances</option>
              <option value="Casual & friendly">Normal, comfortable eye contact</option>
              <option value="Doesn't look">Rarely looks, seems distracted</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">How fast do they reply to your text messages?</label>
            <select className="form-select" value={replySpeed} onChange={(e) => setReplySpeed(e.target.value)}>
              <option value="Within minutes">Instantly or within a few minutes</option>
              <option value="Within an hour">Within an hour, keeping chat going</option>
              <option value="Takes several hours">Takes several hours but replies thoughtfully</option>
              <option value="Days later / Never">Replies days later or ignores completely</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Describe a recent interaction or any unique behavior (optional)</label>
            <textarea 
              className="form-input"
              rows="3"
              placeholder="e.g., They offered me their jacket when it was cold, or they laughed really hard when I tripped..."
              value={extraDetails}
              onChange={(e) => setExtraDetails(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {error && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !crushName.trim()}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <Sparkles size={18} className="animate-spin" /> Natasha is analyzing the signals...
              </span>
            ) : "Submit and Analyze Signals 💭"}
          </button>
        </form>

        {result && (
          <div className="result-card" style={{ textAlign: 'left', marginTop: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="score-display">{result.score}%</div>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.4rem' }}>{result.summary}</h3>
            </div>
            
            <div style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '20px', borderTop: '1px solid var(--primary-border)', paddingTop: '20px' }}>
              <strong>AI Relationship Analysis:</strong>
              <p style={{ marginTop: '8px', whiteSpace: 'pre-line' }}>{result.analysis}</p>
            </div>

            {result.tips && result.tips.length > 0 && (
              <div style={{ borderTop: '1px solid var(--primary-border)', paddingTop: '16px' }}>
                <strong>Recommended Next Steps:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--text-muted)' }}>
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
