import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertCircle, Heart, Star, Gift, ShieldAlert, Sparkles } from 'lucide-react';

const LANGUAGES = [
  {
    id: 'words',
    title: 'Words of Affirmation 💬',
    desc: 'People with this love language value verbal expressions of love, appreciation, and encouragement. Compliments, sticky-notes, and words of support make them feel valued.',
    dos: [
      'Send unexpected flirty or encouraging texts during the day.',
      'Acknowledge and praise their specific actions ("Thank you for handling dinner, you are so thoughtful").',
      'Leave sticky notes around the house with sweet words.'
    ],
    donts: [
      'Use harsh words or sarcastic criticisms during arguments.',
      'Fail to acknowledge or praise their achievements or efforts.',
      'Offer non-committal or dry replies when they share good news.'
    ]
  },
  {
    id: 'time',
    title: 'Quality Time ⏰',
    desc: 'Undivided attention is key. This means phones are away, eye contact is made, and you are fully present. Shared experiences and deep conversations fuel this language.',
    dos: [
      'Create device-free evenings where you just focus on conversing.',
      'Take regular walks together to check in on each other.',
      'Plan unique activities like cooking classes or road trips together.'
    ],
    donts: [
      'Check your phone constantly while they are speaking.',
      'Cancel plans last-minute without a major emergency.',
      'Sit together in silence without interacting for long periods.'
    ]
  },
  {
    id: 'gifts',
    title: 'Receiving Gifts 🎁',
    desc: 'This language isn\'t about the cost of the gift; it\'s about the thought, effort, and creative details behind it. It serves as a visual symbol of love and memory.',
    dos: [
      'Bring back a small token (like a flower or candy) from your trip.',
      'Keep a list of things they mention they like and gift them unexpectedly.',
      'Focus on wrapping and presentation to show care.'
    ],
    donts: [
      'Forget birthdays, anniversaries, or milestones.',
      'Give thoughtless, generic gifts at the last minute.',
      'Dismiss the gifts they give you or call them clutter.'
    ]
  },
  {
    id: 'service',
    title: 'Acts of Service 🛠️',
    desc: 'Actions speak louder than words. Cooking meals, washing dishes, filling up their gas tank, or taking care of house chores make them feel deeply supported.',
    dos: [
      'Take over tasks they dislike doing (like cleaning or taking out garbage).',
      'Ask: "What can I do to lighten your load today?"',
      'Prepare a cup of coffee or tea for them just the way they like it.'
    ],
    donts: [
      'Fail to follow through on chores you promised to do.',
      'Act lazily or complain when they ask for assistance.',
      'Take their daily household contributions for granted.'
    ]
  },
  {
    id: 'touch',
    title: 'Physical Touch 🤗',
    desc: 'Holding hands, hugging, back rubs, kisses, and general physical closeness offer them deep emotional safety, reassurance, and validation.',
    dos: [
      'Hold hands while walking or sitting together.',
      'Give a long, warm hug when greeting or saying goodbye.',
      'Sit close to each other on the sofa while watching a movie.'
    ],
    donts: [
      'Go days without showing physical affection.',
      'Pull away or reject their physical touches.',
      'Fail to hug them or console them physically when they are crying.'
    ]
  }
];

export default function LoveLanguagesGuide() {
  const [activeTab, setActiveTab] = useState('words');
  const activeLang = LANGUAGES.find(l => l.id === activeTab);

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container">
        <div className="tool-header">
          <span className="tool-emoji">💗</span>
          <h2>Love Languages Guide</h2>
          <p>Explore Dr. Gary Chapman's relationship framework. Understand how to express and receive affection effectively.</p>
        </div>

        {/* Tab Header buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setActiveTab(lang.id)}
              className={`btn ${activeTab === lang.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              {lang.title.split(' ')[0]} {lang.title.split(' ').slice(1).join(' ')}
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        {activeLang && (
          <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <h3 style={{ color: 'var(--primary-dark)', marginBottom: '12px' }}>{activeLang.title}</h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '24px' }}>
              {activeLang.desc}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              <div style={{ border: '2px solid rgba(0, 128, 0, 0.15)', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#f0fff4' }}>
                <h4 style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1rem' }}>
                  <Star size={16} fill="green" /> Do This:
                </h4>
                <ul style={{ paddingLeft: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeLang.dos.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>

              <div style={{ border: '2px solid rgba(219, 39, 119, 0.15)', borderRadius: 'var(--radius-md)', padding: '20px', backgroundColor: '#fff5f7' }}>
                <h4 style={{ color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1rem' }}>
                  <ShieldAlert size={16} fill="var(--primary)" color="#fff" /> Avoid This:
                </h4>
                <ul style={{ paddingLeft: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeLang.donts.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
