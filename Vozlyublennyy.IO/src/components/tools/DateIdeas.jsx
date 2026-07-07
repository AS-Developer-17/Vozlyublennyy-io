import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, MapPin, DollarSign, Calendar } from 'lucide-react';
import { getCustomDateIdeas } from '../../services/gemini';

export default function DateIdeas() {
  const [budget, setBudget] = useState('Free');
  const [vibe, setVibe] = useState('Cozy/Indoor');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState([]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIdeas([]);

    try {
      const results = await getCustomDateIdeas(budget, vibe);
      setIdeas(results);
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
          <span className="tool-emoji">🎭</span>
          <h2>Date Ideas Generator</h2>
          <p>Get creative, custom date recommendations matching your budget and desired energy.</p>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">Available Budget</label>
            <select className="form-select" value={budget} onChange={(e) => setBudget(e.target.value)}>
              <option value="Free">Totally Free / Zero Budget 🌿</option>
              <option value="Under $20">Under $20 / Budget-friendly ☕</option>
              <option value="Moderate">Moderate / Dinner & Activity 🍿</option>
              <option value="Luxury/Splurge">Luxury / Splurge-worthy 🌹</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Date Vibe</label>
            <select className="form-select" value={vibe} onChange={(e) => setVibe(e.target.value)}>
              <option value="Cozy/Indoor">Cozy & Quiet (Indoor) ☕</option>
              <option value="Outdoors/Active">Outdoors & Active (Nature) 🥾</option>
              <option value="Artistic/Creative">Artistic, Museum, or Creative 🎨</option>
              <option value="Foodie">Foodie Adventure 🍜</option>
              <option value="Adventurous">Thrills & Novel Adventures 🎡</option>
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
                <Sparkles size={16} className="animate-spin" /> Gathering Romantic Plans...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Calendar size={16} /> Generate Date Ideas
              </span>
            )}
          </button>
        </form>

        {ideas.length > 0 && (
          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ color: 'var(--primary-dark)', textAlign: 'center', marginBottom: '8px' }}>Your Customized Itineraries</h3>
            
            {ideas.map((idea, idx) => (
              <div 
                key={idx} 
                className="card" 
                style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--primary-border)', padding: '24px', position: 'relative' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ color: 'var(--primary-dark)', fontSize: '1.15rem' }}>{idea.title}</h4>
                  <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    Est: {idea.costEstimation}
                  </span>
                </div>
                
                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginTop: '10px', lineHeight: '1.5' }}>
                  {idea.description}
                </p>

                {idea.proTip && (
                  <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-muted)', borderTop: '1px dashed var(--primary-border)', paddingTop: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong>Pro-Tip:</strong> {idea.proTip}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
