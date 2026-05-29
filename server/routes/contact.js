import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

const RECEIVER_EMAIL = 'Info.za.johnny@gmail.com';

function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: 'fachmuster@gmail.com',
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });
}

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const mailOptions = {
      from: `"${name}" <fachmuster@gmail.com>`,
      to: RECEIVER_EMAIL,
      replyTo: email,
      subject: `Kontaktanfrage: ${subject || 'Kein Betreff'} – von ${name}`,
      text: [
        `Neue Kontaktanfrage von der Website:`,
        ``,
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone || '-'}`,
        `Betreff: ${subject || '-'}`,
        ``,
        `Nachricht:`,
        `${message}`,
      ].join('\n'),
      html: [
        `<h2>Neue Kontaktanfrage</h2>`,
        `<table style="border-collapse:collapse;width:100%">`,
        `<tr><td style="padding:8px;font-weight:600">Name</td><td style="padding:8px">${name}</td></tr>`,
        `<tr><td style="padding:8px;font-weight:600">E-Mail</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>`,
        `<tr><td style="padding:8px;font-weight:600">Telefon</td><td style="padding:8px">${phone || '-'}</td></tr>`,
        `<tr><td style="padding:8px;font-weight:600">Betreff</td><td style="padding:8px">${subject || '-'}</td></tr>`,
        `</table>`,
        `<hr style="margin:16px 0"/>`,
        `<h3>Nachricht:</h3>`,
        `<p style="white-space:pre-wrap">${message}</p>`,
      ].join(''),
    };

    await getTransporter().sendMail(mailOptions).catch(err => {
      console.error('Contact email send failed:', err);
      console.log('Contact notification (fallback):', { name, email, phone, subject, message });
    });

    const logEntry = { name, email, phone, subject, message, receivedAt: new Date() };

    return res.json({ success: true, message: 'Ihre Nachricht wurde gesendet.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, message: 'Fehler beim Senden Ihrer Nachricht.' });
  }
});

export default router;
