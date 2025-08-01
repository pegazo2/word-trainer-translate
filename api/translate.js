const axios = require('axios');

module.exports = async (req, res) => {
  // Manejar preflight OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Body parser para Vercel (por si req.body está vacío)
  if (!req.body || Object.keys(req.body).length === 0) {
    let data = '';
    await new Promise(resolve => {
      req.on('data', chunk => { data += chunk; });
      req.on('end', resolve);
    });
    try {
      req.body = JSON.parse(data || '{}');
    } catch {
      req.body = {};
    }
  }

  const { text, to } = req.body;

  const AZURE_KEY = process.env.AZURE_TRANSLATE_KEY;
  const AZURE_REGION = process.env.AZURE_REGION;

  try {
    const response = await axios({
      baseURL: 'https://api.cognitive.microsofttranslator.com',
      url: '/translate',
      method: 'post',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY,
        'Ocp-Apim-Subscription-Region': AZURE_REGION,
        'Content-type': 'application/json',
      },
      params: {
        'api-version': '3.0',
        to: to || 'es',
      },
      data: [{ Text: text }],
    });

    const translatedText = response.data[0].translations[0].text;

    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS para POST
    res.status(200).json({ translatedText });
  } catch (err) {
    console.error(err);
    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS en error también
    res.status(500).json({ error: 'Error al traducir' });
  }
};
