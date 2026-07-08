import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ChevronDown, MessageCircle, Calculator, BookOpen, Star, HelpCircle } from 'lucide-react';
import bannerImg from '../assets/Banner.png';

export default function Home() {
  const [greeting, setGreeting] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) {
      setGreeting('Good Morning');
    } else if (hours >= 12 && hours < 17) {
      setGreeting('Good Afternoon');
    } else if (hours >= 17 && hours < 22) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }
  }, []);

  const loveQuotes = [
    { text: "Love is not about how many days, months, or years you've been together. It's all about how much you love each other every single day.", author: "Anonymous" },
    { text: "To be brave is to love someone unconditionally, without expecting anything in return.", author: "Madonna" },
    { text: "In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.", author: "Maya Angelou" }
  ];

  const subPrograms = [
    { path: '/love-calculator', emoji: '💞', title: 'Love Calculator', desc: 'Calculate your love compatibility with anyone and discover your relationship potential' },
    { path: '/crush-calculator', emoji: '💘', title: 'Crush Calculator', desc: 'Find out if your crush likes you back with our special compatibility calculator' },
    { path: '/flames', emoji: '✨', title: 'FLAMES Game', desc: 'Discover your relationship status with a fun game that reveals your connection' },
    { path: '/does-crush-like-me', emoji: '💭', title: 'Does My Crush Like Me?', desc: 'Take our fun quiz to discover if your crush has feelings for you' },
    { path: '/love-quotes', emoji: '💌', title: 'Love Quotes', desc: "Get inspired with beautiful love quotes that express the feelings words often can't" },
    { path: '/nickname-generator', emoji: '💑', title: 'Couple Nickname Generator', desc: 'Create unique and cute couple names by combining your names together' },
    { path: '/love-message-generator', emoji: '💝', title: 'Love Message Generator', desc: 'Generate romantic messages, pickup lines, and proposal texts instantly' },
    { path: '/date-ideas', emoji: '🎭', title: 'Date Ideas Generator', desc: 'Get creative and romantic date ideas perfect for any occasion or budget' },
    { path: '/chat-natasha', emoji: '✨', title: 'Chat with Natasha', desc: 'Talk through crushes, texting, and relationship questions with your AI friend' },
    { path: '/nickname-for-him-her', emoji: '💝', title: 'Nickname for Him/Her', desc: 'Generate 10 sweet, funny, or romantic nicknames for your boyfriend or girlfriend.' },
    { path: '/love-calculator-dob', emoji: '📅', title: 'Love Calculator by DOB', desc: 'Discover compatibility using birth dates and numerology principles' },
    { path: '/love-horoscope', emoji: '⭐', title: 'Love Horoscope', desc: 'Check zodiac compatibility and discover astrological love insights' },
    { path: '/friendship-calculator', emoji: '🤝', title: 'Friendship Calculator', desc: 'Calculate friendship compatibility and discover your bond as friends' },
    { path: '/blog', emoji: '📖', title: 'Blog', desc: 'Read relationship tips, love advice, and inspiring stories from our community' },
    { path: '/love-languages-guide', emoji: '💗', title: 'Love Languages Guide', desc: 'Explore the five love languages and understand how you and your partner express affection' },
    { path: '/love-language-test', emoji: '📝', title: 'Love Language Test', desc: 'Discover your primary love language and learn how you prefer to give and receive love' },
    { path: '/love-language-quiz', emoji: '🧩', title: 'Love Language Quiz', desc: 'Take a quick quiz to find out which love language resonates most with you' },
    { path: '/couples-love-language-test', emoji: '💑', title: 'Couples Love Language Test', desc: 'Take the love language test together as a couple and strengthen your relationship' }
  ];

  const faqs = [
    { q: "How do the name and date-of-birth calculators work?", a: "The Love Calculator by Name compares the patterns, letters, and vowels in your names using a custom character matching algorithm, while the DOB calculator uses numerology principles to calculate your Life Path Numbers and evaluate their structural compatibility." },
    { q: "Who is Natasha and how does she help me?", a: "Natasha is your friendly AI relationship assistant, powered by the Gemini backend. She is trained to offer warm, empathetic, and constructive advice regarding texting, crushes, dating etiquette, and general relationship growth. Feel free to ask her anything!" },
    { q: "What is the FLAMES game?", a: "FLAMES is a classic relationship game. By matching and cancelling common letters between two names, the remaining letters determine the outcome among: Friends, Lovers, Affectionate, Marriage, Enemies, or Siblings. It's a nostalgic and fun way to check your status!" },
    { q: "Are my chat conversations and quiz answers saved?", a: "No, your privacy is our top priority. All quiz answers and chat sessions are processed live and stored in local component state. Once you refresh or close the page, the data is cleared." },
    { q: "How does the Couples Love Language Test work?", a: "It enables both you and your partner to evaluate your preferences across Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, and Physical Touch. It then charts your scores side-by-side to highlight where your needs align or differ, offering suggestions for communication." }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="container" style={{ paddingBottom: '64px' }}>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="banner-img-container">
          <img src={bannerImg} alt="Vozlyublennyy Banner" className="banner-img" />
        </div>
        <div className="welcome-subtitle">This is the Homepage of the program</div>
        <h2 className="greeting-text">
          {greeting}, Lovebirds! 💖
        </h2>
        <p className="timing-expression">
          How would you like to express your love today?
        </p>
        
        {/* Three Love Quotes Card Section */}
        <div className="quote-row">
          {loveQuotes.map((q, idx) => (
            <div key={idx} className="quote-card">
              <p>"{q.text}"</p>
              <span>— {q.author}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2nd Section: Grid of 18 Sub-Programs */}
      <div style={{ marginBottom: '64px' }}>
        <h2 className="section-title">Explore Love & Compatibility Tools</h2>
        <p className="section-desc">Select any of our relationship checkers, tests, games, or AI assistants below to begin your journey.</p>
        <div className="grid grid-3">
          {subPrograms.map((p, idx) => (
            <Link to={p.path} key={idx} className="card" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{p.emoji}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)' }}>{p.title}</h3>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.4', margin: 0 }}>{p.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 3rd Section: About paragraph */}
      <div style={{ backgroundColor: 'var(--bg-tertiary)', border: '2px solid var(--primary-border)', borderRadius: 'var(--radius-lg)', padding: '40px', marginBottom: '64px', textAlign: 'center' }}>
        <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Love & Relationship Tools in One Place</h2>
        <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
          возлюбленный.IO brings together a comprehensive suite of romantic checkers, astrology matching, communication guidebooks, and state-of-the-art artificial intelligence. Whether you are looking for a fun calculation like the FLAMES game, want to understand your primary communication style using our Love Language Quiz, need inspiration for the perfect evening with our Date Ideas Generator, or seek personal advice from Natasha, our AI relationship counselor—we have designed every tool to help you reflect, connect, and nurture your romantic world.
        </p>
      </div>

      {/* 4th Section: FAQs Accordion */}
      <div className="faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-desc">Have questions about how our assessments or AI helper work? Find the answers below.</p>
        <div className="accordion">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`accordion-item ${activeFaq === idx ? 'active' : ''}`}>
              <div className="accordion-header" onClick={() => toggleFaq(idx)}>
                <span className="accordion-title">{faq.q}</span>
                <ChevronDown size={18} className="accordion-icon" style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'rotate(0)' }} />
              </div>
              <div className="accordion-content">
                <div className="accordion-body">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
