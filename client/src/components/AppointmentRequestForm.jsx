import { useEffect, useState } from 'react';
import FormField from './FormField';
import { bookingServices, services } from '../data/siteContent';
import { appointmentsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const todayStr = () => new Date().toISOString().split('T')[0];

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function AppointmentRequestForm({ defaultService = '', onDateTimeSelected }) {
  const { t } = useLanguage();
  const [service, setService] = useState(defaultService);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState(timeSlots);

  useEffect(() => {
    setService((current) => current || defaultService);
  }, [defaultService]);

  useEffect(() => {
    if (!date) {
      setBookedTimes([]);
      setAvailableTimes(timeSlots);
      return;
    }
    const load = async () => {
      try {
        const data = await appointmentsApi.getTimeslots(date);
        setAvailableTimes(data.availableTimes || timeSlots);
        setBookedTimes(data.bookedTimes);
        if (data.bookedTimes.includes(time)) {
          setTime('');
        }
      } catch {
        setBookedTimes([]);
        setAvailableTimes(timeSlots);
      }
    };
    load();
  }, [date]);

  const handleDateChange = (value) => {
    setDate(value);
    setTime('');
  };

  const handleContinue = (event) => {
    event.preventDefault();
    if (service && date && time) {
      if (typeof onDateTimeSelected !== 'function') return;
      onDateTimeSelected({ service, date, time });
    }
  };

  const isValid = service && date && time;

  return (
    <form onSubmit={handleContinue} style={{ display: 'grid', gap: '16px' }}>
      <div className="form-grid-3">
        <FormField
          as="select"
          label={t({ de: 'Leistung', en: 'Service' })}
          value={service}
          onChange={(event) => setService(event.target.value)}
          required
        >
          <option value="">{t({ de: 'Leistung waehlen', en: 'Select service' })}</option>
          {[...bookingServices, ...services].map((s) => (
            <option key={s.id} value={t(s.title)}>
              {t(s.title)}
            </option>
          ))}
        </FormField>
        <FormField
          label={t({ de: 'Wunschdatum', en: 'Preferred Date' })}
          type="date"
          value={date}
          min={todayStr()}
          onChange={(event) => handleDateChange(event.target.value)}
          required
        />
        <FormField
          as="select"
          label={t({ de: 'Wunschzeit', en: 'Preferred Time' })}
          value={time}
          onChange={(event) => setTime(event.target.value)}
          required
          disabled={!date}
        >
          <option value="">{t({ de: 'Zeit waehlen', en: 'Select time' })}</option>
          {availableTimes.length === 0 ? (
            <option value="" disabled>{t({ de: 'Keine verfügbaren Zeiten', en: 'No available times' })}</option>
          ) : (
            availableTimes.map((slot) => {
              const isBooked = bookedTimes.includes(slot);
              return (
                <option key={slot} value={slot} disabled={isBooked}>
                  {slot}{isBooked ? ` (${t({ de: 'besetzt', en: 'booked' })})` : ''}
                </option>
              );
            })
          )}
        </FormField>
      </div>
      <button
        type="submit"
        className="pill"
        style={{ border: 0, background: '#0d5be1', color: '#fff', padding: '16px 18px', justifyContent: 'center' }}
        disabled={!isValid}
      >
        {t({ de: 'Weiter', en: 'Continue' })}
      </button>
    </form>
  );
}
