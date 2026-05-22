import express from 'express';
import { Availability, getOrCreateAvailability } from '../models/Availability.js';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const availability = await getOrCreateAvailability();
    res.json(availability);
  } catch (error) {
    next(error);
  }
});

router.put('/weekly', async (req, res, next) => {
  try {
    const availability = await getOrCreateAvailability();
    availability.weeklyShifts = req.body.weeklyShifts;
    await availability.save();
    res.json(availability);
  } catch (error) {
    next(error);
  }
});

router.post('/out-times', async (req, res, next) => {
  try {
    const availability = await getOrCreateAvailability();
    availability.outTimes.push(req.body);
    await availability.save();
    res.json(availability);
  } catch (error) {
    next(error);
  }
});

router.put('/out-times/:id', async (req, res, next) => {
  try {
    const availability = await getOrCreateAvailability();
    const outTime = availability.outTimes.id(req.params.id);
    if (!outTime) return res.status(404).json({ message: 'Out-time not found' });
    Object.assign(outTime, req.body);
    await availability.save();
    res.json(availability);
  } catch (error) {
    next(error);
  }
});

router.delete('/out-times/:id', async (req, res, next) => {
  try {
    const availability = await getOrCreateAvailability();
    availability.outTimes.pull({ _id: req.params.id });
    await availability.save();
    res.json(availability);
  } catch (error) {
    next(error);
  }
});

export default router;
