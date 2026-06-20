// server.js — Zuta Levana Express backend
const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/api/leads', async (req, res) => {
  const { full_name, phone, email, catering_interest, preferred_language } = req.body;
  const userAgent = req.headers['user-agent'];

  if (!full_name || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO leads (full_name, phone, email, catering_interest, preferred_language, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [full_name, phone, email, catering_interest || 'General Inquiry', preferred_language || 'he', userAgent]
    );
    const lead = result.rows[0];

    const adminHtml = `
      <div style="font-family:sans-serif;direction:rtl;text-align:right;padding:20px;border:1px solid #e0e0e0;border-radius:8px;max-width:600px;background:#fafafa">
        <h2 style="color:#b45309;border-bottom:2px solid #b45309;padding-bottom:8px">ליד חדש – קייטרינג זוטה לבנה</h2>
        <table style="width:100%;border-collapse:collapse;margin-top:15px">
          <tr style="background:#f3f4f6"><td style="padding:10px;font-weight:bold;width:30%">שם מלא:</td><td style="padding:10px">${lead.full_name}</td></tr>
          <tr><td style="padding:10px;font-weight:bold">טלפון:</td><td style="padding:10px;direction:ltr;text-align:right">${lead.phone}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:10px;font-weight:bold">אימייל:</td><td style="padding:10px">${lead.email}</td></tr>
          <tr><td style="padding:10px;font-weight:bold">תחום עניין:</td><td style="padding:10px">${lead.catering_interest}</td></tr>
          <tr style="background:#f3f4f6"><td style="padding:10px;font-weight:bold">שפה:</td><td style="padding:10px">${lead.preferred_language === 'he' ? 'עברית' : 'אנגלית'}</td></tr>
          <tr><td style="padding:10px;font-weight:bold">מזהה:</td><td style="padding:10px;font-size:12px;color:#6b7280">${lead.lead_uuid}</td></tr>
        </table>
        <div style="margin-top:20px;font-size:12px;color:#9ca3af;text-align:center;border-top:1px solid #e5e7eb;padding-top:10px">הודעה זו הופקה אוטומטית על ידי אתר זוטה לבנה.</div>
      </div>`;

    transporter.sendMail({
      from: `"מערכת לידים זוטה לבנה" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL || 'me@mymail.com',
      subject: `✨ ליד חדש! ${lead.full_name} – קייטרינג זוטה לבנה`,
      html: adminHtml,
    }, (err) => {
      if (err) console.error('SMTP error:', err);
    });

    return res.status(201).json({ success: true, leadId: lead.lead_uuid });
  } catch (err) {
    console.error('DB error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

// Serve built React frontend in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Zuta Levana server running on port ${PORT}`));
