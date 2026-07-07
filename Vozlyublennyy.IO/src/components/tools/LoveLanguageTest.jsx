import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';

const QUESTIONS = [
  {
    q: "You've had a stressful week. What makes you feel most supported by your partner?",
    options: [
      { text: "They give me a back massage and cuddle with me.", lang: "Physical Touch" },
      { text: "They wash the dishes and do the laundry so I can rest.", lang: "Acts of Service" }
    ]
  },
  {
    q: "It's your birthday. What is the ideal gesture from your partner?",
    options: [
      { text: "They hand me a highly thoughtful, beautifully wrapped book I've been eyeing.", lang: "Receiving Gifts" },
      { text: "They plan a full device-free day out together in the city.", lang: "Quality Time" }
    ]
  },
  {
    q: "Your partner wants to show appreciation. You'd prefer to hear/receive:",
    options: [
      { text: "They tell me face-to-face: 'I love you so much and appreciate having you in my life.'", lang: "Words of Affirmation" },
      { text: "They surprise me by fixing the broken cabinet in the kitchen.", lang: "Acts of Service" }
    ]
  },
  {
    q: "When hanging out at home in the evening, what makes you feel closest?",
    options: [
      { text: "Sitting side-by-side on the couch, holding hands or leaning in.", lang: "Physical Touch" },
      { text: "Having a deep conversation about our childhoods and plans.", lang: "Quality Time" }
    ]
  },
  {
    q: "You are away on a work trip. What touchpoint makes you smile?",
    options: [
      { text: "They send me a card or souvenir they found while I was gone.", lang: "Receiving Gifts" },
      { text: "They call me on video just to check in and chat.", lang: "Quality Time" }
    ]
  },
  {
    q: "Which comment from your partner makes your heart melt?",
    options: [
      { text: "'You did an amazing job on that project, I'm so proud of you.'", lang: "Words of Affirmation" },
      { text: "'I filled up your car's gas tank since I knew you had a busy morning.'", lang: "Acts of Service" }
    ]
  },
  {
    q: "If your partner has to go out for a while, you love when they:",
    options: [
      { text: "Give me a long, warm forehead kiss before leaving.", lang: "Physical Touch" },
      { text: "Bring back my favorite iced tea from the cafe.", lang: "Receiving Gifts" }
    ]
  },
  {
    q: "A perfect date night is:",
    options: [
      { text: "Strolling in the park, talking for hours without distractions.", lang: "Quality Time" },
      { text: "Hearing them tell me why they fell in love with me.", lang: "Words of Affirmation" }
    ]
  },
  {
    q: "Nothing says 'I love you' like:",
    options: [
      { text: "A small, unexpected gift just to say they were thinking of me.", lang: "Receiving Gifts" },
      { text: "Them hugging me from behind while I'm preparing coffee.", lang: "Physical Touch" }
    ]
  },
  {
    q: "You feel most loved when your partner:",
    options: [
      { text: "Helps me clean up the kitchen after a dinner party.", lang: "Acts of Service" },
      { text: "Sends me a long paragraph about how happy I make them.", lang: "Words of Affirmation" }
    ]
  }
];

export default function LoveLanguageTest() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const selectOption = (lang) => {
    const nextAnswers = [...answers, lang];
    setAnswers(nextAnswers);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      // Calculate scores
      const counts = {
        "Words of Affirmation": 0,
        "Quality Time": 0,
        "Receiving Gifts": 0,
        "Acts of Service": 0,
        "Physical Touch": 0
      };

      nextAnswers.forEach(item => {
        counts[item] = (counts[item] || 0) + 1;
      });

      const total = nextAnswers.length;
      const breakdown = {};
      let maxScore = -1;
      let primary = '';

      Object.keys(counts).forEach(key => {
        const percent = Math.round((counts[key] / total) * 100);
        breakdown[key] = percent;
        if (percent > maxScore) {
          maxScore = percent;
          primary = key;
        }
      });

      setResult({ breakdown, primary });
    }
  };

  const restartTest = () => {
    setCurrentIdx(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">📝</span>
          <h2>Love Language Test</h2>
          <p>Answer 10 situational scenarios to determine your primary styles of giving and receiving love.</p>
        </div>

        {!result ? (
          <div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--primary-light)', borderRadius: '3px', marginBottom: '24px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${((currentIdx) / QUESTIONS.length) * 100}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--primary)', 
                  transition: 'width 0.3s ease' 
                }} 
              />
            </div>
            
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: '8px' }}>
              QUESTION {currentIdx + 1} OF {QUESTIONS.length}
            </p>
            
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '24px', lineHeight: '1.4' }}>
              {QUESTIONS[currentIdx].q}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {QUESTIONS[currentIdx].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => selectOption(opt.lang)}
                  className="btn btn-outline"
                  style={{ width: '100%', textAlign: 'left', padding: '16px 20px', display: 'block', height: 'auto', fontWeight: '500' }}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Heart size={48} fill="var(--primary)" color="var(--primary)" style={{ margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)' }}>Your Primary Love Language is:</h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '8px' }}>
                {result.primary}
              </div>
            </div>

            {/* Score Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              {Object.entries(result.breakdown).map(([lang, percent]) => (
                <div key={lang}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span>{lang}</span>
                    <span>{percent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '14px', backgroundColor: 'var(--bg-secondary)', borderRadius: '7px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${percent}%`, 
                        height: '100%', 
                        backgroundColor: lang === result.primary ? 'var(--primary)' : 'var(--primary-border)',
                        borderRadius: '7px' 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <button onClick={restartTest} className="btn btn-primary" style={{ width: '100%' }}>
              Take Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
