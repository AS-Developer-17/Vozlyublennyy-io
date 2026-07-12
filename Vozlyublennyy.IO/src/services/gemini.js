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

  // List of models to try in priority order.
  // gemini-3.1-flash-lite is currently the most stable and quota-friendly model available.
  const models = [
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash',
    'gemini-2.5-flash'
  ];

  let lastError = null;

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
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
        console.warn(`Gemini API error with model ${model}: status ${response.status}`, errorData);
        lastError = new Error(errorData.error?.message || `Gemini API responded with status ${response.status}`);
        continue;
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        lastError = new Error(`Empty response received from model ${model}.`);
        continue;
      }

      return generatedText;
    } catch (error) {
      console.error(`Error in askGemini with model ${model}:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error("All attempts to call Gemini API failed.");
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
  } catch {
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
  } catch {
    return "I'm so sorry, I had a little hiccup connecting to my thoughts. But I'm here for you! Tell me more about what's on your mind, and let's work through it together. 💕";
  }
};

/**
 * Generate Love Quotes
 */
export const getCustomLoveQuote = async (category) => {
  // Add a random concept or seed to force a different quote each time
  const prompt = `Generate a beautiful, original, and deeply moving love quote for the category: "${category}". 
Make it unique and different from previous responses. Concept hint/seed: ${Math.random()}.
Return ONLY the quote itself inside quotes, followed by a new line and the author designation (either "Anonymous" or a creative pen name, e.g., "- A Whisper of Love"). Do not write any introduction or summary.`;

  // Provide a collection of 10 fallback quotes per category
  const defaults = {
    romantic: [
      `"In the arithmetic of love, one plus one equals everything, and two minus one equals nothing."\n- Mignon McLaughlin`,
      `"If I know what love is, it is because of you."\n- Hermann Hesse`,
      `"To love and be loved is to feel the sun from both sides."\n- David Viscott`,
      `"I would rather spend one lifetime with you, than face all the ages of this world alone."\n- J.R.R. Tolkien`,
      `"You are my today and all of my tomorrows."\n- Leo Christopher`,
      `"We loved with a love that was more than love."\n- Edgar Allan Poe`,
      `"You have bewitched me, body and soul, and I love, I love, I love you."\n- Jane Austen`,
      `"If I had a flower for every time I thought of you... I could walk through my garden forever."\n- Alfred Tennyson`,
      `"Love is composed of a single soul inhabiting two bodies."\n- Aristotle`,
      `"My heart is and always will be yours."\n- Jane Austen`
    ],
    sad: [
      `"The hottest love has the coldest end."\n- Socrates`,
      `"It is better to have loved and lost than never to have loved at all."\n- Alfred Tennyson`,
      `"Pleasure of love lasts but a moment. Pain of love lasts a lifetime."\n- Bette Davis`,
      `"The worst feeling in the world is knowing you've done the best you could, and it still wasn't good enough."\n- Anonymous`,
      `"Ever has it been that love knows not its own depth until the hour of separation."\n- Kahlil Gibran`,
      `"You can close your eyes to things you don't want to see, but you can't close your heart to things you don't want to feel."\n- Johnny Depp`,
      `"Heavy hearts, like heavy clouds in the sky, are best relieved by the letting of a little water."\n- Antoine de Saint-Exupéry`,
      `"It's amazing how someone can break your heart and you can still love them with all the little pieces."\n- Ella Harper`,
      `"The flame of love is now but cold ashes."\n- A Whisper of Love`,
      `"To love at all is to be vulnerable."\n- C.S. Lewis`
    ],
    inspirational: [
      `"Being deeply loved by someone gives you strength, while loving someone deeply gives you courage."\n- Lao Tzu`,
      `"We are shaped and fashioned by what we love."\n- Johann Wolfgang von Goethe`,
      `"Love itself is what is left over when being in love has burned away."\n- Louis de Bernières`,
      `"We are most alive when we're in love."\n- John Updike`,
      `"There is only one happiness in this life, to love and be loved."\n- George Sand`,
      `"Love does not consist in gazing at each other, but in looking outward together in the same direction."\n- Antoine de Saint-Exupéry`,
      `"The best thing to hold onto in life is each other."\n- Audrey Hepburn`,
      `"Where there is love there is life."\n- Mahatma Gandhi`,
      `"Love is a friendship set to music."\n- Joseph Campbell`,
      `"Keep love in your heart. A life without it is like a sunless garden when the flowers are dead."\n- Oscar Wilde`
    ]
  };

  try {
    return await askGemini(prompt, 'chat');
  } catch {
    const list = defaults[category] || defaults.romantic;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }
};

const toSentenceCase = (str) => {
  if (!str) return str;
  return str.split(/([\s-]+)/) // Keep separators to preserve original spaces/dashes
    .map(word => {
      if (word.match(/[\s-]+/)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');
};

/**
 * Nickname Generator
 */
export const getCustomNicknames = async (name1, name2) => {
  const prompt = `Create unique, cute, and romantic couple nicknames by blending the names: "${name1}" and "${name2}".
Return a JSON array of exactly 10 nickname objects, each containing:
{
  "nickname": "the blended nickname",
  "vibe": "the vibe (e.g. 'Cute', 'Playful', 'Sweet', 'Modern')",
  "explanation": "a short 1-sentence explanation of why it works"
}
Ensure the response is valid JSON and only valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'chat');
    // Ensure we parse correctly and it's a list.
    const res = parseJsonResponse(raw, []);
    if (res && res.length >= 10) {
      return res.slice(0, 10).map(item => ({
        ...item,
        nickname: toSentenceCase(item.nickname)
      }));
    }
    // If fewer than 10 are returned, fill up with fallbacks
    const fallbacks = getProceduralNicknames(name1, name2);
    const combined = [...(res || []), ...fallbacks];
    // filter duplicates and keep 10
    const unique = [];
    const seen = new Set();
    for (const item of combined) {
      if (!seen.has(item.nickname.toLowerCase())) {
        seen.add(item.nickname.toLowerCase());
        unique.push(item);
      }
    }
    return unique.slice(0, 10).map(item => ({
      ...item,
      nickname: toSentenceCase(item.nickname)
    }));
  } catch {
    return getProceduralNicknames(name1, name2).map(item => ({
      ...item,
      nickname: toSentenceCase(item.nickname)
    }));
  }
};

const getProceduralNicknames = (name1, name2) => {
  const n1 = name1.trim();
  const n2 = name2.trim();
  const blend1 = n1.substring(0, Math.ceil(n1.length / 2)) + n2.substring(Math.floor(n2.length / 2));
  const blend2 = n2.substring(0, Math.ceil(n2.length / 2)) + n1.substring(Math.floor(n1.length / 2));
  const blend3 = n1.substring(0, 2) + n2.substring(n2.length - 2);
  const blend4 = n2.substring(0, 2) + n1.substring(n1.length - 2);
  
  return [
    { nickname: blend1, vibe: "Romantic", explanation: "A perfect blend fusing the beginning of one with the end of the other." },
    { nickname: blend2, vibe: "Cute", explanation: "A sweet combination blending your names in reverse harmony." },
    { nickname: `${n1} & Co.`, vibe: "Playful", explanation: "A fun way of showing you two are a team." },
    { nickname: `The ${n1[0]}${n2[0]}s`, vibe: "Modern", explanation: "Using your initials to create a cool duo name." },
    { nickname: `Lovebirds`, vibe: "Classic", explanation: "An adorable, timeless title for you both." },
    { nickname: blend3, vibe: "Sweet", explanation: "A short, cute fusion of your names." },
    { nickname: blend4, vibe: "Charming", explanation: "A playful blend starting with the second name." },
    { nickname: `${n1} & ${n2}`, vibe: "Classic", explanation: "Simple and timeless, just the two of you together." },
    { nickname: `Duo ${n1[0]}${n2[0]}`, vibe: "Modern", explanation: "A sleek monogram nickname for a dynamic partnership." },
    { nickname: `Soulmates`, vibe: "Romantic", explanation: "A beautiful title reflecting a deep, soulful bond." }
  ];
};

export const getNicknamesForHimHer = async (name, gender) => {
  const prompt = `Create exactly 10 unique, cute, sweet, and highly affectionate nicknames for a partner named "${name}" who is a "${gender}".
Every single nickname MUST be highly personalized and feel like a real, tender, affectionate short-form, phonetic variation, or diminutive of their name "${name}" (similar to how "Shreya" becomes "Shreyu", "Sheru", "Shrey", "Shreru", "Jaanu", "Pari"; and "Akshita" becomes "Akshu", "Akshi", "Aksh", "Ita", "Kita", "Akshiya", "Ashi").
Do NOT just return generic reserved titles that do not build on or contain their name (such as "Honey", "Sweetheart", "Darling", "Lovebug", "King", "Queen", "Handsome", "Cutie", "Princess", "Babe", "Prince"). Instead, mix cute sound changes (adding suffixes like "-u", "-y", "-ie", "-iya", "-oo", or name abbreviation) with highly tender terms.
Return a JSON array of exactly 10 nickname objects, each containing:
{
  "nickname": "the real, affectionate nickname",
  "vibe": "the vibe (e.g. 'Cute', 'Sweet', 'Romantic', 'Playful', 'Funny')",
  "explanation": "a short 1-sentence explanation of how it affectionately transforms their name"
}
Ensure the response is valid JSON and only valid JSON.`;

  try {
    const raw = await askGemini(prompt, 'chat');
    const res = parseJsonResponse(raw, []);
    if (res && res.length >= 10) {
      // Validate that at least some form of name check passes, otherwise use fallbacks
      const formattedRes = res.slice(0, 10).map(item => ({
        ...item,
        nickname: toSentenceCase(item.nickname)
      }));
      const valid = formattedRes.filter(item => item.nickname.toLowerCase().includes(name.trim().toLowerCase().substring(0, 2)));
      if (valid.length >= 5) return formattedRes;
    }
    const fallbacks = getProceduralHimHerNicknames(name, gender);
    const combined = [...(res || []), ...fallbacks];
    const unique = [];
    const seen = new Set();
    for (const item of combined) {
      if (!seen.has(item.nickname.toLowerCase())) {
        seen.add(item.nickname.toLowerCase());
        unique.push(item);
      }
    }
    return unique.slice(0, 10).map(item => ({
      ...item,
      nickname: toSentenceCase(item.nickname)
    }));
  } catch {
    return getProceduralHimHerNicknames(name, gender).map(item => ({
      ...item,
      nickname: toSentenceCase(item.nickname)
    }));
  }
};

const getProceduralHimHerNicknames = (name, gender) => {
  const n = name.trim();
  const lowerGender = gender.toLowerCase();
  
  // Syllable helper logic to build real affectionate variations
  const short3 = n.substring(0, 3);
  const short4 = n.length >= 4 ? n.substring(0, 4) : n;
  
  const endings = lowerGender === 'him'
    ? ['u', 'y', 'ie', 'oo', 'z', 's']
    : ['u', 'i', 'y', 'ie', 'iya', 'oo'];
    
  const dim1 = `${short4}${endings[0]}`; // e.g. Rohan -> Rohu, Shreya -> Shreyu, Akshita -> Akshu
  const dim2 = `${short4}${endings[1]}`; // e.g. Rohan -> Rohy, Shreya -> Shreyi, Akshita -> Akshi
  const dim3 = `${short3}${endings[2]}`; // e.g. Rohie, Shrie, Aksie (Ashi!)
  const dim4 = `${short4}${endings[4] || 's'}`; // e.g. Rohz, Shreiya, Akshiya
  const dim5 = n.length > 3 ? n.substring(n.length - 3) : n; // e.g. "han", "eya", "ita" (Ita!)
  const dim6 = n.length > 4 ? n.substring(n.length - 4) : n; // e.g. "ohan", "reya", "kita" (Kita!)
  const dim8 = `${short4}`; // e.g. Roh, Shrey, Aksh (Aksh!)
  
  const terms = lowerGender === 'him'
    ? ['Jaanu', 'Shona', 'Hero', 'Baby', 'Love']
    : ['Pari', 'Jaanu', 'Shona', 'Doll', 'Baby'];
    
  return [
    { nickname: dim1, vibe: "Cute", explanation: "A sweet, affectionate short-form of their name." },
    { nickname: dim2, vibe: "Sweet", explanation: "A cute diminutive ending that is soft to say." },
    { nickname: terms[0], vibe: "Romantic", explanation: "A classic, deeply affectionate term of endearment." },
    { nickname: dim8, vibe: "Playful", explanation: "A shortened, cool version of the name." },
    { nickname: dim3, vibe: "Sweet", explanation: "An adorable, playful abbreviation." },
    { nickname: dim5, vibe: "Cute", explanation: "Using the tail end of the name for a unique, intimate pet name." },
    { nickname: terms[1], vibe: "Romantic", explanation: "A warm and popular loving name." },
    { nickname: dim4, vibe: "Cute", explanation: "A lovely rhythmic nickname combining name letters." },
    { nickname: dim6, vibe: "Playful", explanation: "A sweet variant cut directly from the end of the name." },
    { nickname: terms[2], vibe: "Sweet", explanation: "A highly affectionate and tender cultural pet name." }
  ];
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
  } catch {
    return {
      title: "Heartfelt Message",
      text: `Just wanted to send a little reminder that you are on my mind and in my heart. Thank you for being the amazing person you are.`,
      advice: "Send this with a cute heart emoji to let them know they are special to you."
    };
  }
};

/**
 * Date Ideas Generator Local Fallback Database
 */
const fallbackDateDatabase = {
  "Free": {
    "Cozy/Indoor": [
      { title: "DIY living room fort & boardgame night", costEstimation: "Free", description: "Build a cozy blanket fort in your living room, complete with fairy lights, and spend the night playing your favorite classic board games.", proTip: "Make it a playful challenge with fun stakes, like the loser cooking breakfast." },
      { title: "Living room karaoke & dance session", costEstimation: "Free", description: "Turn on your favorite music or karaoke tracks on YouTube and sing/dance together in your living room.", proTip: "Dress up in silly performance outfits to maximize the fun." },
      { title: "Homemade pizza night & movie marathon", costEstimation: "Free", description: "Use whatever ingredients you have in the pantry to bake a homemade pizza together from scratch, then watch a movie trilogy.", proTip: "Shape the pizza dough like a heart for a romantic touch." }
    ],
    "Outdoors/Active": [
      { title: "Scenic sunset hike & stargazing", costEstimation: "Free", description: "Pack a bottle of water and head to a local trail or high point to watch the sunset, then lay down a blanket to view the stars.", proTip: "Download a stargazing app like SkyView to identify constellations together." },
      { title: "Bike ride to a secret scenic spot", costEstimation: "Free", description: "Hop on your bikes and explore a local park or lakeside trail you haven't visited before, packing a light snack.", proTip: "Take photos at the most beautiful scenic spots to commemorate the ride." },
      { title: "Outdoor park workout or yoga session", costEstimation: "Free", description: "Find a quiet grassy spot at a park and do a couples yoga or stretching session together in the fresh air.", proTip: "End the session with a few minutes of quiet mindfulness together." }
    ],
    "Artistic/Creative": [
      { title: "Napkin sketching & coffee chat", costEstimation: "Free", description: "Bring paper or napkins and pencils to a local scenic spot or library and sketch funny portraits of each other.", proTip: "Don't reveal your sketches until both are completely finished!" },
      { title: "Photography walk in the neighborhood", costEstimation: "Free", description: "Take a walk together with your phone cameras, challenging each other to capture the most artistic shot of nature or architecture.", proTip: "Print the winning photo later to frame on your wall." },
      { title: "DIY poetry writing workshop", costEstimation: "Free", description: "Write short, funny, or romantic poems about each other using cut-out words from old newspapers or magazines.", proTip: "Read them out loud to each other with dramatic accents." }
    ],
    "Foodie": [
      { title: "Farmer's market tasting walk", costEstimation: "Free", description: "Stroll through a local farmer's market, visiting different stalls that offer free cheese, fruit, or honey samples.", proTip: "Chat with the local vendors to learn the stories behind their food." },
      { title: "Pantry cooking challenge", costEstimation: "Free", description: "Pretend you are on a cooking show! Give each other 3 random ingredients from your pantry and see who can make the tastiest snack.", proTip: "Grade each other's dishes on presentation and creativity." },
      { title: "Blindfolded taste testing at home", costEstimation: "Free", description: "Blindfold your partner and feed them small bites of various foods from the fridge, letting them guess what they are.", proTip: "Include a mix of sweet, sour, spicy, and savory foods." }
    ],
    "Adventurous": [
      { title: "Explore a deserted or historic path", costEstimation: "Free", description: "Search for public historic ruins, abandoned landmarks, or ancient trails nearby and go on a walking exploration.", proTip: "Read about the history of the place beforehand to share cool facts during the walk." },
      { title: "Geocaching adventure in the city", costEstimation: "Free", description: "Download a free geocaching app and spend the afternoon hunting down hidden containers tucked away in your local neighborhood.", proTip: "Bring a small trinket of your own to leave behind in the geocache." },
      { title: "Visit a high-rise rooftop for panoramic views", costEstimation: "Free", description: "Find a publicly accessible high-rise building, hotel lobby, or public rooftop terrace and enjoy the skyline views together.", proTip: "Go right at twilight to see the city lights turn on." }
    ]
  },
  "Under $20": {
    "Cozy/Indoor": [
      { title: "Thrift store puzzle & hot cocoa night", costEstimation: "Under $20", description: "Buy a cheap, challenging jigsaw puzzle from a local thrift store, make hot cocoa, and solve it together at home.", proTip: "Put on a relaxing lo-fi playlist to create a warm atmosphere." },
      { title: "Retro arcade video game challenge", costEstimation: "Under $20", description: "Buy a retro console game emulator or simple classic games online and play multiplayer coop games together.", proTip: "Team up to beat a high score rather than playing against each other." },
      { title: "Bookstore date & reading nook chat", costEstimation: "Under $20", description: "Visit a local bookstore, pick out a book under $10 for each other, and spend an hour reading together in a cozy corner.", proTip: "Write a small dedicated note on the inside cover of the book you choose." }
    ],
    "Outdoors/Active": [
      { title: "Frisbee golf & ice cream picnic", costEstimation: "Under $20", description: "Buy a cheap frisbee, head to a public frisbee golf course or park, and play a match, ending with local ice cream cones.", proTip: "Use trees or benches as targets if there's no official course." },
      { title: "Botanical garden walk & plant shopping", costEstimation: "Under $20", description: "Visit a public garden with a low entry fee, walk through the greenhouses, and buy a small succulent to nurture together.", proTip: "Name the succulent a combination of your names." },
      { title: "Kayaking or paddle boating on a local lake", costEstimation: "Under $20", description: "Rent a double kayak or paddle boat for half an hour at a local lake or city park pond.", proTip: "Coordinate your rowing rhythm to paddle in a straight line!" }
    ],
    "Artistic/Creative": [
      { title: "Clay modeling sculpting night", costEstimation: "Under $20", description: "Buy a pack of air-dry sculpting clay, put on cozy clothes, and mold small clay dishes or figures for each other.", proTip: "Paint them together once they dry the following day." },
      { title: "Watercolor painting in the park", costEstimation: "Under $20", description: "Grab a cheap watercolor set and sketchpads, sit on a park bench, and paint the landscape in front of you.", proTip: "Mix your colors on the same palette to symbolize your collaboration." },
      { title: "Thrift store outfit swap challenge", costEstimation: "Under $20", description: "Go to a thrift store with a $10 budget each. Pick out a funny or stylish outfit for the other person to wear.", proTip: "Wear the outfits to grab a cheap snack or coffee afterwards." }
    ],
    "Foodie": [
      { title: "Gourmet taco truck crawling", costEstimation: "Under $20", description: "Find a street food market or local taco trucks and buy 2-3 different tacos to share and rank.", proTip: "Ask the vendor for their absolute spiciest salsa to try." },
      { title: "Bobba tea & pastry sampling walk", costEstimation: "Under $20", description: "Grab boba tea or specialty coffees and walk around a historic neighborhood, checking out local bakeries.", proTip: "Split a single dessert so you can try multiple different bakeries." },
      { title: "DIY fancy mocktail making", costEstimation: "Under $20", description: "Buy a bottle of sparkling water, fresh mint, lime, and exotic fruit juices to mix creative mocktails at home.", proTip: "Serve them in your finest glassware with sugar-rimmed borders." }
    ],
    "Adventurous": [
      { title: "Local bowling alley match", costEstimation: "Under $20", description: "Head to a local bowling alley during shoe rental discount hours and play two games together.", proTip: "The person with the lower score has to give the winner a shoulder massage." },
      { title: "Late-night drive-in movie night", costEstimation: "Under $20", description: "Drive to a local drive-in movie theatre, parking your car backwards and opening the trunk with blankets and pillows.", proTip: "Bring your own popcorn and drinks from home to stay within budget." },
      { title: "Retro roller-skating rink session", costEstimation: "Under $20", description: "Rent roller skates at a local rink and glide around together to upbeat retro music.", proTip: "Hold hands while skating to help each other balance." }
    ]
  },
  "Moderate": {
    "Cozy/Indoor": [
      { title: "DIY couples spa & massage night", costEstimation: "Moderate", description: "Buy scented massage oils, sheet masks, and relaxing bath bombs. Turn your bathroom into a luxury spa.", proTip: "Light scented candles and play soft nature or spa music in the background." },
      { title: "Private cooking class with a meal kit", costEstimation: "Moderate", description: "Order a gourmet recipe meal kit online, pour some drinks, and cook a restaurant-quality meal together at home.", proTip: "Dress up in formal wear as if you were visiting a fine restaurant." },
      { title: "Virtual museum tour & themed dinner", costEstimation: "Moderate", description: "Cast a high-definition virtual museum tour (like the Louvre) on your TV while eating a themed French dinner.", proTip: "Discuss your favorite paintings over a glass of wine or grape juice." }
    ],
    "Outdoors/Active": [
      { title: "Paddleboarding renting on the bay", costEstimation: "Moderate", description: "Rent stand-up paddleboards for a couple of hours and paddle along a scenic shoreline or quiet bay.", proTip: "Look out for local wildlife like ducks or fish swimming under your board." },
      { title: "Sunset horseback riding trail", costEstimation: "Moderate", description: "Book a guided group horseback ride through forest trails or along a sandy beach during sunset.", proTip: "Bring a camera to take photos of each other riding horses." },
      { title: "Outdoor mini-golf competition", costEstimation: "Moderate", description: "Visit a beautifully landscaped mini-golf park and play an 18-hole tournament with fun wagers.", proTip: "Keep a scorecard and write cute notes next to each other's score." }
    ],
    "Artistic/Creative": [
      { title: "Paint & Sip couples workshop", costEstimation: "Moderate", description: "Attend a local guided paint-and-sip class where you paint two halves of a canvas that connect together.", proTip: "Hang the connected canvases on your wall as a symbol of your connection." },
      { title: "Pottery wheel class for beginners", costEstimation: "Moderate", description: "Book a one-off introductory class at a local pottery studio, learning to spin clay on a potter's wheel.", proTip: "Help each other shape the clay pot, creating a fun shared memory." },
      { title: "Local amateur theater or comedy show", costEstimation: "Moderate", description: "Buy tickets to a local community theater production, indie play, or stand-up comedy club showcase.", proTip: "Grab a drink or dessert nearby afterwards to discuss your favorite jokes or scenes." }
    ],
    "Foodie": [
      { title: "Interactive hot pot or fondue dinner", costEstimation: "Moderate", description: "Visit a local hot pot or fondue restaurant where you cook meats and vegetables live in a boiling broth or dip in cheese.", proTip: "Feed each other different combinations of ingredients to test flavors." },
      { title: "Gourmet dessert tour around town", costEstimation: "Moderate", description: "Skip dinner and go straight to three high-end dessert lounges, ordering a single plate to share at each location.", proTip: "Order a mix of fruit, chocolate, and pastry desserts." },
      { title: "Sushi making kit & rolling competition", costEstimation: "Moderate", description: "Buy a sushi-making kit with rolling mats, seaweed sheets, sushi rice, and fresh fish or veggies to roll sushi at home.", proTip: "Compete to see who can roll the neatest and most creative roll." }
    ],
    "Adventurous": [
      { title: "Indoor rock climbing session", costEstimation: "Moderate", description: "Rent climbing shoes and harness at an indoor rock climbing gym, belaying and supporting each other as you climb.", proTip: "Cheer each other on as you try harder routes." },
      { title: "Escape room puzzle challenge", costEstimation: "Moderate", description: "Book a themed escape room (e.g. mystery, sci-fi) and work together under a 60-minute timer to solve the clues.", proTip: "Focus on your individual strengths—one might be good at math, another at observation." },
      { title: "City sightseeing scooter tour", costEstimation: "Moderate", description: "Rent electric city scooters and follow a self-guided route to check out all the historical monuments in your city.", proTip: "Stop at a local park to rest and sit on a bench to talk." }
    ]
  },
  "Luxury/Splurge": {
    "Cozy/Indoor": [
      { title: "Private chef experience at home", costEstimation: "Luxury/Splurge", description: "Hire a professional local chef to come to your home, set the table, and prepare a custom 5-course dinner in your kitchen.", proTip: "Ask the chef to explain the concept behind each dish as it is served." },
      { title: "High-end luxury hotel staycation", costEstimation: "Luxury/Splurge", description: "Book a night at a luxury 5-star boutique hotel in your city, enjoying room service, the pool, and plush robes.", proTip: "Order breakfast in bed the next morning to extend the relaxed luxury feel." },
      { title: "Private home cinema rental", costEstimation: "Luxury/Splurge", description: "Rent out a small boutique movie theater or a luxury private screening room just for the two of you.", proTip: "Pick a film that has deep nostalgic meaning for your relationship." }
    ],
    "Outdoors/Active": [
      { title: "Private sunset yacht charter", costEstimation: "Luxury/Splurge", description: "Rent a private yacht with a skipper for a sunset cruise along the coastline, enjoying drinks and appetizers.", proTip: "Bring a warm sweater or jacket as it can get breezy on the water during sunset." },
      { title: "Helicopter ride & mountain-top lunch", costEstimation: "Luxury/Splurge", description: "Book a helicopter sightseeing tour that lands on a mountain peak or remote scenic spot for a catered champagne lunch.", proTip: "Dress warmly and wear sturdy shoes for walking on the summit terrain." },
      { title: "Hot air balloon flight at sunrise", costEstimation: "Luxury/Splurge", description: "Float high above the valleys in a hot air balloon at sunrise, followed by a luxury champagne breakfast upon landing.", proTip: "Take panoramic landscape photos together while in the air." }
    ],
    "Artistic/Creative": [
      { title: "VIP museum tour & art purchase", costEstimation: "Luxury/Splurge", description: "Book a private, after-hours VIP guided tour of a major museum, and buy a small piece from an adjacent art gallery.", proTip: "Hang the purchased art in a central spot in your home to remember the date." },
      { title: "Premium glassblowing workshop", costEstimation: "Luxury/Splurge", description: "Book a private one-on-one session with a master glassblower to design and blow customized glass sculptures.", proTip: "Create a pair of matching glasses or ornaments you can use forever." },
      { title: "Front-row tickets to Broadway or Opera", costEstimation: "Luxury/Splurge", description: "Purchase premium front-row tickets to a major touring theater production, symphony concert, or grand opera.", proTip: "Dress up in formal evening wear and book a high-end restaurant table beforehand." }
    ],
    "Foodie": [
      { title: "Michelin-starred tasting menu", costEstimation: "Luxury/Splurge", description: "Reserve a table at a Michelin-starred restaurant for a multi-course culinary art tasting menu with wine pairings.", proTip: "Book weeks in advance, and inform the restaurant if you are celebrating a special occasion." },
      { title: "Private vineyard tour & wine blending", costEstimation: "Luxury/Splurge", description: "Spend the day at a luxury winery, getting a private tour of the cellars and blending your own custom bottle of wine.", proTip: "Design a custom label for your blended bottle to save for a future anniversary." },
      { title: "Chef-guided culinary masterclass", costEstimation: "Luxury/Splurge", description: "Book a private cooking masterclass with an executive chef in a professional kitchen, cooking a gourmet feast.", proTip: "Take notes of the chef's culinary tricks to recreate the meal at home." }
    ],
    "Adventurous": [
      { title: "Private flight simulator flying lesson", costEstimation: "Luxury/Splurge", description: "Book a flight lesson where you actually get to pilot a small training airplane under the guidance of a flight instructor.", proTip: "Take turns in the cockpit and film each other taking off and landing." },
      { title: "High-speed supercar track driving", costEstimation: "Luxury/Splurge", description: "Rent a luxury supercar (Ferrari, Lamborghini) and drive it on a professional racing track with an instructor.", proTip: "Compare your top speeds on the straightaways for a friendly rivalry." },
      { title: "Luxury wilderness glamping safari", costEstimation: "Luxury/Splurge", description: "Spend the weekend glamping in a luxury safari tent with a private outdoor hot tub and guided night wildlife safaris.", proTip: "Enjoy a late-night soak in the hot tub while looking at the stars." }
    ]
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
    return parseJsonResponse(raw, []);
  } catch (err) {
    console.warn("Date generation API failed, using personalized offline fallback database.", err);
    const budgetMap = fallbackDateDatabase[budget] || fallbackDateDatabase["Free"];
    return budgetMap[vibe] || budgetMap["Cozy/Indoor"];
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
  } catch {
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
  } catch {
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
  } catch {
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

