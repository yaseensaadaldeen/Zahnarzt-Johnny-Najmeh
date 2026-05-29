import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Shield, Smile, Sparkles, Star } from 'lucide-react';
import { services, testimonials } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

const serviceIcons = { Shield, Sparkles, Heart, Smile };

export default function HomePage() {
  const { t } = useLanguage();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <div>
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '100vh',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <img
            src="/images/5d64f5_1950d7baa2c34d36b9ef9ff86e026a7b~mv2.jpg"
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px 40px',
            background: '#fff',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 500 }}>
            <p
              style={{
                fontSize: 50,
                fontFamily: 'var(--font-sans)',
                color: '#000',
                margin: '0 0 8px',
                lineHeight: 1.1,
              }}
            >
              {t({ de: 'Willkommen in der Zahnarztpraxis', en: 'Welcome to the Dental Practice' })}
            </p>
            <h1
              style={{
                fontSize: 30,
                fontFamily: 'var(--font-sans)',
                color: '#000',
                margin: '0 0 32px',
                fontWeight: 400,
              }}
            >
              {t({ de: 'Johnny Najmeh', en: 'Johnny Najmeh' })}
            </h1>
            <Link
              to="/contact"
              style={{
                display: 'inline-block',
                background: '#993500',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 16,
                textDecoration: 'none',
              }}
            >
              {t({ de: 'Termin Buchen', en: 'Book Appointment' })}
            </Link>
            <p
              style={{
                fontSize: 16,
                color: '#000',
                marginTop: 24,
                marginBottom: 0,
              }}
            >
              {t({ de: 'Wir sind jeden Tag der Woche für Sie da', en: 'We are here for you every day of the week' })}
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="text-center" style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 className="heading-section">{t({ de: 'Unsere Praxis', en: 'Our Practice' })}</h2>
            <p className="lead">
              {t({
                de: 'Entdecken Sie eine Praxis, die mit modernster Technologie und einem einladenden Ambiente dafür sorgt, dass Sie sich bei jedem Besuch wohl fühlen.',
                en: 'Discover a practice that uses cutting-edge technology and a welcoming atmosphere to ensure you feel comfortable at every visit.',
              })}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--gradient">
        <div className="container">
          <div className="grid-3">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon];
              return (
                <div key={service.id} className="surface-card" style={{ padding: '28px', textAlign: 'center' }}>
                  {Icon && (
                    <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                      <Icon size={42} />
                    </div>
                  )}
                  <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>{t(service.category)}</h3>
                  <p className="muted" style={{ margin: '0 0 16px', lineHeight: 1.7 }}>{t(service.description)}</p>
                  <Link to={`/services/${service.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    {t({ de: 'Mehr erfahren', en: 'Learn more' })}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="split-layout">
            <div className="surface-card" style={{ padding: '32px' }}>
              <span className="eyebrow"><MapPin size={16} /> Ludwigshafen am Rhein</span>
              <h2 className="heading-section" style={{ marginTop: '20px' }}>
                {t({ de: 'Standort und Anfahrt', en: 'Location & Directions' })}
              </h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                <div><strong>Schanzstraße 105, 67063 Ludwigshafen am Rhein</strong></div>
                <div className="muted">{t({ de: 'Mit dem Auto: Kostenlose Parkplaetze hinter der Praxis.', en: 'By car: Free parking behind the clinic.' })}</div>
                <div className="muted">{t({ de: 'Mit der Strassenbahn: Gute Anbindung an den oeffentlichen Nahverkehr.', en: 'By tram: Well connected to public transit.' })}</div>
                <div className="muted">{t({ de: 'Zu Fuss: Zentrale Lage mit guter Erreichbarkeit.', en: 'On foot: Central location with easy accessibility.' })}</div>
                <Link to="/location" className="pill" style={{ background: 'var(--primary)', color: '#fff', width: 'fit-content' }}>
                  {t({ de: 'Route ansehen', en: 'View Directions' })}
                </Link>
              </div>
            </div>
            <div className="surface-card">
              <iframe
                title={t({ de: 'Zahnarzt Johnny Najmeh Karte', en: 'Dentist Johnny Najmeh map' })}
                src="https://www.google.com/maps?q=Schanzstrasse%20105%20Ludwigshafen&z=15&output=embed"
                style={{ width: '100%', minHeight: '420px', border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--gradient">
        <div className="container">
          <div className="surface-card">
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={20} fill="var(--accent)" color="var(--accent)" />
                ))}
              </div>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.8, maxWidth: 780, margin: '0 auto 16px' }}>
                &ldquo;{t(testimonials[activeTestimonial].quote)}&rdquo;
              </p>
              <strong style={{ color: 'var(--primary)' }}>{testimonials[activeTestimonial].author}</strong>
              <div className="button-row" style={{ justifyContent: 'center', marginTop: '24px' }}>
                <button
                  type="button"
                  className="pill"
                  style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}
                  onClick={() => setActiveTestimonial((v) => (v === 0 ? testimonials.length - 1 : v - 1))}
                >
                  {t({ de: 'Zurueck', en: 'Previous' })}
                </button>
                <button
                  type="button"
                  className="pill"
                  style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}
                  onClick={() => setActiveTestimonial((v) => (v === testimonials.length - 1 ? 0 : v + 1))}
                >
                  {t({ de: 'Weiter', en: 'Next' })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
