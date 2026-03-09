// ═══════════════════════════════════════════════════════════
//  /api/contact.js  —  Vercel Serverless Function
//  Called by: index.html → fetch('/api/contact', ...)
//  Saves to:  Supabase table → contacts
// ═══════════════════════════════════════════════════════════

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://emsqddntqfglgwfmhres.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtc3FkZG50cWZnbGd3Zm1ocmVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNTgyMDQsImV4cCI6MjA4ODYzNDIwNH0.gOSVhUQyoyUeRaPMOBOF6ex5NAmggZUQGBNxzxXoFec';

module.exports = async function handler(req, res) {

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { name, email, subject, message } = req.body;

  // Validate
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  if (!message || message.trim().length < 5) {
    return res.status(400).json({ error: 'Message must be at least 5 characters.' });
  }

  // Connect to Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
      console.error('Supabase contact error:', error.message);
      return res.status(500).json({ error: 'Database error. Please try again.' });
    }

    return res.status(200).json({ success: true, message: 'Message sent!' });

  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
};
