import { Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <div className="container">
        <h2 className="heading-section">{t({ de: 'Kontakt', en: 'Contact' })}</h2>
        <div className="split-layout" style={{ alignItems: 'start' }}>
          <div className="surface-card" style={{ padding: '32px' }}>
            <h3 style={{ marginTop: 0, fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>
              {t({ de: 'Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}
            </h3>
            <p style={{ lineHeight: 1.8 }}>
              Schanzstraße 105<br />
              67063 Ludwigshafen am Rhein<br />
              <a href="tel:+491622731687" style={{ color: 'var(--primary)', textDecoration: 'none' }}>+49 162 2731687</a><br />
              <a href="mailto:info.za.johnny@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'none' }}>info.za.johnny@gmail.com</a>
            </p>
            <a href="tel:+491622731687" className="pill" style={{ background: 'var(--primary)', color: '#fff', width: 'fit-content', marginTop: '8px' }}>
              <Phone size={18} />
              +49 162 2731687
            </a>
          </div>
          <div className="surface-card" style={{ overflow: 'hidden' }}>
            <iframe
              title={t({ de: 'Karte Zahnarzt Johnny Najmeh', en: 'Map Dentist Johnny Najmeh' })}
              src="https://www.google.com/maps?q=Schanzstrasse%20105%20Ludwigshafen&z=15&output=embed"
              style={{ width: '100%', height: '400px', border: 0, display: 'block' }}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
