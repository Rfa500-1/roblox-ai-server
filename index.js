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
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      {
        inputs: userMessage,
        parameters: {
          max_new_tokens: 100,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data[0]?.generated_text || 'Sin respuesta de la IA';
    res.json({ reply: aiResponse });

  } catch (error) {
    console.error('Error al contactar con la IA:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al comunicarse con Hugging Face' });
  }
});

app.listen(port, () => {
  console.log(`Servidor activo en puerto ${port}`);
});

