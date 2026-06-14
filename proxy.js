require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Get API key from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Check if API key is set
if (!OPENROUTER_API_KEY) {
  console.error('❌ ERROR: OPENROUTER_API_KEY is not set in .env file');
  console.error('Please create a .env file with: OPENROUTER_API_KEY=your_key_here');
  process.exit(1);
}

app.post('/api/ai', async (req, res) => {
  try {
    const { system, userMessage } = req.body;
    
    // Validate request body
    if (!system || !userMessage) {
      return res.status(400).json({ 
        error: 'Missing required fields: system and userMessage are required' 
      });
    }

    console.log('📡 Calling OpenRouter API...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CareerForge',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API Error:', response.status, data);
      return res.status(response.status).json({ 
        error: data.error?.message || 'OpenRouter API request failed' 
      });
    }

    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
      console.error('❌ No content in response:', data);
      return res.status(500).json({ error: 'No response content from AI' });
    }

    console.log('✅ Successfully received AI response');
    res.json({ text });
    
  } catch (err) {
    console.error('❌ Proxy error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ OpenRouter proxy running at http://localhost:${PORT}`);
});