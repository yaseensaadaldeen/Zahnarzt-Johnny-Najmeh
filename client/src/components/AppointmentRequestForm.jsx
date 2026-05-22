import { useEffect, useState } from 'react';
import FormField from './FormField';
import { services } from '../data/siteContent';
import { appointmentsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { requestNotificationPermission, notifyBookingConfirmation, storeAppointment } from '../services/notificationService';

const PHONE_REGEX = /^[\+\d][\d\s\-\(\)\.]{6,20}$/;

const todayStr = () => new Date().toISOString().split('T')[0];

const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

const initialBookingState = {
  service: '',
  date: '',
  time: '',
  patientName: '',
  patientPhone: '',
  patientEmail: '',
};

export default function AppointmentRequestForm({ defaultService = '', onSuccess }) {
  const { t } = useLanguage();
  const [booking, setBooking] = useState(() => ({
    ...initialBookingState,
    service: defaultService,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState(timeSlots);

  useEffect(() => {
    setBooking((current) => ({
      ...current,
      service: current.service || defaultService,
    }));
  }, [defaultService]);

  useEffect(() => {
    if (!booking.date) {
      setBookedTimes([]);
      setAvailableTimes(timeSlots);
      return;
    }
    const load = async () => {
      try {
        const data = await appointmentsApi.getTimeslots(booking.date);
        setAvailableTimes(data.availableTimes || timeSlots);
        setBookedTimes(data.bookedTimes);
        if (data.bookedTimes.includes(booking.time)) {
          setBooking((current) => ({ ...current, time: '' }));
        }
      } catch {
        setBookedTimes([]);
        setAvailableTimes(timeSlots);
      }
    };
    load();
  }, [booking.date]);

  const handleChange = (field, value) => {
    if (field === 'date') {
      setBooking((current) => ({ ...current, date: value, time: '' }));
    } else {
      setBooking((current) => ({ ...current, [field]: value }));
    }
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    return PHONE_REGEX.test(phone);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');

    if (!validatePhone(booking.patientPhone)) {
      setMessage(
        t({
          de: 'Bitte geben Sie eine gültige Telefonnummer ein (z.B. +49 123 456 7890)',
          en: 'Please enter a valid phone number (e.g. +49 123 456 7890)',
        })
      );
      setSubmitting(false);
      return;
    }

    try {
      const created = await appointmentsApi.create({
        patientName: booking.patientName,
        patientEmail: booking.patientEmail,
        patientPhone: booking.patientPhone,
        date: booking.date,
        time: booking.time,
        service: booking.service,
      });

      requestNotificationPermission();
      notifyBookingConfirmation(booking.service, booking.date, booking.time);
      storeAppointment({ id: created._id, date: booking.date, time: booking.time, service: booking.service });

      setBooking({
        ...initialBookingState,
        service: defaultService,
      });
      setMessage(
        t({
          de: 'Vielen Dank. Ihre Terminanfrage wurde gespeichert.',
          en: 'Thank you. Your appointment request has been saved.',
        })
      );
      onSuccess?.();
    } catch (err) {
      setMessage(
        err.message ||
          t({
            de: 'Die Anfrage konnte gerade nicht gespeichert werden.',
            en: 'The request could not be saved right now.',
          })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
      <div className="form-grid-3">
        <FormField
          as="select"
          label={t({ de: 'Leistung', en: 'Service' })}
          value={booking.service}
          onChange={(event) => handleChange('service', event.target.value)}
          required
        >
          <option value="">{t({ de: 'Leistung waehlen', en: 'Select service' })}</option>
          {services.map((service) => (
            <option key={service.id} value={t(service.title)}>
              {t(service.title)}
            </option>
          ))}
        </FormField>
        <FormField
          label={t({ de: 'Wunschdatum', en: 'Preferred Date' })}
          type="date"
          value={booking.date}
          min={todayStr()}
          onChange={(event) => handleChange('date', event.target.value)}
          required
        />
        <FormField
          as="select"
          label={t({ de: 'Wunschzeit', en: 'Preferred Time' })}
          value={booking.time}
          onChange={(event) => handleChange('time', event.target.value)}
          required
          disabled={!booking.date}
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
      <div className="form-grid-3">
        <FormField
          label={t({ de: 'Vollstaendiger Name', en: 'Full Name' })}
          value={booking.patientName}
          onChange={(event) => handleChange('patientName', event.target.value)}
          required
        />
        <FormField
          label={t({ de: 'Telefon', en: 'Phone' })}
          value={booking.patientPhone}
          onChange={(event) => handleChange('patientPhone', event.target.value)}
          required
        />
        <FormField
          label="E-Mail"
          type="email"
          value={booking.patientEmail}
          onChange={(event) => handleChange('patientEmail', event.target.value)}
          required
        />
      </div>
      {booking.patientPhone && !validatePhone(booking.patientPhone) && (
        <div className="muted" style={{ color: 'var(--error, #dc2626)', fontSize: '0.85em' }}>
          {t({
            de: 'Ungültiges Telefonformat',
            en: 'Invalid phone format',
          })}
        </div>
      )}
      <button
        type="submit"
        className="pill"
        style={{ border: 0, background: 'var(--primary)', color: '#fff', padding: '16px 18px', justifyContent: 'center' }}
        disabled={submitting}
      >
        {submitting ? t({ de: 'Speichert...', en: 'Saving...' }) : t({ de: 'Termin anfragen', en: 'Request Appointment' })}
      </button>
      {message ? <div className="muted">{message}</div> : null}
    </form>
  );
}
