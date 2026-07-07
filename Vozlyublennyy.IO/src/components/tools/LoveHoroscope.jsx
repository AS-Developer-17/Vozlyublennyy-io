import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { getCustomHoroscope } from '../../services/gemini';

const ZODIAC_SIGNS = [
  'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋', 'Leo ♌', 'Virgo ♍',
  'Libra ♎', 'Scorpio ♏', 'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
];

export default function LoveHoroscope() {
  const [sign1, setSign1] = useState(ZODIAC_SIGNS[0]);
  const [sign2, setSign2] = useState(ZODIAC_SIGNS[0]);
  const [loading, setLoading] = useState(false);
  const [horoscope, setHoroscope] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHoroscope(null);

    // Extract raw sign names (without emojis)
    const rawSign1 = sign1.split(' ')[0];
    const rawSign2 = sign2.split(' ')[0];

    try {
      const data = await getCustomHoroscope(rawSign1, rawSign2);
      setHoroscope(data);
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
          <span className="tool-emoji">⭐</span>
          <h2>Love Horoscope</h2>
          <p>Check celestial alignment and read an astrological compatibility forecast for your signs.</p>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="form-group">
            <label className="form-label">Your Zodiac Sign</label>
            <select className="form-select" value={sign1} onChange={(e) => setSign1(e.target.value)}>
              {ZODIAC_SIGNS.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Their Zodiac Sign</label>
            <select className="form-select" value={sign2} onChange={(e) => setSign2(e.target.value)}>
              {ZODIAC_SIGNS.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
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
                <Sparkles size={16} className="animate-spin" /> Querying the Cosmos...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <Star size={16} /> Read Astrological Bond
              </span>
            )}
          </button>
        </form>

        {horoscope && (
          <div className="result-card" style={{ textAlign: 'left', marginTop: '32px' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div className="score-display">{horoscope.percentage}%</div>
              <h3 style={{ color: 'var(--primary-dark)' }}>{horoscope.verdict || "Cosmic Sync"}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '4px' }}>
                {sign1} &amp; {sign2}
              </p>
            </div>

            <div style={{ padding: '12px', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 600 }}>
              💡 {horoscope.astrologicalBond}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px', fontSize: '0.9rem' }}>
              <div>
                <strong style={{ color: 'green' }}>✓ Strengths:</strong>
                <ul style={{ paddingLeft: '16px', marginTop: '6px', color: 'var(--text-muted)' }}>
                  {horoscope.strengths?.map((s, idx) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ color: 'var(--primary-dark)' }}>⚠ Challenges:</strong>
                <ul style={{ paddingLeft: '16px', marginTop: '6px', color: 'var(--text-muted)' }}>
                  {horoscope.challenges?.map((c, idx) => <li key={idx}>{c}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--primary-border)', paddingTop: '16px', fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
              <strong>Zodiac Alignment Forecast:</strong>
              <p style={{ marginTop: '8px' }}>{horoscope.forecast}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
