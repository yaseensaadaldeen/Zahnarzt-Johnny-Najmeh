import { Link } from 'react-router-dom';
import { Clock, Heart, Shield, Smile, Sparkles, Stethoscope } from 'lucide-react';
import { services } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

const icons = {
  Shield,
  Sparkles,
  Heart,
  Smile,
  Stethoscope,
  Clock,
};

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <section className="section">
      <div className="container">
        <h2 className="heading-section">{t({ de: 'Unsere Leistungen', en: 'Our Services' })}</h2>
        <div className="grid-3">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <Link key={service.id} to={`/services/${service.id}`} className="surface-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                {service.image && (
                  <img src={service.image} alt={t(service.title)} style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }} />
                )}
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
                    <Icon size={20} />
                    <span style={{ fontSize: '0.875rem' }}>{t(service.category)}</span>
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>{t(service.title)}</h3>
                  <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>{t(service.description)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
