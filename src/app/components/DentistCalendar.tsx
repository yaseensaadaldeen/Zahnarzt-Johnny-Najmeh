import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card } from './Card';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { appointmentsApi } from '../services/api';

interface Appointment {
  time: string;
  service: string;
}

interface DayAppointments {
  [key: string]: Appointment[];
}

export function DentistCalendar({ refreshKey = 0 }: { refreshKey?: number }) {
  const { t } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<DayAppointments>({});

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await appointmentsApi.getPublic();
        const grouped: DayAppointments = {};
        for (const apt of data) {
          const day = new Date(apt.date).getDate().toString();
          if (!grouped[day]) grouped[day] = [];
          grouped[day].push({ time: apt.time, service: apt.service });
        }
        setAppointments(grouped);
      } catch {
        setAppointments({});
      }
    };
    loadAppointments();
  }, [refreshKey]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    setSelectedDay(null);
  };

  const monthName = currentDate.toLocaleDateString(t('de-DE', 'en-US'), { month: 'long', year: 'numeric' });

  const hasAppointments = (day: number) => {
    return appointments[day.toString()];
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-semibold">
          {t('Aktuelle Verfügbarkeit – Zahnarzt Johnny', 'Current Availability – Dentist Johnny')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={previousMonth}
            className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold min-w-[180px] text-center">{monthName}</span>
          <button
            onClick={nextMonth}
            className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {[t('Mo', 'Mon'), t('Di', 'Tue'), t('Mi', 'Wed'), t('Do', 'Thu'), t('Fr', 'Fri'), t('Sa', 'Sat'), t('So', 'Sun')].map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayApps = hasAppointments(day);
          const isSelected = selectedDay === day;

          return (
            <motion.button
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative transition-all ${
                isSelected
                  ? 'border-primary bg-primary text-white'
                  : dayApps
                  ? 'border-primary/30 bg-primary/5 hover:border-primary/50'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <span className="text-sm font-medium">{day}</span>
              {dayApps && (
                <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                  isSelected ? 'bg-white' : 'bg-primary'
                }`} />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedDay && appointments[selectedDay.toString()] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t"
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon size={20} className="text-primary" />
              <h4 className="font-semibold">
                {t('Termine am', 'Appointments on')} {selectedDay}. {monthName.split(' ')[0]}
              </h4>
            </div>
            <div className="space-y-3">
              {appointments[selectedDay.toString()].map((appointment, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">{appointment.time}</span>
                    <span className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                      {appointment.service}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
        {t(
          'Punkte zeigen Tage mit Terminen an. Klicken Sie auf einen Tag, um Details zu sehen.',
          'Dots indicate days with appointments. Click a day to see details.'
        )}
      </div>
    </Card>
  );
}
