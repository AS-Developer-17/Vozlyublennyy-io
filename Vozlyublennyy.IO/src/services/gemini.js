// Gemini API Service wrapper for возлюбленный.IO

const getApiKey = (type) => {
  if (type === 'quiz') {
    return import.meta.env.VITE_GEMINI_KEY_QUIZ;
  }
  return import.meta.env.VITE_GEMINI_KEY_CHAT;
};

/**
 * Standard fetch call to Gemini 1.5 Flash API
 */
export const askGemini = async (prompt, type = 'chat') => {
  const key = getApiKey(type);
  if (!key) {
    console.error(`Gemini API Key for type "${type}" is missing in .env!`);
    throw new Error(`API key configuration missing. Please verify your environment variables.`);
  }

  // Use gemini-1.5-flash as it is highly efficient and compatible
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error status:", response.status, errorData);
      throw new Error(errorData.error?.message || `Gemini API responded with status ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error("Empty response received from AI model.");
    }

    return generatedText;
  } catch (error) {
    console.error("Error in askGemini:", error);
    throw error;
  }
};

/**
 * Helper to parse JSON from AI response block (markdown ```json ... ```)
 */
export const parseJsonResponse = (text, fallback) => {
  try {
    // Remove markdown code fences if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.warn("Failed to parse JSON response, attempting regex cleanup...", e);
    try {
      // Fallback regex match for anything between curly braces
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (e2) {
      console.error("Final parse attempt failed:", e2);
    }
    return fallback;
  }
};

// ----------------------------------------------------
// Specific Tool Integration Helpers
// ----------------------------------------------------

/**
 * Does My Crush Like Me?
 */
export const analyzeCrushCrush = async (answers) => {
  const prompt = `You are a professional relationship advisor. Based on these answers to a crush quiz:
${JSON.stringify(answers, null, 2)}

Provide a detailed relationship analysis. Return a JSON object with this exact structure:
{
  "score": (a number between 0 and 100 representing the likelihood that the crush likes them),
  "summary": "a short headline summary (e.g. 'Strong Spark Detected!')",
  "analysis": "a 2-3 paragraph insightful, warm, and honest relationship analysis addressing their answers",
  "tips": ["tip 1", "tip 2", "tip 3"]
}
Ensure the response is valid JSON and only valid JSON. Do not write any conversational text outside the JSON.`;

  try {
    const raw = await askGemini(prompt, 'quiz');
    return parseJsonResponse(raw, {
      score: 50,
      summary: "Mixed Signals",
      analysis: "It seems like there's a connection, but some signals might be crossed. Take things step-by-step and pay attention to how they interact with you one-on-one.",
      tips: ["Try initiating a low-pressure conversation", "Observe their body language when you walk into the room", "Suggest hanging out in a group first"]
    });
  } catch (err) {
    // Mock fallback
    return {
      score: Math.floor(Math.random() * 40) + 40,
      summary: "A Hopeful Connection",
      analysis: "Based on the vibes, there's definitely potential here! They seem to notice you, and while it's too early to declare total love, initiating light and friendly interactions is a great way to let things blossom.",
      tips: ["Smile and make eye contact", "Ask them about their favorite hobbies", "Keep text conversations light and fun"]
    };
  }
};

/**
 * Chat with Natasha AI chatbot
 */
export const chatWithNatasha = async (chatHistory, userMessage) => {
  // Format history for context
  const historyText = chatHistory
    .map(msg => `${msg.sender === 'user' ? 'User' : 'Natasha'}: ${msg.text}`)
    .join('\n');

  const prompt = `You are Natasha, a warm, wise, and empathetic AI relationship advisor. You talk through crushes, texting, dating, and relationship questions.
You are friendly, modern, compassionate, and wise. Avoid giving generic answers. Try to give practical, encouraging, and emotionally intelligent feedback.

Here is the conversation history:
${historyText}
User: ${userMessage}

Natasha:`;

  try {
    return await askGemini(prompt, 'chat');
  } catch (err) {
    return "I'm so sorry, I had a little hiccup connecting to my thoughts. But I'm here for you! Tell me more about what's on your mind, and let's work through it together. 💕";
  }
};

/**
 * Generate Love Quotes
 */
export const getCustomLoveQuote = async (category) => {
  const prompt = `Generate a beautiful, original, and deeply moving love quote for the category: "${category}". 
Return ONLY the quote itself inside quotes, followed by a new line and the author designation (either "Anonymous" or a creative pen name, e.g., "- A Whisper of Love"). Do not write any introduction or summary.`;

  try {
    return await askGemini(prompt, 'chat');
  } catch (err) {
    const defaults = {
      romantic: `"In the arithmetic of love, one plus one equals everything, and two minus one equals nothing."\n- Mignon McLaughlin`,
      sad: `"The hottest love has the coldest end."\n- Socrates`,
      inspirational: `"We are most alive when we're in love."\n- John Updike`
    };
    return defaults[category] || `"To love and be loved is to feel the sun from both sides."\n- David Viscott`;
  }
};

/**
 * Nickname Generator
 */
export const getCustomNicknames = async (name1, name2) => {
  const prompt = `Create unique, cute, and romantic couple nicknames by blending the names: "${name1}" and "${name2}".
Return a JSON array of 5 nickname objects, each containing:
{
  "nickname": "the blended nickname",
  "vibe": "the vibe (e.g. 'Cute', 'Playful', 'Sweet', 'Modern')",
  "explanation": "a short 1-sentence explanation of why it works"
}
Ensure the response is valid JSON and only valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'chat');
    return parseJsonResponse(raw, [
      { nickname: `${name1.substring(0, 3)}${name2.substring(name2.length - 3)}`, vibe: "Sweet", explanation: "A classic blend of your names that rolls off the tongue beautifully." }
    ]);
  } catch (err) {
    // Generate some procedural ones
    const blend1 = name1.substring(0, Math.ceil(name1.length / 2)) + name2.substring(Math.floor(name2.length / 2));
    const blend2 = name2.substring(0, Math.ceil(name2.length / 2)) + name1.substring(Math.floor(name1.length / 2));
    return [
      { nickname: blend1, vibe: "Romantic", explanation: "A perfect blend fusing the beginning of one with the end of the other." },
      { nickname: blend2, vibe: "Cute", explanation: "A sweet combination blending your names in reverse harmony." },
      { nickname: `${name1} & Co.`, vibe: "Playful", explanation: "A fun way of showing you two are a team." },
      { nickname: `The ${name1[0]}${name2[0]}s`, vibe: "Modern", explanation: "Using your initials to create a cool duo name." },
      { nickname: `Lovebirds`, vibe: "Classic", explanation: "An adorable, timeless title for you both." }
    ];
  }
};

/**
 * Love Message Generator
 */
export const getCustomLoveMessage = async (type, recipient, tone) => {
  const prompt = `You are a romantic writer. Generate a short, highly compelling message based on:
- Type: ${type} (e.g., "Love Letter", "Pickup Line", "Proposal text", "Apology Text", "Cute Good Morning message")
- Recipient: ${recipient} (e.g., "Crush", "Boyfriend", "Girlfriend", "Husband", "Wife")
- Tone: ${tone} (e.g., "Romantic", "Playful/Flirty", "Deep/Poetic", "Humorous")

Return a JSON object:
{
  "title": "A title for this message",
  "text": "The generated text (make it copy-paste ready, emotive, and around 2-5 sentences or standard letter length)",
  "advice": "A short, helpful tip on how to deliver this message (e.g., 'Text this in the morning' or 'Say it in person with a smile')"
}
Return ONLY valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'chat');
    return parseJsonResponse(raw, {
      title: "Romantic Note",
      text: `Every day I spend with you becomes my new favorite day. You have this beautiful way of bringing light into my world, and I just wanted to remind you how much you mean to me.`,
      advice: "Send this unexpectedly during their lunch break to brighten their day!"
    });
  } catch (err) {
    return {
      title: "Heartfelt Message",
      text: `Just wanted to send a little reminder that you are on my mind and in my heart. Thank you for being the amazing person you are.`,
      advice: "Send this with a cute heart emoji to let them know they are special to you."
    };
  }
};

/**
 * Date Ideas Generator
 */
export const getCustomDateIdeas = async (budget, vibe) => {
  const prompt = `Generate 3 creative, romantic, and memorable date ideas based on:
- Budget: ${budget} (e.g., "Free", "Under $20", "Moderate", "Luxury/Splurge")
- Vibe: ${vibe} (e.g., "Cozy/Indoor", "Outdoors/Active", "Artistic/Creative", "Foodie", "Adventurous")

Return a JSON array of exactly 3 objects:
{
  "title": "Date Title",
  "description": "Step-by-step description of what to do (2-3 sentences)",
  "costEstimation": "A short note on estimated cost",
  "proTip": "A little extra tip to make the date even more romantic or successful"
}
Return ONLY valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'chat');
    return parseJsonResponse(raw, [
      { title: "Blanket Fort Movie Night", description: "Build an epic blanket fort with fairy lights, pop some popcorn, and queue up your favorite childhood films.", costEstimation: "Free", proTip: "Write handwritten 'tickets' for the fort and hand them to your partner." }
    ]);
  } catch (err) {
    return [
      { title: "Scenic Sunset Picnic", description: "Pack simple homemade sandwiches, a warm blanket, and head to a local hill, beach, or rooftop to watch the sunset together.", costEstimation: "Very Cheap", proTip: "Bring a small bluetooth speaker and play a soft acoustic playlist." },
      { title: "Art Gallery Exploration", description: "Visit a local public gallery or museum. Walk around, pick your favorite art pieces, and make up funny backstories for them.", costEstimation: "Free / Donation", proTip: "Afterwards, grab a coffee and sketch portraits of each other on napkins." },
      { title: "Cozy Cooking Duel", description: "Choose a recipe you've never tried before. Head to the store, grab ingredients, and prepare it together while enjoying a favorite drink.", costEstimation: "Moderate", proTip: "Turn it into a mock cooking show and rate each other's kitchen performance!" }
    ];
  }
};

/**
 * Love Horoscope
 */
export const getCustomHoroscope = async (sign1, sign2) => {
  const prompt = `As a relationship astrologer, analyze the zodiac compatibility between:
- Partner 1: ${sign1}
- Partner 2: ${sign2}

Return a JSON object:
{
  "percentage": (a number between 30 and 100),
  "verdict": "A brief compatibility title (e.g. 'Starlit Harmony', 'Fiery Passion')",
  "astrologicalBond": "Describe their elemental bond (e.g., Fire + Air) and what it means (1-2 sentences)",
  "strengths": ["Zodiac strength 1", "Zodiac strength 2"],
  "challenges": ["Potential conflict area 1", "Potential conflict area 2"],
  "forecast": "A 2-paragraph astrologer's forecast about their relationship potential and future alignment."
}
Return ONLY valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'chat');
    return parseJsonResponse(raw, {
      percentage: 85,
      verdict: "Cosmic Connection",
      astrologicalBond: "A beautiful alignment of energy bringing balance and growth.",
      strengths: ["Great communication", "Mutual respect"],
      challenges: ["Differing emotional speeds"],
      forecast: "Your stars indicate a strong, healthy foundation. If you navigate challenges with openness, this bond will stand the test of time."
    });
  } catch (err) {
    return {
      percentage: 78,
      verdict: "Celestial Harmony",
      astrologicalBond: "A nice blend of energies that provides both stability and sparks.",
      strengths: ["Emotional empathy", "Shared values"],
      challenges: ["Stubbornness during disagreements"],
      forecast: "The celestial currents show a warm, supportive connection between your signs. By honoring your differences and practicing active listening, your relationship will continue to grow and blossom under positive cosmic stars."
    };
  }
};

/**
 * Love Language Quiz (Scenario-based evaluation)
 */
export const evaluateScenarioLoveLanguage = async (answers) => {
  const prompt = `Based on these answers to a scenario-based Love Language Quiz:
${JSON.stringify(answers, null, 2)}

Analyze the scenarios and determine which of the 5 Love Languages (Words of Affirmation, Quality Time, Receiving Gifts, Acts of Service, Physical Touch) dominates.
Return a JSON object:
{
  "primary": "The dominant love language",
  "explanation": "A warm, insightful 2-paragraph explanation of why this language resonates with them based on their answers.",
  "breakdown": {
    "Words of Affirmation": (percentage value, e.g. 35),
    "Quality Time": (percentage value),
    "Receiving Gifts": (percentage value),
    "Acts of Service": (percentage value),
    "Physical Touch": (percentage value)
  },
  "actionableTips": ["Tip 1 on how they prefer to receive love", "Tip 2 on how to communicate this to a partner"]
}
Ensure all breakdown percentages sum up to 100. Return ONLY valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'quiz');
    return parseJsonResponse(raw, {
      primary: "Quality Time",
      explanation: "You thrive when sharing direct, undivided attention with your loved ones. Making memories and deep conversations are the core of your bond.",
      breakdown: { "Words of Affirmation": 20, "Quality Time": 40, "Receiving Gifts": 10, "Acts of Service": 15, "Physical Touch": 15 },
      actionableTips: ["Schedule regular device-free date nights", "Share walks together to converse about your days"]
    });
  } catch (err) {
    return {
      primary: "Words of Affirmation",
      explanation: "For you, words carry immense weight and beauty. Hearing 'I love you', receiving handwritten notes, and verbal appreciation make you feel truly seen and secure in your bond.",
      breakdown: { "Words of Affirmation": 40, "Quality Time": 20, "Receiving Gifts": 10, "Acts of Service": 15, "Physical Touch": 15 },
      actionableTips: ["Write small sticky-notes of appreciation for your partner", "Share verbal praise when they do something helpful"]
    };
  }
};

/**
 * Couples Love Language comparison
 */
export const evaluateCouplesAlignment = async (partner1Name, partner1Langs, partner2Name, partner2Langs) => {
  const prompt = `You are a relationship therapist. Compare the love language profiles of these two partners:
Partner 1: "${partner1Name}"
Profile: ${JSON.stringify(partner1Langs)}

Partner 2: "${partner2Name}"
Profile: ${JSON.stringify(partner2Langs)}

Provide a comparative analysis in JSON format:
{
  "harmonyIndex": (a number between 40 and 100 representing their natural compatibility of expression),
  "summary": "a single headline summary of their dynamic (e.g. 'Complementary Givers')",
  "harmonyAnalysis": "a 1-paragraph explanation of where their love expressions naturally align",
  "frictionAnalysis": "a 1-paragraph warning about where they might fail to translate each other's gestures",
  "tips": ["Tip 1 for Partner 1 to show love to Partner 2", "Tip 2 for Partner 2 to show love to Partner 1", "Shared exercise tip"]
}
Ensure the response is valid JSON and only valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'quiz');
    return parseJsonResponse(raw, {
      harmonyIndex: 80,
      summary: "Balanced Alignment",
      harmonyAnalysis: "Your scores indicate that both of you appreciate quality attention and emotional reassurance. You speak similar dialects when it comes to spending time together.",
      frictionAnalysis: "You might experience minor blocks if one expects verbal validation while the other shows love by completing practical tasks.",
      tips: ["Practice speaking words of appreciation regularly", "Ensure date nights are focused and device-free"]
    });
  } catch (err) {
    return {
      harmonyIndex: 75,
      summary: "Complementary Connection",
      harmonyAnalysis: "You both bring unique strengths to the relationship. While your primary modes of feeling loved differ, it allows you to cover all facets of affection.",
      frictionAnalysis: "Be careful not to assume your partner feels loved by the same things you do. Actively check in on their needs.",
      tips: [
        `Learn to recognize when ${partner2Name} is showing love through their primary styles.`,
        `Try to express appreciation to ${partner1Name} in the ways they prefer.`,
        "Set aside 10 minutes weekly to talk about how full your 'love tanks' feel."
      ]
    };
  }
};

