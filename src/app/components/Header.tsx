import { Link, useLocation } from 'react-router';
import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', label: t('Startseite', 'Home') },
    { path: '/services', label: t('Leistungen', 'Services') },
    { path: '/gallery', label: t('Galerie', 'Gallery') },
    { path: '/location', label: t('Standort', 'Location') },
    { path: '/contact', label: t('Kontakt', 'Contact') }
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism navbar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center text-white font-serif text-xl shadow-lg group-hover:shadow-xl transition-shadow">
                JN
              </div>
              <div>
                <div className="font-serif text-xl font-semibold text-foreground">{t('Zahnarzt Johnny Najmeh', 'Dentist Johnny Najmeh')}</div>
                <div className="text-xs text-muted-foreground">{t('Moderne Zahnmedizin', 'Modern Dentistry')}</div>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 text-foreground hover:text-primary transition-all hover:-translate-y-0.5 group"
                >
                  {item.label}
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-primary to-blue-500 rounded-full"
                      style={{
                        boxShadow: '0 0 10px rgba(8, 145, 178, 0.5)'
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Language Toggle - Right */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'de' ? 'en' : 'de')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-all group"
              >
                <Globe size={18} className="text-primary" />
                <span className="font-medium">{language.toUpperCase()}</span>
                <span className="text-xs text-muted-foreground">|</span>
                <span className="text-xs text-muted-foreground">
                  {language === 'de' ? 'EN' : 'DE'}
                </span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden py-4 space-y-2"
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block py-2 px-4 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setLanguage(language === 'de' ? 'en' : 'de');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-muted/50 hover:bg-muted transition-all"
              >
                <Globe size={18} className="text-primary" />
                <span>{t('Sprache: Deutsch', 'Language: English')}</span>
              </button>
            </motion.nav>
          )}
        </div>
      </div>
    </header>
  );
}
