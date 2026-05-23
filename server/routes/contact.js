import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

const RECEIVER_EMAIL = 'Info.za.johnny@gmail.com';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER || email}>`,
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

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail(mailOptions);
    }

    const logEntry = { name, email, phone, subject, message, receivedAt: new Date() };

    return res.json({ success: true, message: 'Ihre Nachricht wurde gesendet.' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ success: false, message: 'Fehler beim Senden Ihrer Nachricht.' });
  }
});

export default router;
