const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: process.env.MODEL_ID,
        messages: [
          { role: 'system', content: 'You are a helpful AI assistant.' },
          { role: 'user', content: userMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data.choices[0]?.message?.content || 'Sin respuesta';
    res.json({ reply });

  } catch (error) {
    console.error('Error con OpenRouter:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al contactar con OpenRouter' });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
});

