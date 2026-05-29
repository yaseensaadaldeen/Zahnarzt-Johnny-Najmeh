import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.addressItem}>
          <MapPin size={24} />
          <span>Kontakt</span>
          <span>Schanzstraße 105, 67063 Ludwigshafen am Rhein</span>
        </div>
        <a href="tel:+491622731687" className={styles.contactItem}>
          <Phone size={24} />
          <span>+49 162 2731687</span>
        </a>
        <a href="mailto:info.za.johnny@gmail.com" className={styles.contactItem}>
          <Mail size={26} />
          <span>info.za.johnny@gmail.com</span>
        </a>
        <nav className={styles.legal} aria-label="Legal">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </nav>
      </div>
    </footer>
  );
}
