// ═══════════════════════════════════════════════════════════
//  /api/contact.js  —  Vercel Serverless Function
//  Called by: index.html → fetch('/api/contact', ...)
//  Saves to:  Supabase table → contacts
// ═══════════════════════════════════════════════════════════

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
// Use Service Role key for backend operations to bypass RLS, fallback to Anon key
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Connect to Supabase once outside the handler for better performance
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Supabase environment variables are missing in API route');
}

const supabase = createClient(SUPABASE_URL || '', SUPABASE_KEY || '');

module.exports = async function handler(req, res) {

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Ensure body exists
  if (!req.body) {
    return res.status(400).json({ error: 'Request body is missing' });
  }

  const { name, email, subject, message } = req.body;

  // Validate
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  if (!message || message.trim().length < 5) {
    return res.status(400).json({ error: 'Message must be at least 5 characters.' });
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name:       name    || null,
        email:      email.toLowerCase().trim(),
        subject:    subject || null,
        message:    message.trim(),
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Supabase Error:', error);
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    return res.status(200).json({ success: true, message: 'Message sent!' });

  } catch (err) {
    console.error('❌ Server Crash:', err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
};
