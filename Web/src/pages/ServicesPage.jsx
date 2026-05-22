import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Shield, Smile, Sparkles, Stethoscope } from 'lucide-react';
import CenteredCard from '../components/CenteredCard';
import PageHero from '../components/PageHero';
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
  const categories = useMemo(() => {
    const dynamicCategories = services.map((service) => service.category);
    const uniqueCategories = dynamicCategories.filter(
      (category, index) =>
        dynamicCategories.findIndex((item) => item.de === category.de && item.en === category.en) === index
    );

    return [{ key: 'all', label: { de: 'Alle', en: 'All' } }, ...uniqueCategories.map((category) => ({ key: category.de, label: category }))];
  }, []);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = useMemo(
    () =>
      selectedCategory === 'all'
        ? services
        : services.filter((service) => service.category.de === selectedCategory),
    [selectedCategory]
  );

  return (
    <div>
      <PageHero
        invert
        title={t({ de: 'Unsere Leistungen', en: 'Our Services' })}
        description={t({
          de: 'Jede Behandlung folgt derselben Idee: moderne Technik, klare Kommunikation und angenehmer Komfort.',
          en: 'Every treatment follows the same idea: modern technology, clear communication, and reassuring comfort.',
        })}
      />

      <section className="section">
        <div className="container">
          <div className="toolbar" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                className="pill"
                style={{
                  border: selectedCategory === category.key ? '0' : '1px solid var(--border)',
                  background: selectedCategory === category.key ? 'var(--primary)' : 'var(--muted)',
                  color: selectedCategory === category.key ? '#ffffff' : 'var(--foreground)',
                }}
                onClick={() => setSelectedCategory(category.key)}
              >
                {t(category.label)}
              </button>
            ))}
          </div>

          <div className="grid-3">
            {filteredServices.map((service) => {
              const Icon = icons[service.icon];
              return (
                <CenteredCard key={service.id} hover>
                  <img src={service.image} alt={t(service.title)} style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover' }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '12px' }}>
                      <Icon size={28} />
                      <span>{t(service.category)}</span>
                    </div>
                    <h3 style={{ margin: '0 0 10px', fontFamily: 'var(--font-serif)', fontSize: '1.5rem' }}>{t(service.title)}</h3>
                    <p className="muted" style={{ margin: '0 0 16px', lineHeight: 1.7 }}>{t(service.description)}</p>
                    <div className="toolbar" style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
                      <span className="muted"><Clock size={16} style={{ marginRight: 6 }} /> {service.duration}</span>
                      <span style={{ fontWeight: 600 }}>{service.price}</span>
                    </div>
                    <Link to={`/services/${service.id}`} className="pill" style={{ background: 'var(--primary)', color: '#fff', justifyContent: 'center', width: '100%' }}>
                      {t({ de: 'Diese Leistung buchen', en: 'Book This Service' })}
                    </Link>
                  </div>
                </CenteredCard>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
