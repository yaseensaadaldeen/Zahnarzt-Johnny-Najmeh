import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { MapPin, Phone, Mail, Clock, Globe, Camera, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { availabilityApi, WeeklyShift } from '../services/api';

const DAYS_DE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function Footer() {
  const { t } = useLanguage();
  const [weeklyShifts, setWeeklyShifts] = useState<WeeklyShift[]>([]);

  useEffect(() => {
    availabilityApi.get().then(data => {
      setWeeklyShifts(data.weeklyShifts || []);
    }).catch(() => {});
  }, []);

  const enabledShifts = weeklyShifts.filter(s => s.enabled);

  return (
    <footer className="bg-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="font-serif text-2xl font-semibold mb-4">{t('Zahnarzt Johnny Najmeh', 'Dentist Johnny Najmeh')}</div>
            <p className="text-slate-300 mb-4">
              {t(
                'Moderne Zahnmedizin mit Fokus auf Patientenkomfort und modernster Technologie.',
                'Modern dentistry with a focus on patient comfort and cutting-edge technology.'
              )}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Camera size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-300 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-slate-300 hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/gallery" className="text-slate-300 hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/book" className="text-slate-300 hover:text-primary transition-colors">Book Appointment</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <span>Schanzstraße 105<br />67063 Ludwigshafen am Rhein<br />Germany</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} />
                <a href="tel:+491622731687" className="hover:text-primary transition-colors">+49 162 2731687</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} />
                <a href="mailto:info.za.johnny@gmail.com" className="hover:text-primary transition-colors">info.za.johnny@gmail.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t('Öffnungszeiten', 'Opening Hours')}</h3>
            <ul className="space-y-2 text-slate-300">
              {enabledShifts.length === 0 ? (
                <li className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{t('Keine Daten', 'No data')}</span>
                </li>
              ) : (
                enabledShifts.map((shift) => (
                  <li key={shift.dayOfWeek} className="flex items-center gap-2">
                    <Clock size={14} />
                    <span>{t(DAYS_DE[shift.dayOfWeek], DAYS_EN[shift.dayOfWeek])}: {shift.start} - {shift.end}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm gap-4">
          <p>&copy; {new Date().getFullYear()} {t('Zahnarzt Johnny Najmeh', 'Dentist Johnny Najmeh')}. {t('Alle Rechte vorbehalten.', 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
}
