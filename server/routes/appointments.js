import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import { Appointment } from '../models/Appointment.js';
import { Availability } from '../models/Availability.js';

const router = express.Router();

const APPOINTMENT_RECEIVER_EMAIL = 'fachmuster@gmail.com';

let _appointmentTransporter = null;
function getAppointmentTransporter() {
  if (_appointmentTransporter) return _appointmentTransporter;
  if (process.env.BREVO_SMTP_KEY) {
    _appointmentTransporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      requireTLS: true,
      tls: { rejectUnauthorized: false },
      auth: { user: process.env.BREVO_SMTP_USER || 'fachmuster@gmail.com', pass: process.env.BREVO_SMTP_KEY },
    });
  } else if (process.env.SENDGRID_API_KEY) {
    _appointmentTransporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      secure: false,
      auth: { user: 'apikey', pass: process.env.SENDGRID_API_KEY },
    });
  } else if (process.env.GMAIL_APP_PASSWORD) {
    _appointmentTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: 'fachmuster@gmail.com', pass: process.env.GMAIL_APP_PASSWORD },
    });
  } else {
    _appointmentTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'fachmuster@gmail.com',
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });
  }
  return _appointmentTransporter;
}

function generateTimeSlots(start, end, interval = 30) {
  const slots = [];
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  let current = sh * 60 + sm;
  const endMin = eh * 60 + em;
  while (current < endMin) {
    const h = String(Math.floor(current / 60)).padStart(2, '0');
    const m = String(current % 60).padStart(2, '0');
    slots.push(`${h}:${m}`);
    current += interval;
  }
  return slots;
}

function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function normalizeDateFilter(dateValue) {
  const day = new Date(dateValue);
  const nextDay = new Date(day);
  nextDay.setDate(day.getDate() + 1);
  return { $gte: day, $lt: nextDay };
}

function normalizeAppointmentPayload(payload) {
  const normalized = { ...payload };
  if (typeof normalized.date === 'string' && normalized.date.length <= 10) {
    normalized.date = new Date(`${normalized.date}T12:00:00.000Z`);
  }
  return normalized;
}

function mapPublicAppointment(appointment) {
  return {
    id: appointment._id,
    date: appointment.date,
    time: appointment.time,
    service: appointment.service,
    status: appointment.status,
  };
}

const PHONE_REGEX = /^[\+\d][\d\s\-\(\)\.]{6,20}$/;

function validatePhone(phone) {
  if (!phone || !PHONE_REGEX.test(phone)) {
    return 'Invalid phone number format';
  }
  return null;
}

function validateNotPast(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(dateStr);
  if (inputDate < today) {
    return 'Date cannot be in the past';
  }
  return null;
}

async function checkTimeConflict(dateStr, time, excludeId) {
  const filter = { time, date: normalizeDateFilter(dateStr) };
  if (excludeId) {
    filter._id = { $ne: excludeId };
  }
  const existing = await Appointment.findOne(filter);
  return existing;
}

router.get('/public', async (_req, res, next) => {
  try {
    const appointments = await Appointment.find(
      { status: { $in: ['pending', 'confirmed', 'completed'] } },
      null,
      { sort: { date: 1, time: 1 } }
    );
    res.json(appointments.map(mapPublicAppointment));
  } catch (error) {
    next(error);
  }
});

router.get('/test-email', async (_req, res) => {
  try {
    const hasCreds = !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN);
    const testMail = {
      from: '"Test" <fachmuster@gmail.com>',
      to: 'fachmuster@gmail.com',
      subject: 'Test from Render',
      text: 'If you see this, email works',
    };
    await getAppointmentTransporter().sendMail(testMail);
    res.json({ success: true, hasCreds, message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ success: false, hasCreds: !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN), error: err.message, stack: err.stack });
  }
});

router.get('/timeslots', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }

    const queryDate = new Date(date + 'T12:00:00.000Z');
    const dayOfWeek = queryDate.getUTCDay();
    const dateStr = date;

    const slotConfigs = await Promise.all([
      Availability.findOne().lean(),
    ]);
    const availability = slotConfigs[0];

    let availableTimes = [];
    let outTimes = [];

    if (availability) {
      const dayShift = availability.weeklyShifts.find(s => s.dayOfWeek === dayOfWeek);
      const dayOutTimes = (availability.outTimes || []).filter(ot => {
        const otDate = new Date(ot.date);
        return otDate.toISOString().slice(0, 10) === dateStr;
      });
      outTimes = dayOutTimes;

      if (!dayShift || !dayShift.enabled) {
        return res.json({ date, availableTimes: [], bookedTimes: [], outTimes, reason: 'Day off' });
      }

      const allDayOut = dayOutTimes.find(ot => ot.allDay);
      if (allDayOut) {
        return res.json({ date, availableTimes: [], bookedTimes: [], outTimes, reason: 'Out of office all day' });
      }

      availableTimes = generateTimeSlots(dayShift.start, dayShift.end);

      const partialOuts = dayOutTimes.filter(ot => !ot.allDay && ot.start && ot.end);
      for (const po of partialOuts) {
        availableTimes = availableTimes.filter(t => {
          const tm = timeToMinutes(t);
          return tm < timeToMinutes(po.start) || tm >= timeToMinutes(po.end);
        });
      }
    } else {
      availableTimes = generateTimeSlots('09:00', '19:00');
    }

    const appointments = await Appointment.find(
      { date: normalizeDateFilter(date), status: { $ne: 'cancelled' } },
      'time'
    );
    const bookedTimes = appointments.map(a => a.time);

    res.json({ date, availableTimes, bookedTimes, outTimes });
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (date) {
      filter.date = normalizeDateFilter(date);
    }

    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { patientName, patientPhone, date, time } = req.body;

    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ message: 'Patient name is required' });
    }

    if (patientPhone) {
      const phoneError = validatePhone(patientPhone);
      if (phoneError) {
        return res.status(400).json({ message: phoneError });
      }
    }

    const dateError = validateNotPast(date);
    if (dateError) {
      return res.status(400).json({ message: dateError });
    }

    const conflict = await checkTimeConflict(date, time);
    if (conflict) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    const appointment = await Appointment.create(normalizeAppointmentPayload(req.body));

    const patientEmail = req.body.patientEmail;
    const service = req.body.service;
    const description = req.body.description;

    function formatDate(de) {
      const d = new Date(de + 'T12:00:00');
      return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
    }

    const formattedDate = formatDate(date);
    const subject = 'Du hast eine neue Buchung';
    const text = [
      `Du hast eine neue Buchung`,
      ``,
      `Wir haben gute Nachrichten: Jemand hat soeben einen deiner Services gebucht.`,
      ``,
      `Kundenangaben`,
      `Name:`,
      `${patientName}`,
      ``,
      `E-Mail-Adresse:`,
      `${patientEmail || '-'}`,
      ``,
      `Telefonnummer:`,
      `${patientPhone || '-'}`,
      ``,
      `Nachricht hinzufügen:`,
      `${description || '-'}`,
      ``,
      `Ich stimme der Datenschutzerklärung zu:`,
      `Checked`,
      ``,
      `${service || '-'}`,
      `Uhrzeit:`,
      `${formattedDate} um ${time} MESZ`,
      ``,
      `Standort:`,
      `Schanzstraße 105, 67063 Ludwigshafen am Rhein, Germany`,
      ``,
      `Mitarbeiter:`,
      `Dr. Johnny Najmeh`,
    ].join('\n');
    const html = [
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">`,
      `<h2 style="color:#d13f00">Du hast eine neue Buchung</h2>`,
      `<p>Wir haben gute Nachrichten: Jemand hat soeben einen deiner Services gebucht.</p>`,
      `<hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>`,
      `<h3 style="font-size:1rem;font-weight:600;margin:0 0 8px">Kundenangaben</h3>`,
      `<table style="border-collapse:collapse;width:100%">`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Name:</td><td style="padding:4px 8px">${patientName}</td></tr>`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">E-Mail-Adresse:</td><td style="padding:4px 8px">${patientEmail || '-'}</td></tr>`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Telefonnummer:</td><td style="padding:4px 8px">${patientPhone || '-'}</td></tr>`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Nachricht hinzufügen:</td><td style="padding:4px 8px">${description || '-'}</td></tr>`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Datenschutzerklärung:</td><td style="padding:4px 8px">Checked</td></tr>`,
      `</table>`,
      `<hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>`,
      `<p style="font-size:1.1rem;font-weight:600;margin:0 0 4px">${service || '-'}</p>`,
      `<table style="border-collapse:collapse;width:100%">`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Uhrzeit:</td><td style="padding:4px 8px">${formattedDate} um ${time} MESZ</td></tr>`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Standort:</td><td style="padding:4px 8px">Schanzstraße 105, 67063 Ludwigshafen am Rhein, Germany</td></tr>`,
      `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Mitarbeiter:</td><td style="padding:4px 8px">Dr. Johnny Najmeh</td></tr>`,
      `</table>`,
      `<p style="margin-top:16px;font-weight:600">Price:</p>`,
      `<p style="margin:0">Kostenfallabhängig</p>`,
      `</div>`,
    ].join('');

    const mailOptions = {
      from: `"Zahnarztpraxis Dr Johnny Najmeh" <info@zahnarztjohnny.com>`,
      to: APPOINTMENT_RECEIVER_EMAIL,
      subject,
      text,
      html,
    };

      await getAppointmentTransporter().sendMail(mailOptions).catch(err => {
      console.error('Appointment email send failed:', err);
      console.log('Appointment notification (fallback):', { patientName, patientEmail, patientPhone, date, time, service, description });
    });

    if (patientEmail) {
      const patientSubject = 'Ihr Termin wurde reserviert';
      const patientText = [
        `Sehr geehrte(r) ${patientName},`,
        ``,
        `Ihr Termin bei Zahnarzt Johnny Najmeh wurde erfolgreich reserviert.`,
        ``,
        `Termindetails:`,
        `Service: ${service || '-'}`,
        `Datum: ${formattedDate}`,
        `Uhrzeit: ${time} MESZ`,
        `Standort: Schanzstraße 105, 67063 Ludwigshafen am Rhein, Germany`,
        ``,
        `Wir freuen uns auf Ihren Besuch!`,
        ``,
        `Mit freundlichen Grüßen,`,
        `Ihr Team von Zahnarzt Johnny Najmeh`,
      ].join('\n');
      const patientHtml = [
        `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">`,
        `<h2 style="color:#d13f00">Ihr Termin wurde reserviert</h2>`,
        `<p>Sehr geehrte(r) ${patientName},</p>`,
        `<p>Ihr Termin bei Zahnarzt Johnny Najmeh wurde erfolgreich reserviert.</p>`,
        `<hr style="border:none;border-top:1px solid #eee;margin:20px 0"/>`,
        `<h3 style="font-size:1rem;font-weight:600;margin:0 0 8px">Termindetails</h3>`,
        `<table style="border-collapse:collapse;width:100%">`,
        `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Service:</td><td style="padding:4px 8px">${service || '-'}</td></tr>`,
        `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Datum:</td><td style="padding:4px 8px">${formattedDate}</td></tr>`,
        `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Uhrzeit:</td><td style="padding:4px 8px">${time} MESZ</td></tr>`,
        `<tr><td style="padding:4px 8px;font-weight:600;white-space:nowrap;vertical-align:top">Standort:</td><td style="padding:4px 8px">Schanzstraße 105, 67063 Ludwigshafen am Rhein, Germany</td></tr>`,
        `</table>`,
        `<p>Wir freuen uns auf Ihren Besuch!</p>`,
        `<p>Mit freundlichen Grüßen,<br/>Ihr Team von Zahnarzt Johnny Najmeh</p>`,
        `</div>`,
      ].join('');

      const patientMailOptions = {
        from: `"Zahnarztpraxis Dr Johnny Najmeh" <info@zahnarztjohnny.com>`,
        to: patientEmail,
        subject: patientSubject,
        text: patientText,
        html: patientHtml,
      };

      await getAppointmentTransporter().sendMail(patientMailOptions).catch(err => {
        console.error('Patient confirmation email send failed:', err);
      });
    }

    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { patientPhone, date, time } = req.body;

    if (patientPhone) {
      const phoneError = validatePhone(patientPhone);
      if (phoneError) {
        return res.status(400).json({ message: phoneError });
      }
    }

    if (date) {
      const dateError = validateNotPast(date);
      if (dateError) {
        return res.status(400).json({ message: dateError });
      }
    }

    if (date && time) {
      const conflict = await checkTimeConflict(date, time, req.params.id);
      if (conflict) {
        return res.status(409).json({ message: 'This time slot is already booked' });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, normalizeAppointmentPayload(req.body), {
      new: true,
      runValidators: true,
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/bulk-delete', async (req, res, next) => {
  try {
    const ids = req.body.ids || [];
    await Appointment.deleteMany({ _id: { $in: ids } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

router.post('/bulk-approve', async (req, res, next) => {
  try {
    const ids = req.body.ids || [];
    await Appointment.updateMany({ _id: { $in: ids } }, { status: 'confirmed' });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
