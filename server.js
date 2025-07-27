const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/translate', async (req, res) => {
  const { word } = req.body;
  console.log('Petición a /translate con palabra:', word);
  if (!word) return res.status(400).json({ error: 'Falta la palabra' });

  try {
    const response = await fetch('https://libretranslate.de/translate', {
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


    const data = await response.json();
    res.json({ translation: data.translatedText.toLowerCase() });
  } catch (error) {
    res.status(500).json({ error: 'Error en la traducción' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
