import { useState } from 'react';
import { Link } from 'react-router-dom';
import { appointmentsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { requestNotificationPermission, notifyBookingConfirmation, storeAppointment } from '../services/notificationService';
import CountryCodeSelect from './CountryCodeSelect';
import styles from './BookingForm.module.css';

const PHONE_REGEX = /^[\d\s\-\(\)\.]{4,20}$/;

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T12:00:00');
    return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr || '';
  }
}

export default function BookingForm({ booking, serviceData, onBack, onDone }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+49');
  const [phoneDigits, setPhoneDigits] = useState(11);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [privacy, setPrivacy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const phonePlaceholder = `${'0'.repeat(Math.min(phoneDigits, 4))} ${'0'.repeat(Math.max(phoneDigits - 4, 4)).slice(0, 4)} ${'0'.repeat(Math.max(phoneDigits - 8, 0))}`.trim();
  const digitsOnly = phone.replace(/\D/g, '');

  const validatePhone = () => {
    if (!phone.trim()) return true;
    return digitsOnly.length >= Math.min(phoneDigits - 1, 6) && digitsOnly.length <= phoneDigits;
  };

  const clearFieldError = (field) => {
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const errors = {};

    if (!name.trim()) {
      errors.name = t({ de: 'Bitte geben Sie Ihren Namen ein.', en: 'Please enter your name.' });
    }
    if (!email.trim()) {
      errors.email = t({ de: 'Bitte geben Sie Ihre E-Mail-Adresse ein.', en: 'Please enter your email address.' });
    }
    if (!privacy) {
      errors.privacy = t({ de: 'Bitte stimmen Sie der Datenschutzerklaerung zu.', en: 'Please agree to the privacy policy.' });
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setSubmitting(true);
    try {
      const created = await appointmentsApi.create({
        patientName: name.trim(),
        patientEmail: email.trim(),
        patientPhone: phone.trim() ? `${countryCode} ${phone.trim()}` : '',
        date: booking.date,
        time: booking.time,
        service: booking.service,
        description: message.trim(),
      });

      requestNotificationPermission();
      notifyBookingConfirmation(booking.service, booking.date, booking.time);
      storeAppointment({ id: created._id, date: booking.date, time: booking.time, service: booking.service });

      onDone?.({
        name: name.trim(),
        email: email.trim(),
        phone,
        date: booking.date,
        time: booking.time,
        service: booking.service,
      });
    } catch (err) {
      setError(
        err.message ||
          t({
            de: 'Die Buchung konnte nicht gespeichert werden.',
            en: 'The booking could not be saved.',
          })
      );
    } finally {
      setSubmitting(false);
    }
  };

  const serviceTitle = booking.service;
  const serviceInfo = serviceData || {};

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>{t({ de: 'Buchtungsformular', en: 'Booking Form' })}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t({ de: 'Kundendetails', en: 'Customer Details' })}</h3>
            <p className={styles.helper}>
              {t({ de: 'Wir benötigen einige Kontaktangaben und weitere Infos.', en: 'We need some contact details and further information.' })}
            </p>
            <Link to="/login" className={styles.loginLink}>
              {t({ de: 'Konto bereits vorhanden? Anmelden', en: 'Already have an account? Log in' })}
            </Link>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                {t({ de: 'Name *', en: 'Name *' })}
                <input
                  type="text"
                  className={`${styles.input}${fieldErrors.name ? ` ${styles.inputError}` : ''}`}
                  value={name}
                  onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                  placeholder={t({ de: 'Name', en: 'Name' })}
                  required
                />
                {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
              </label>

              <label className={styles.label}>
                {t({ de: 'E-Mail-Adresse *', en: 'Email Address *' })}
                <input
                  type="email"
                  className={`${styles.input}${fieldErrors.email ? ` ${styles.inputError}` : ''}`}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                  placeholder={t({ de: 'E-Mail', en: 'Email' })}
                  required
                />
                {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
              </label>

              <label className={styles.label}>
                {t({ de: 'Telefonnummer', en: 'Phone Number' })}
                <div className={`${styles.phoneRow}${fieldErrors.phone ? ` ${styles.inputError}` : ''}`}>
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} onDigitsChange={setPhoneDigits} />
                  <input
                    type="tel"
                    className={styles.phoneInput}
                    value={phone}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '');
                      if (raw.length <= phoneDigits) setPhone(e.target.value);
                      clearFieldError('phone');
                    }}
                    placeholder={phonePlaceholder}
                  />
                </div>
                {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
              </label>
              <p className={styles.hint}>{t({ de: `Bitte eine Telefonnummer eingeben (max. ${phoneDigits} Ziffern).`, en: `Please enter a phone number (max ${phoneDigits} digits).` })}</p>

              <label className={styles.label}>
                {t({ de: 'Nachricht hinzufügen', en: 'Add a message' })}
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t({ de: 'Nachricht hinzufügen', en: 'Add a message' })}
                  rows={3}
                />
              </label>

              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={(e) => { setPrivacy(e.target.checked); clearFieldError('privacy'); }}
                />
                <span>{t({ de: 'Ich stimme der Datenschutzerklärung zu', en: 'I agree to the privacy policy' })}</span>
              </label>
              {fieldErrors.privacy && <span className={styles.fieldError} style={{ marginTop: -8 }}>{fieldErrors.privacy}</span>}
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t({ de: 'Buchungsdetails', en: 'Booking Details' })}</h3>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>{serviceTitle}</span>
              <span className={styles.detailValue}>{formatDate(booking.date)} um {booking.time}</span>
              <span className={styles.moreInfo}>{t({ de: 'Mehr Info', en: 'More Info' })}</span>
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>{t({ de: 'Zahlungsdetails', en: 'Payment Details' })}</h3>
            <p className={styles.price}>{serviceInfo.price ? t(serviceInfo.price) : t({ de: 'Kostenfallabhängig', en: 'Depends on case' })}</p>
          </section>

          <p className={styles.agreement}>
            {t({ de: 'Mit Abschluss der Buchung wird dem Erhalt zugehöriger Telefonbenachrichtigungen zugestimmt.', en: 'By completing the booking, you agree to receive related telephone notifications.' })}
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting
              ? t({ de: 'Wird gebucht...', en: 'Booking...' })
              : t({ de: 'Sofort buchen', en: 'Book Now' })}
          </button>
        </form>

        <button type="button" className={styles.backButton} onClick={onBack}>
          {t({ de: 'Zurück zur Terminauswahl', en: 'Back to date selection' })}
        </button>
      </div>
    </div>
  );
}
