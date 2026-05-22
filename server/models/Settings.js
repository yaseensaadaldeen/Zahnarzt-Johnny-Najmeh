import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    workingHours: {
      start: {
        type: String,
        default: '08:00',
      },
      end: {
        type: String,
        default: '20:00',
      },
    },
    breakStart: {
      type: String,
      default: '13:00',
    },
    breakEnd: {
      type: String,
      default: '14:00',
    },
    holidays: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
