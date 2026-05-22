import { useState } from 'react';
import { Loader2, Phone } from 'lucide-react';
import CenteredCard from '../components/CenteredCard';
import FormField from '../components/FormField';
import PageHero from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';
import { contactApi } from '../services/api';

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await contactApi.send(formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHero
        invert
        title={t({ de: 'Kontakt', en: 'Contact' })}
        description={t({
          de: 'Wir beantworten Ihre Fragen und helfen Ihnen gerne bei der Terminplanung.',
          en: 'We are here to answer your questions and help with scheduling.',
        })}
      />

      <section className="section">
        <div className="container">
          <div className="split-layout" style={{ alignItems: 'start' }}>
            <CenteredCard>
              <div style={{ padding: '32px' }}>
                <h2 className="heading-section">{t({ de: 'Nachricht senden', en: 'Send a Message' })}</h2>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                  <div className="form-grid-2">
                    <FormField label={t({ de: 'Name', en: 'Name' })} value={formData.name} onChange={handleChange('name')} required />
                    <FormField label="E-Mail" type="email" value={formData.email} onChange={handleChange('email')} required />
                  </div>
                  <div className="form-grid-2">
                    <FormField label={t({ de: 'Telefon', en: 'Phone' })} value={formData.phone} onChange={handleChange('phone')} />
                    <FormField label={t({ de: 'Betreff', en: 'Subject' })} value={formData.subject} onChange={handleChange('subject')} required />
                  </div>
                  <FormField as="textarea" label={t({ de: 'Nachricht', en: 'Message' })} value={formData.message} onChange={handleChange('message')} rows="6" required />
                  {status === 'success' && (
                    <div style={{ color: '#15803d', fontSize: 14 }}>
                      {t({ de: 'Danke! Ihre Nachricht wurde gesendet.', en: 'Thank you! Your message has been sent.' })}
                    </div>
                  )}
                  {status === 'error' && (
                    <div style={{ color: '#dc2626', fontSize: 14 }}>
                      {t({ de: 'Fehler beim Senden. Bitte rufen Sie uns an.', en: 'Error sending. Please call us.' })}
                    </div>
                  )}
                  <button type="submit" className="pill" style={{ border: 0, background: 'var(--primary)', color: '#fff', justifyContent: 'center' }} disabled={submitting}>
                    {submitting ? t({ de: 'Sende...', en: 'Sending...' }) : t({ de: 'Nachricht senden', en: 'Send Message' })}
                  </button>
                </form>
              </div>
            </CenteredCard>

            <div style={{ display: 'grid', gap: '24px' }}>
              <CenteredCard>
                <iframe
                  title={t({ de: 'Karte Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh map' })}
                  src="https://www.google.com/maps?q=Sundgauallee%2015%20Freiburg&z=15&output=embed"
                  style={{ width: '100%', height: '320px', border: 0 }}
                  loading="lazy"
                />
              </CenteredCard>
              <CenteredCard>
                <div style={{ padding: '28px' }}>
                  <h3 style={{ marginTop: 0, fontFamily: 'var(--font-serif)', fontSize: '1.8rem' }}>{t({ de: 'Taegliche Notfallfenster', en: 'Daily Emergency Slots' })}</h3>
                  <p className="lead">{t({ de: 'Bei akuten Beschwerden rufen Sie uns bitte direkt an.', en: 'For urgent dental issues, please call us directly.' })}</p>
                  <a href="tel:+497612345678" className="pill" style={{ background: 'var(--primary)', color: '#fff', width: 'fit-content' }}>
                    <Phone size={18} />
                    +49 761 234 5678
                  </a>
                </div>
              </CenteredCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
