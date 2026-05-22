import express from 'express';
import { Settings } from '../models/Settings.js';

const router = express.Router();

async function getOrCreateSettings() {
  const existing = await Settings.findOne();

  if (existing) {
    return existing;
  }

  return Settings.create({
    workingHours: { start: '08:00', end: '20:00' },
    breakStart: '13:00',
    breakEnd: '14:00',
    holidays: [],
  });
}

router.get('/', async (_req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const current = await getOrCreateSettings();
    current.workingHours = req.body.workingHours;
    current.breakStart = req.body.breakStart;
    current.breakEnd = req.body.breakEnd;
    current.holidays = req.body.holidays || [];
    await current.save();
    res.json(current);
  } catch (error) {
    next(error);
  }
});

export default router;
