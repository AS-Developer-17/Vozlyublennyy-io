import React from 'react';
import { NavLink } from 'react-router-dom';
import { Heart, Home, Calculator, MessageSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <NavLink to="/" className="navbar-brand">
          <Heart className="heart-icon" fill="#ec4899" color="#ec4899" size={24} />
          <span>возлюбленный.IO</span>
        </NavLink>
        <div className="navbar-menu">
          <NavLink 
            to="/" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            end
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Home size={16} /> Home
            </span>
          </NavLink>
          <NavLink 
            to="/love-calculator" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Calculator size={16} /> Love Calculator
            </span>
          </NavLink>
          <NavLink 
            to="/chat-natasha" 
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} /> Chat
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
