import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de traducción
app.post('/translate', async (req, res) => {
  const { word } = req.body;
  console.log('Petición a /translate con palabra:', word);
  if (!word) return res.status(400).json({ error: 'Falta la palabra' });

  try {
    const response = await fetch(const response = await fetch('https://translate.argosopentech.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: word,
        source: 'en',
        target: 'es',
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    console.log('Respuesta de libretranslate:', data);
    res.json({ translation: data.translatedText.toLowerCase() });
  } catch (error) {
    console.error('Error en traducción:', error);
    res.status(500).json({ error: 'Error en la traducción' });
  }
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
