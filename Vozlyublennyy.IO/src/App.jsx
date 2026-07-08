import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';

// Tool Imports
import LoveCalculator from './components/tools/LoveCalculator';
import CrushCalculator from './components/tools/CrushCalculator';
import FlamesGame from './components/tools/FlamesGame';
import DoesMyCrushLikeMe from './components/tools/DoesMyCrushLikeMe';
import LoveQuotes from './components/tools/LoveQuotes';
import NicknameGenerator from './components/tools/NicknameGenerator';
import LoveMessageGenerator from './components/tools/LoveMessageGenerator';
import DateIdeas from './components/tools/DateIdeas';
import ChatNatasha from './components/tools/ChatNatasha';
import NicknameForHimHer from './components/tools/NicknameForHimHer';
import LoveCalculatorDob from './components/tools/LoveCalculatorDob';
import LoveHoroscope from './components/tools/LoveHoroscope';
import FriendshipCalculator from './components/tools/FriendshipCalculator';
import Blog from './components/tools/Blog';
import LoveLanguagesGuide from './components/tools/LoveLanguagesGuide';
import LoveLanguageTest from './components/tools/LoveLanguageTest';
import LoveLanguageQuiz from './components/tools/LoveLanguageQuiz';
import CouplesLoveLanguageTest from './components/tools/CouplesLoveLanguageTest';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/love-calculator" element={<LoveCalculator />} />
          <Route path="/crush-calculator" element={<CrushCalculator />} />
          <Route path="/flames" element={<FlamesGame />} />
          <Route path="/does-crush-like-me" element={<DoesMyCrushLikeMe />} />
          <Route path="/love-quotes" element={<LoveQuotes />} />
          <Route path="/nickname-generator" element={<NicknameGenerator />} />
          <Route path="/love-message-generator" element={<LoveMessageGenerator />} />
          <Route path="/date-ideas" element={<DateIdeas />} />
          <Route path="/chat-natasha" element={<ChatNatasha />} />
          <Route path="/nickname-for-him-her" element={<NicknameForHimHer />} />
          <Route path="/love-calculator-dob" element={<LoveCalculatorDob />} />
          <Route path="/love-horoscope" element={<LoveHoroscope />} />
          <Route path="/friendship-calculator" element={<FriendshipCalculator />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/love-languages-guide" element={<LoveLanguagesGuide />} />
          <Route path="/love-language-test" element={<LoveLanguageTest />} />
          <Route path="/love-language-quiz" element={<LoveLanguageQuiz />} />
          <Route path="/couples-love-language-test" element={<CouplesLoveLanguageTest />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
