const PUB_ID  = 'pub_78884462-f4cc-4d75-876d-beb3fe8cc986';
const API_KEY = 'bLZENYIdvBt4xoUeyeEkg5YmhewrgUo2yLWpmQs9UJuqgyum9cbUvcgy6riefk5M';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const { email } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${PUB_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
        }),
      }
    );
    if (beehiivRes.ok || beehiivRes.status === 409) {
      return res.status(200).json({ success: true });
    }
    const data = await beehiivRes.json().catch(() => ({}));
    console.error('Beehiiv error:', beehiivRes.status, data);
    return res.status(500).json({ error: 'Subscription failed' });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
};
