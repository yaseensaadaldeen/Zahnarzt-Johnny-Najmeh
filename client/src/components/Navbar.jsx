import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { services } from '../data/siteContent';
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
      <div className={styles.inner}>
        <nav className={styles.desktopNav} aria-label={t({ de: 'Hauptnavigation', en: 'Main navigation' })}>
          <NavLink
            to="/"
            className={({ isActive }) => `${styles.link} ${styles.brandLink} ${isActive ? styles.linkActive : ''}`}
          >
            {t({ de: 'Zahnarztpraxis Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}
          </NavLink>

          <div className={styles.dropdown}>
            <NavLink
              to="/services"
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            >
              {t({ de: 'Leistungen', en: 'Services' })}
            </NavLink>
            <div className={styles.dropdownMenu}>
              {services.map((service) => (
                <NavLink key={service.id} to={`/services/${service.id}`} className={styles.dropdownLink}>
                  {t(service.title)}
                </NavLink>
              ))}
            </div>
          </div>

          <NavLink
            to="/contact"
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            {t({ de: 'Termin Buchen', en: 'Book Appointment' })}
          </NavLink>
        </nav>

        <div className={styles.right}>
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
          <div className={styles.mobileSubnav}>
            {services.map((service) => (
              <NavLink
                key={service.id}
                to={`/services/${service.id}`}
                className={styles.mobileSubLink}
                onClick={() => setOpen(false)}
              >
                {t(service.title)}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
