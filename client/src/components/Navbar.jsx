import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageToggle from './LanguageToggle';
import styles from './Navbar.module.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { t } = useLanguage();

  const links = [
    { to: '/', label: { de: 'Startseite', en: 'Home' } },
    { to: '/services', label: { de: 'Leistungen', en: 'Services' } },
    { to: '/gallery', label: { de: 'Galerie', en: 'Gallery' } },
    { to: '/location', label: { de: 'Standort', en: 'Location' } },
    { to: '/contact', label: { de: 'Kontakt', en: 'Contact' } },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <NavLink to="/" className={styles.brand} onClick={() => setOpen(false)}>
          {logoFailed ? (
            <div className={styles.brandMark}>JN</div>
          ) : (
            <img
              src="/images/5d64f5_1950d7baa2c34d36b9ef9ff86e026a7b~mv2.jpg"
              alt={t({ de: 'Zahnarzt Johnny Najmeh Logo', en: 'Dentist Johnny Najmeh logo' })}
              className={styles.brandLogo}
              onError={() => setLogoFailed(true)}
            />
          )}
          <div>
            <div className={styles.brandTitle}>
              {t({ de: 'Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}
            </div>
            <div className={styles.brandSubtitle}>{t({ de: 'Moderne Zahnmedizin', en: 'Modern Dentistry' })}</div>
          </div>
        </NavLink>

        <nav className={styles.desktopNav}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t(link.label)}</span>
                  {isActive ? <motion.span layoutId="nav-pill" className={styles.activePill} /> : null}
                </>
              )}
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
        <motion.div
          className={styles.mobilePanel}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
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
        </motion.div>
      ) : null}
    </header>
  );
}
