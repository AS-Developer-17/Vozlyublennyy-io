import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Smile } from 'lucide-react';

export default function CrushCalculator() {
  const [q1, setQ1] = useState('0');
  const [q2, setQ2] = useState('0');
  const [q3, setQ3] = useState('0');
  const [q4, setQ4] = useState('0');
  const [q5, setQ5] = useState('0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const calculateCrush = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const score = parseInt(q1) + parseInt(q2) + parseInt(q3) + parseInt(q4) + parseInt(q5);
      
      let verdict = '';
      let action = '';
      if (score >= 85) {
        verdict = "They are totally crushing on you! 😍";
        action = "Green light! It's time to send that risky text or ask them to grab coffee. They are waiting for you to make the move!";
      } else if (score >= 60) {
        verdict = "There's definitely mutual interest! 😏";
        action = "You have a solid connection. Keep flirting, stay genuine, and look for opportunities to spend more one-on-one time together.";
      } else if (score >= 35) {
        verdict = "Friendly vibes with potential. 🙂";
        action = "They enjoy your company, but might see you more as a friend right now. Build up the conversational sparks slowly!";
      } else {
        verdict = "Unclear signals. 🔍";
        action = "They might be shy, distracted, or just viewing things platonically. Try to initiate light-hearted chats and see if they open up.";
      }

      setResult({ score, verdict, action });
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
          <span className="tool-emoji">💘</span>
          <h2>Crush Calculator</h2>
          <p>Analyze behavior patterns and discover if your crush is secretly dreaming about you too!</p>
        </div>

        <form onSubmit={calculateCrush} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">1. How often do you lock eyes with your crush?</label>
            <select className="form-select" value={q1} onChange={(e) => setQ1(e.target.value)}>
              <option value="5">All the time, followed by a cute smile</option>
              <option value="20">Quite often, but we both look away shyly</option>
              <option value="15">Occasionally when talking in a group</option>
              <option value="5">Hardly ever/Only when necessary</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. What is their text response speed?</label>
            <select className="form-select" value={q2} onChange={(e) => setQ2(e.target.value)}>
              <option value="20">Within minutes (or instant replies)</option>
              <option value="15">A few hours, but with long/detailed texts</option>
              <option value="10">Replies late, usually short answers</option>
              <option value="5">Leaves me on read or ignores questions</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">3. Do they laugh at your jokes or tease you?</label>
            <select className="form-select" value={q3} onChange={(e) => setQ3(e.target.value)}>
              <option value="20">Absolutely! Even the terrible dad jokes</option>
              <option value="15">Yes, they love playful teasing and banter</option>
              <option value="10">Occasionally, if the joke is actually funny</option>
              <option value="5">No, they are usually very formal or neutral</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">4. Have you hung out outside of work/school?</label>
            <select className="form-select" value={q4} onChange={(e) => setQ4(e.target.value)}>
              <option value="20">Yes, multiple times one-on-one</option>
              <option value="15">Yes, but only in group settings</option>
              <option value="10">We've talked about it but never actually met</option>
              <option value="5">Never, we only see each other in structured places</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">5. How does your crush behave when you're around?</label>
            <select className="form-select" value={q5} onChange={(e) => setQ5(e.target.value)}>
              <option value="20">Lean in, play with their hair, look active and happy</option>
              <option value="15">Friendly, relaxed, and open to conversation</option>
              <option value="10">A bit nervous, fidgety, or quiet</option>
              <option value="5">Uninterested, checking phone constantly</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '12px' }}
          >
            {loading ? 'Evaluating Vibe Check...' : 'Calculate Crush Score 💘'}
          </button>
        </form>

        {result && (
          <div className="result-card">
            <div className="score-display">{result.score}%</div>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '8px' }}>{result.verdict}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>{result.action}</p>
          </div>
        )}
      </div>
    </div>
  );
}
