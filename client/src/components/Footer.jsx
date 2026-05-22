import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react';
import styles from './Footer.module.css';
import { useLanguage } from '../contexts/LanguageContext';
import { availabilityApi } from '../services/api';

const DAYS_DE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Footer() {
  const { t } = useLanguage();
  const [weeklyShifts, setWeeklyShifts] = useState([]);
  const quickLinks = [
    { to: '/', label: { de: 'Startseite', en: 'Home' } },
    { to: '/services', label: { de: 'Leistungen', en: 'Services' } },
    { to: '/gallery', label: { de: 'Galerie', en: 'Gallery' } },
    { to: '/location', label: { de: 'Standort', en: 'Location' } },
    { to: '/contact', label: { de: 'Kontakt', en: 'Contact' } },
  ];
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Sundgauallee+15,+79110+Freiburg+im+Breisgau';
  const mapsUrl = 'https://maps.google.com/?q=Sundgauallee+15+Freiburg';

  useEffect(() => {
    availabilityApi.get().then(data => {
      setWeeklyShifts(data.weeklyShifts || []);
    }).catch(() => {});
  }, []);

  const enabledShifts = weeklyShifts.filter(s => s.enabled);

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <h3 className={styles.title}>{t({ de: 'Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}</h3>
          <p className={styles.copy}>
            {t({
              de: 'Moderne Zahnmedizin mit Fokus auf Komfort, Vertrauen und taegliche Verfuegbarkeit.',
              en: 'Modern dentistry focused on comfort, trust, and daily availability.',
            })}
          </p>
          <div className={styles.socials}>
            {[Facebook, Instagram, Linkedin].map((Icon, index) => (
              <a key={index} href="#" className={styles.socialLink}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className={styles.subtitle}>{t({ de: 'Schnellzugriff', en: 'Quick Links' })}</h4>
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

        <div>
          <h4 className={styles.subtitle}>{t({ de: 'Kontakt', en: 'Contact' })}</h4>
          <ul className={styles.contactList}>
            <li>
              <MapPin size={18} />
              <a href={mapsUrl} target="_blank" rel="noreferrer" className={styles.footerLink}>
                Sundgauallee 15, 79110 Freiburg im Breisgau
              </a>
            </li>
            <li>
              <Phone size={18} />
              <a href="tel:+49761891010" className={styles.footerLink}>0761 891010</a>
            </li>
            <li>
              <Mail size={18} />
              <a href="mailto:info@zahnarztjohnny.com" className={styles.footerLink}>info@zahnarztjohnny.com</a>
            </li>
          </ul>
          <div className={styles.actions}>
            <a href={directionsUrl} target="_blank" rel="noreferrer" className={styles.actionButton}>
              {t({ de: 'Route starten', en: 'Get Directions' })}
            </a>
            <Link to="/location" className={styles.actionButtonSecondary}>
              {t({ de: 'Standortseite', en: 'Location Page' })}
            </Link>
          </div>
        </div>

        <div>
          <h4 className={styles.subtitle}>{t({ de: 'Oeffnungszeiten', en: 'Opening Hours' })}</h4>
          <ul className={styles.contactList}>
            {enabledShifts.length === 0 ? (
              <li><Clock size={18} /> {t({ de: 'Keine Daten', en: 'No data' })}</li>
            ) : (
              enabledShifts.map((shift) => (
                <li key={shift.dayOfWeek} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Clock size={14} style={{ flexShrink: 0 }} />
                  <span>{t({ de: DAYS_DE[shift.dayOfWeek], en: DAYS_EN[shift.dayOfWeek] })}: {shift.start} - {shift.end}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} {t({ de: 'Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}</span>
      </div>
    </footer>
  );
}
