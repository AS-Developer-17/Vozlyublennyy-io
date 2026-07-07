import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Heart size={20} fill="#ec4899" color="#ec4899" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }} />
              возлюбленный.IO
            </div>
            <p style={{ fontSize: '0.95rem', maxWidth: '300px' }}>
              Your ultimate digital space for relationship advice, love calculators, relationship guides, and AI coaching. Discover your potential and strengthen your bonds.
            </p>
          </div>
          
          <div>
            <div className="footer-link-title">Calculators & Games</div>
            <div className="footer-links">
              <Link to="/love-calculator" className="footer-link-item">Love Calculator</Link>
              <Link to="/crush-calculator" className="footer-link-item">Crush Calculator</Link>
              <Link to="/flames" className="footer-link-item">FLAMES Game</Link>
              <Link to="/friendship-calculator" className="footer-link-item">Friendship Calculator</Link>
            </div>
          </div>

          <div>
            <div className="footer-link-title">AI Advisors & Tests</div>
            <div className="footer-links">
              <Link to="/chat-natasha" className="footer-link-item">Chat with Natasha</Link>
              <Link to="/does-crush-like-me" className="footer-link-item">Does My Crush Like Me?</Link>
              <Link to="/love-language-test" className="footer-link-item">Love Language Test</Link>
              <Link to="/love-horoscope" className="footer-link-item">Love Horoscope</Link>
            </div>
          </div>

          <div>
            <div className="footer-link-title">Guides & Nicknames</div>
            <div className="footer-links">
              <Link to="/love-languages-guide" className="footer-link-item">Love Languages Guide</Link>
              <Link to="/nickname-generator" className="footer-link-item">Nickname Generator</Link>
              <Link to="/date-ideas" className="footer-link-item">Date Ideas Generator</Link>
              <Link to="/blog" className="footer-link-item">Love & Dating Blog</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} возлюбленный.IO. Made with <Heart size={14} fill="#ec4899" color="#ec4899" style={{ display: 'inline-block', verticalAlign: 'middle' }} /> for better relationships.
          </div>
          <div style={{ display: 'flex', gap: '16px', color: 'var(--text-light)', fontSize: '0.85rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={14} /> AI guidance is for entertainment purposes only
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
