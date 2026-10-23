/**
 * Ownbench waitlist API.
 *
 * POST /api/waitlist  { name, email, website?: "" }  ->  { ok: true }
 *
 * Stores signups in D1. `website` is a honeypot field: humans never see it,
 * bots fill it. Duplicate emails are silently accepted (idempotent) so a
 * double-click or retry never shows the visitor an error.
 */

// Origins allowed to submit. Keep in sync with where the site is served.
const ALLOWED_ORIGINS = [
  'https://kunknown321.github.io',
  'https://Kunknown321.github.io',
  'http://localhost:4173',
  'http://localhost:3000',
  'http://127.0.0.1:4173',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request, { DB }) {
    const origin = request.headers.get('Origin') ?? '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    if (request.method !== 'POST' || new URL(request.url).pathname !== '/api/waitlist') {
      return new Response('Not found', { status: 404, headers: cors });
    }

    if (!cors['Access-Control-Allow-Origin']) {
      return json({ ok: false, error: 'Origin not allowed' }, 403, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: 'Invalid body' }, 400, cors);
    }

    const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : '';

    if (!name || !EMAIL_RE.test(email) || body.website) {
      return json({ ok: false, error: 'Please check your name and email.' }, 400, cors);
    }

    try {
      await DB.prepare(
        'INSERT INTO waitlist (name, email) VALUES (?1, ?2) ON CONFLICT (email) DO NOTHING',
      )
        .bind(name, email)
        .run();
      return json({ ok: true }, 200, cors);
    } catch {
      return json({ ok: false, error: 'Could not save right now. Email us instead.' }, 500, cors);
    }
  },
};

function json(payload, status, cors) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}
