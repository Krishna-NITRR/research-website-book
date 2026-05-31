// ═══════════════════════════════════════════════════════════
//  /api/signup.js  —  Vercel Serverless Function
//  Called by: index.html → fetch('/api/signup', ...)
//  Saves to:  Supabase table → signups
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

  const { name, email, stage } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  try {
    const { data, error } = await supabase
      .from('signups')
      .insert([{
        name:       name  || null,
        email:      email.toLowerCase().trim(),
        stage:      stage || null,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      // Duplicate email — already signed up
      if (error.code === '23505') {
        return res.status(409).json({ success: false, message: 'Already on the list!' });
      }
      console.error('❌ Supabase Error:', error);
      return res.status(500).json({ error: `Database error: ${error.message}` });
    }

    return res.status(200).json({ success: true, message: 'Signup saved!' });

  } catch (err) {
    console.error('❌ Server Crash:', err);
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
};
