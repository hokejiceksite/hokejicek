// api/token.js (Vercel Serverless)
const crypto = require('crypto');

module.exports = async (req, res) => {
  try {
    const src = req.query.src;
    if (!src) return res.status(400).json({ error: 'missing src' });

    const SECRET = process.env.TOKEN_SECRET;
    if (!SECRET) return res.status(500).json({ error: 'no secret configured' });

    const ttl = Math.min(Math.max(parseInt(req.query.ttl || '60', 10), 10), 600); // 10..600s
    const expires = Math.floor(Date.now() / 1000) + ttl;
    const base = `${src}|${expires}`;
    const sig = crypto.createHmac('sha256', SECRET).update(base).digest('hex');

    // Vrátíme proxy URL (serverless domain) - upraví se po nasazení
    // Vercel automaticky mapuje /api/stream na api/stream.js
    const proxyUrl = `/api/stream?src=${encodeURIComponent(src)}&expires=${expires}&sig=${sig}`;
    return res.json({ url: proxyUrl, expires_at: expires });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server_error' });
  }
};
