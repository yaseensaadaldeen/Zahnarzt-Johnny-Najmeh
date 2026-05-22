import mongoose from 'mongoose';

const weeklyShiftSchema = new mongoose.Schema({
  dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
  start: { type: String, required: true },
  end: { type: String, required: true },
  enabled: { type: Boolean, default: true },
}, { _id: true });

const outTimeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  reason: { type: String, default: '' },
  allDay: { type: Boolean, default: true },
  start: { type: String },
  end: { type: String },
}, { _id: true });

const availabilitySchema = new mongoose.Schema({
  weeklyShifts: [weeklyShiftSchema],
  outTimes: [outTimeSchema],
}, { timestamps: true });

async function getOrCreateAvailability() {
  const existing = await Availability.findOne();
  if (existing) return existing;
  return Availability.create({
    weeklyShifts: [
      { dayOfWeek: 1, start: '09:00', end: '19:00', enabled: true },
      { dayOfWeek: 2, start: '09:00', end: '19:00', enabled: true },
      { dayOfWeek: 3, start: '09:00', end: '19:00', enabled: true },
      { dayOfWeek: 4, start: '09:00', end: '19:00', enabled: true },
      { dayOfWeek: 5, start: '09:00', end: '19:00', enabled: true },
      { dayOfWeek: 6, start: '09:00', end: '14:00', enabled: true },
    ],
    outTimes: [],
  });
}

export { getOrCreateAvailability };
export const Availability = mongoose.model('Availability', availabilitySchema);
