// api/stream.js (Vercel Serverless)
// Ověří sig + expires, potom proxyuje obsah (manifest + segmenty)
const crypto = require('crypto');
const { URL } = require('url');
const fetch = global.fetch || require('node-fetch'); // Vercel má fetch nativně, ale node-fetch fallback

function signExpected(src, expires, secret) {
  const base = `${src}|${expires}`;
  return crypto.createHmac('sha256', secret).update(base).digest('hex');
}

module.exports = async (req, res) => {
  try {
    const src = req.query.src;
    const sig = req.query.sig;
    const expires = parseInt(req.query.expires || '0', 10);
    if (!src || !sig || !expires) return res.status(400).send('missing params');

    const SECRET = process.env.TOKEN_SECRET;
    if (!SECRET) return res.status(500).send('no secret');

    const now = Math.floor(Date.now() / 1000);
    if (now > expires) return res.status(403).send('token expired');

    const expected = signExpected(src, expires, SECRET);
    const ok = crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(sig, 'hex'));
    if (!ok) return res.status(403).send('invalid signature');

    // Optional: check referer to be extra strict (can be commented)
    // const referer = req.get('referer') || '';
    // if (!referer.includes('hokejicek.site') && !referer.includes('starstreams.pro')) {
    //   return res.status(403).send('referer not allowed');
    // }

    // Proxy request to origin
    // Keep request method/headers minimal to avoid exposing secrets
    const upstream = await fetch(src, {
      method: 'GET',
      headers: {
        'User-Agent': 'hokejicek-proxy/1.0'
      },
      redirect: 'follow'
    });

    if (!upstream.ok) {
      return res.status(502).send('upstream error: ' + upstream.status);
    }

    // Pipe headers (content-type) and body back to client
    upstream.headers.forEach((value, name) => {
      // některé hlavičky nechceme přenášet (set-cookie atd.) - ale content-type je důležité
      if (name.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(name, value);
    });

    // Stream body
    const buffer = await upstream.arrayBuffer();
    res.status(upstream.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
};
