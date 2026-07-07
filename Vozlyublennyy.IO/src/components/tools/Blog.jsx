import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, X, Heart } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: "5 Silent Signs Your Crush Likes You (More Than a Friend)",
    readTime: "4 min read",
    category: "Crush Advice",
    summary: "Decoding human signals can be confusing. Look out for these five subtle, subconscious body language cues that reveal they might want to be more than just friends.",
    content: `Decoding human signals can be confusing, especially when your heart is on the line. Often, the biggest clues aren't verbal—they are quiet, subconscious habits.

1. The 'Glance and Look Away' Pattern
Do they frequently lock eyes with you from across a crowded room, only to quickly look down or away when you catch them? This classic sign indicates they are thinking about you but feel too shy to maintain direct eye contact.

2. Subtle Physical Mimicry
When humans feel connected to someone, they naturally mimic their posture or movements. If you lean in, take a sip of your drink, or touch your chin, notice if they replicate the gesture a few seconds later. It is a sign of deep subconscious rapport!

3. Speed of Text Responses
Everyone is busy, but we make time for who we care about. If they reply to your messages quickly or send paragraphs instead of one-word answers, they are signaling that talking to you is a high priority.

4. The Lean-In
Observe their posture during conversations. If they lean in closer, point their feet toward you, or angle their body open, it is an biological invitation indicating they want to be closer.

5. Remembering Small Details
If they remember a minor detail you mentioned in passing weeks ago—like your favorite childhood candy or the name of your first pet—it shows they aren't just hearing you; they are actively storing information because you matter to them.`
  },
  {
    id: 2,
    title: "How to Keep the Spark Alive in a Long-Distance Relationship",
    readTime: "5 min read",
    category: "Couple Growth",
    summary: "Distance can test any couple, but with the right communication models and date setups, your emotional closeness can grow even stronger.",
    content: `Distance can test any couple, but it also creates an opportunity to build a profound emotional and mental bond. Here is how to keep the romance active across the miles:

1. Designate Structured 'Date Nights'
Just because you are apart doesn't mean you can't have a date. Set a regular time, order from the same restaurant style in your respective cities, and watch a movie together on video call. Treat it with the same respect as an in-person meeting!

2. Share Your Daily Mundane Details
Often, distance ruins the feeling of sharing a life. Send photos of the coffee you bought, the weird street art you saw, or a silly joke you heard at work. These small touchpoints keep you woven into each other's daily patterns.

3. Learn Each Other's Love Languages
When physical touch is off the table, understanding how to express Words of Affirmation or send meaningful Gifts becomes crucial. Tailor your remote gestures to what makes your partner feel loved.

4. Establish a Clear End Goal
Long-distance is sustainable when both partners know it is temporary. Keep a shared vision of when you will meet next or when the distance will permanently close. Having a countdown keeps both of you motivated through the quiet weeks.`
  },
  {
    id: 3,
    title: "Understanding Love Languages: The Key to Emotional Harmony",
    readTime: "6 min read",
    category: "Relationship Science",
    summary: "Discovering how you and your partner express and receive affection can resolve misunderstandings and build a deeper sense of security.",
    content: `First introduced by Dr. Gary Chapman, the concept of the 5 Love Languages explains that everyone gives and receives love differently. Misunderstandings happen when we try to speak our own language to a partner who speaks a different one.

1. Words of Affirmation
For these individuals, verbal praise, appreciation, and 'I love you' notes are everything. Harsh words or dismissive remarks hurt them deeply and are difficult to forget.

2. Quality Time
This language is all about undivided attention. No phones, no television—just meaningful conversations, shared experiences, and being fully present with one another.

3. Receiving Gifts
It isn't about materialism; it is about the thought and effort behind the token. A small handpicked flower or a thoughtful book shows them: 'I saw this and thought of you.'

4. Acts of Service
Actions speak louder than words. Washing the dishes, filling up their car's gas tank, or cooking a meal represents deep affection. Broken commitments or laziness can feel like a lack of love.

5. Physical Touch
Holding hands, hugging, kisses, and close physical proximity provide them with emotional security. A lack of physical contact can make them feel isolated and unwanted.`
  }
];

export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container" style={{ maxWidth: '900px' }}>
        <div className="tool-header">
          <span className="tool-emoji">📖</span>
          <h2>Relationship Blog</h2>
          <p>Read expert relationship advice, dating tips, and scientific guides on connection and love.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
          {ARTICLES.map((article) => (
            <div 
              key={article.id} 
              className="card"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => setSelectedArticle(article)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  {article.category}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {article.readTime}
                </span>
              </div>
              <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', marginTop: '8px' }}>{article.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{article.summary}</p>
              <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginTop: '8px' }}>
                Read Article →
              </span>
            </div>
          ))}
        </div>

        {/* Article Reader Modal */}
        {selectedArticle && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }} onClick={() => setSelectedArticle(null)}>
            
            <div 
              style={{
                backgroundColor: '#fff',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '650px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '32px',
                border: '2px solid var(--primary)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedArticle(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={24} />
              </button>

              <span style={{ fontSize: '0.8rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                {selectedArticle.category}
              </span>
              <h2 style={{ color: 'var(--primary-dark)', fontSize: '1.6rem', marginTop: '12px', marginBottom: '8px' }}>
                {selectedArticle.title}
              </h2>
              
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '20px', display: 'flex', gap: '12px' }}>
                <span>{selectedArticle.readTime}</span>
                <span>•</span>
                <span>By возлюбленный.IO Editorial</span>
              </div>

              <div style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {selectedArticle.content}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
