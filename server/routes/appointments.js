import express from 'express';
import nodemailer from 'nodemailer';
import { Appointment } from '../models/Appointment.js';
import { Availability } from '../models/Availability.js';

const router = express.Router();

const APPOINTMENT_RECEIVER_EMAIL = 'Info.za.johnny@gmail.com';

const appointmentTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

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

    const phoneError = validatePhone(patientPhone);
    if (phoneError) {
      return res.status(400).json({ message: phoneError });
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

    const { patientName, patientEmail, patientPhone, date, time, service } = req.body;
    const subject = `Nuevo turno reservado: ${patientName} – ${service || 'Sin servicio'}`;
    const text = [
      `Se ha registrado un nuevo turno en la web:`,
      ``,
      `Paciente: ${patientName}`,
      `E-mail: ${patientEmail || '-'}`,
      `Teléfono: ${patientPhone || '-'}`,
      `Fecha: ${date}`,
      `Hora: ${time}`,
      `Servicio: ${service || '-'}`,
    ].join('\n');
    const html = [
      `<h2>Nuevo turno reservado</h2>`,
      `<table style="border-collapse:collapse;width:100%">`,
      `<tr><td style="padding:8px;font-weight:600">Paciente</td><td style="padding:8px">${patientName}</td></tr>`,
      `<tr><td style="padding:8px;font-weight:600">E-mail</td><td style="padding:8px">${patientEmail || '-'}</td></tr>`,
      `<tr><td style="padding:8px;font-weight:600">Teléfono</td><td style="padding:8px">${patientPhone || '-'}</td></tr>`,
      `<tr><td style="padding:8px;font-weight:600">Fecha</td><td style="padding:8px">${date}</td></tr>`,
      `<tr><td style="padding:8px;font-weight:600">Hora</td><td style="padding:8px">${time}</td></tr>`,
      `<tr><td style="padding:8px;font-weight:600">Servicio</td><td style="padding:8px">${service || '-'}</td></tr>`,
      `</table>`,
    ].join('');

    const mailOptions = {
      from: `"Sistema de Turnos" <${process.env.SMTP_USER || 'noreply@example.com'}>`,
      to: APPOINTMENT_RECEIVER_EMAIL,
      subject,
      text,
      html,
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await appointmentTransporter.sendMail(mailOptions).catch(err => {
        console.error('Appointment email send failed:', err);
      });
    } else {
      console.log('Appointment notification (SMTP not configured):', { patientName, patientEmail, patientPhone, date, time, service });
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
