import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import styles from './Footer.module.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const quickLinks = [
    { to: '/impressum', label: { de: 'Impressum', en: 'Impressum' } },
    { to: '/datenschutz', label: { de: 'Datenschutz', en: 'Privacy' } },
    { to: '/services', label: { de: 'Leistungen', en: 'Services' } },
    { to: '/contact', label: { de: 'Termin Buchen', en: 'Book Appointment' } },
  ];
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Schanzstrasse+105,+67063+Ludwigshafen+am+Rhein';
  const mapsUrl = 'https://maps.google.com/?q=Schanzstrasse+105+Ludwigshafen';

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <h3 className={styles.title}>{t({ de: 'Zahnarztpraxis Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}</h3>
          <ul className={styles.contactList}>
            <li>
              <MapPin size={18} />
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.footerLink}>
                Schanzstraße 105, 67063 Ludwigshafen am Rhein
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className={styles.subtitle}>{t({ de: 'Kontakt', en: 'Contact' })}</h4>
          <ul className={styles.contactList}>
            <li>
              <Phone size={18} />
              <a href="tel:+491622731687" className={styles.footerLink}>+49 162 2731687</a>
            </li>
            <li>
              <Mail size={18} />
              <a href="mailto:info.za.johnny@gmail.com" className={styles.footerLink}>info.za.johnny@gmail.com</a>
            </li>
          </ul>
          <div className={styles.actions}>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className={styles.actionButton}>
              {t({ de: 'Route starten', en: 'Get Directions' })}
            </a>
          </div>
        </div>

        <div>
          <h4 className={styles.subtitle}>{t({ de: 'Quick Links', en: 'Quick Links' })}</h4>
          <ul className={styles.list}>
            {quickLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={styles.footerLink}>
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} {t({ de: 'Zahnarztpraxis Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}</span>
      </div>
    </footer>
  );
}
