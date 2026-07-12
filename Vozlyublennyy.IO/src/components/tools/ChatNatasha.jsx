import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Sparkles, User, Heart } from 'lucide-react';
import { chatWithNatasha } from '../../services/gemini';

export default function ChatNatasha() {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Hi there! I'm Natasha, your personal relationship companion. Whether you're decoding a crush's text, preparing for a date, or looking to communicate better in your relationship, I'm here to listen and help. What's on your heart today? 💕"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const historyEndRef = useRef(null);

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Send message history + new message to Gemini
      const response = await chatWithNatasha(messages, userMsg);
      setMessages(prev => [...prev, { sender: 'assistant', text: response }]);
    } catch {
      setMessages(prev => [...prev, { 
        sender: 'assistant', 
        text: "I experienced a little trouble hearing you, but I'm still here. Could you repeat that? 🌸" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page container">
      <Link to="/" className="tool-back">
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="tool-container" style={{ maxWidth: '850px' }}>
        <div className="tool-header" style={{ marginBottom: '24px' }}>
          <span className="tool-emoji">✨</span>
          <h2>Chat with Natasha</h2>
          <p>Talk through texting dilemmas, crush signals, and relationship advice with your supportive AI partner.</p>
        </div>

        <div className="chat-container">
          <div className="chat-history">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`chat-message ${msg.sender === 'user' ? 'message-user' : 'message-assistant'}`}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.8rem', marginBottom: '4px', opacity: 0.8 }}>
                  {msg.sender === 'user' ? (
                    <>You <User size={12} /></>
                  ) : (
                    <>Natasha <Heart size={12} fill="var(--primary)" color="var(--primary)" /></>
                  )}
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{msg.text}</div>
              </div>
            ))}
            
            {loading && (
              <div className="chat-message message-assistant" style={{ alignSelf: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.8rem', marginBottom: '4px', opacity: 0.8 }}>
                  Natasha <Sparkles size={12} className="animate-spin" />
                </div>
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={historyEndRef} />
          </div>

          <form onSubmit={handleSend} className="chat-input-area">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask Natasha for relationship advice..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '12px' }}
              disabled={loading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
