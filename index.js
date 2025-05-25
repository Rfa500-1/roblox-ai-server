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
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer TU_API_KEY`
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    res.json({ reply: aiResponse });

  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Error al comunicarse con OpenAI' });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
});
