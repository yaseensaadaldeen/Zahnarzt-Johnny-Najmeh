import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import styles from './Navbar.module.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const links = [
    { to: '/', label: { de: 'Zahnarztpraxis Johnny Najmeh', en: 'Dentist Johnny Najmeh' } },
    { to: '/services', label: { de: 'Leistungen', en: 'Services' } },
    { to: '/contact', label: { de: 'Termin Buchen', en: 'Book Appointment' } },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandTitle}>
            {t({ de: 'Zahnarztpraxis Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}
          </span>
        </NavLink>

        <nav className={styles.desktopNav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            >
              {t(link.label)}
            </NavLink>
          ))}
        </nav>

        <div className={styles.right}>
          <LanguageToggle />
          <button type="button" className={styles.menuButton} onClick={() => setOpen((value) => !value)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className={`container ${styles.mobileNav}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              {t(link.label)}
            </NavLink>
          ))}
        </div>
      ) : null}
    </header>
  );
}
