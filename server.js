import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import translate from '@vitalets/google-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/translate', async (req, res) => {
  const { word } = req.body;
  console.log('Recibido:', word);

  if (!word) {
    return res.status(400).json({ error: 'Falta la palabra' });
  }

  try {
    const result = await translate(word, { from: 'en', to: 'es' });
    console.log('Traducción:', result.text);
    res.json({ translation: result.text.toLowerCase() });
  } catch (error) {
    console.error('Error en traducción:', error);
    res.status(500).json({ error: 'Error en la traducción' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
