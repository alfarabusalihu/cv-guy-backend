
const OpenAI  = require('openai');
// const openai = new OpenAI({
//   apiKey: process.env.OPENROUTER_API_KEY,
//   baseURL: 'https://openrouter.ai/api/v1'
// });

// const OpenAI = require('openai');
const Cv = require('../models/cv.model');
const pdfParse = require('pdf-parse');

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1'
});

exports.askCV = async (req, res) => {
  const { question } = req.body;

  try {
    // 1. Get the latest CV from DB
    const latestCv = await Cv.findOne().sort({ uploadedAt: -1 });
    if (!latestCv) {
      return res.status(404).json({ message: 'No CV found in database' });
    }

    // 2. Parse PDF to extract text
    const pdfData = await pdfParse(latestCv.content);

    // 3. Send to OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant who answers questions regarding the provided resume.'
        },
        {
          role: 'user',
          content: `Resume:\n${pdfData.text}`
        },
        {
          role: 'user',
          content: `Question:\n${question}`
        }
      ],
      temperature: 0.5,
      max_tokens: 3000
    });

    res.json({ answer: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

