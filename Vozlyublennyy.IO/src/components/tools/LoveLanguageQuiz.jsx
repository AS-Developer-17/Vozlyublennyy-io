import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { evaluateScenarioLoveLanguage } from '../../services/gemini';

export default function LoveLanguageQuiz() {
  const [q1, setQ1] = useState('Having coffee and chatting about deep topics');
  const [q2, setQ2] = useState('Washing the car or making breakfast for me');
  const [q3, setQ3] = useState('Getting a souvenir from a trip, even if small');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const answers = {
      sundayPreference: q1,
      helpfulActPreference: q2,
      thoughtfulGiftPreference: q3
    };

    try {
      const evaluation = await evaluateScenarioLoveLanguage(answers);
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
          <span className="tool-emoji">🧩</span>
          <h2>Love Language Quiz</h2>
          <p>Take this quick, scenario-driven test evaluated by our Gemini AI system to check your primary love language.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">1. In an ideal Sunday morning, you would prefer:</label>
            <select className="form-select" value={q1} onChange={(e) => setQ1(e.target.value)}>
              <option value="Having coffee and chatting about deep topics">Having coffee and chatting about deep topics</option>
              <option value="Cuddling in bed watching the morning light">Cuddling in bed watching the morning light</option>
              <option value="Having breakfast cooked and clean-up done by my partner">Having breakfast cooked and clean-up done by my partner</option>
              <option value="Receiving a surprise flower bouquet or coffee delivery">Receiving a surprise flower bouquet or coffee delivery</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">2. If your partner wants to ease your stress, you prefer they:</label>
            <select className="form-select" value={q2} onChange={(e) => setQ2(e.target.value)}>
              <option value="Washing the car or making breakfast for me">Wash the dishes or take out the garbage</option>
              <option value="Saying 'I am so proud of how hard you are working'">Say: "I'm so proud of how hard you are working"</option>
              <option value="Giving me a long hug and holding me close">Give me a long hug and hold me close</option>
              <option value="Planning a quiet dinner together outside">Plan a quiet, phone-free dinner outside</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">3. What kind of souvenir makes you feel happiest?</label>
            <select className="form-select" value={q3} onChange={(e) => setQ3(e.target.value)}>
              <option value="Getting a souvenir from a trip, even if small">A handpicked shell or post-card from their trip</option>
              <option value="Hearing them say they missed me every hour">A handwritten love letter detail</option>
              <option value="Planning a full day together as soon as they return">A planned weekend trip as soon as they return</option>
              <option value="Cuddling together immediately at the gate">A warm embrace at the airport terminal</option>
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
                <Sparkles size={16} className="animate-spin" /> Evaluating Responses...
              </span>
            ) : "Calculate Love Language 🧩"}
          </button>
        </form>

        {result && (
          <div className="result-card" style={{ textAlign: 'left', marginTop: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Heart size={44} fill="var(--primary)" color="var(--primary)" style={{ margin: '0 auto 10px', display: 'block' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 600 }}>PRIMARY LOVE LANGUAGE</div>
              <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.8rem', marginTop: '4px' }}>{result.primary}</h3>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '20px', borderTop: '1px solid var(--primary-border)', paddingTop: '20px' }}>
              {result.explanation}
            </p>

            {/* Percentages breakdown */}
            {result.breakdown && (
              <div style={{ marginBottom: '20px' }}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Distribution Breakdown:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  {Object.entries(result.breakdown).map(([lang, pct]) => (
                    <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.85rem', width: '150px', whiteSpace: 'nowrap' }}>{lang}</span>
                      <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: lang === result.primary ? 'var(--primary)' : 'var(--primary-border)' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, width: '35px', textAlign: 'right' }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.actionableTips && result.actionableTips.length > 0 && (
              <div style={{ borderTop: '1px solid var(--primary-border)', paddingTop: '16px' }}>
                <strong>How to speak your language:</strong>
                <ul style={{ paddingLeft: '20px', marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {result.actionableTips.map((tip, idx) => (
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
