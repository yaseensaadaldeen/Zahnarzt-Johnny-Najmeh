import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import appointmentsRouter from './routes/appointments.js';
import settingsRouter from './routes/settings.js';
import authRouter from './routes/auth.js';
import availabilityRouter from './routes/availability.js';
import contactRouter from './routes/contact.js';
import { errorHandler } from './middleware/errorHandler.js';
import { Settings } from './models/Settings.js';
import { getOrCreateAvailability } from './models/Availability.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/appointments', appointmentsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter);
app.use('/api/availability', availabilityRouter);
app.use('/api/contact', contactRouter);
app.use(errorHandler);

async function seedSettings() {
  const settingsCount = await Settings.countDocuments();
  if (settingsCount === 0) {
    await Settings.create({
      workingHours: { start: '08:00', end: '20:00' },
      breakStart: '13:00',
      breakEnd: '14:00',
      holidays: [new Date('2026-12-25'), new Date('2026-12-26')],
    });
  }
}

async function connectDatabase() {
  if (process.env.MONGODB_URI) {
    await mongoose.connect(process.env.MONGODB_URI);
    return;
  }

  const memoryServer = await MongoMemoryServer.create();
  await mongoose.connect(memoryServer.getUri());
}

async function startServer() {
  try {
    await connectDatabase();
    await seedSettings();
    await getOrCreateAvailability();

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();
