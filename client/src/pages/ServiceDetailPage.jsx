import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import CenteredCard from '../components/CenteredCard';
import PageHero from '../components/PageHero';
import SeoHelmet from '../components/SeoHelmet';
import { services } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const service = services.find((item) => item.id === serviceId) || services[0];

  return (
    <div>
      <SeoHelmet
        path={`/services/${service.id}`}
        title={service.title}
        description={service.description}
      />
      <div style={{ position: 'relative', height: '420px' }}>
        <img src={service.image} alt={t(service.title)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%)' }} />
        <div className="container" style={{ position: 'absolute', inset: 'auto 0 48px 0', color: '#fff' }}>
          <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <ArrowLeft size={18} />
            {t({ de: 'Zurueck zu Leistungen', en: 'Back to Services' })}
          </Link>
          <span className="pill" style={{ background: '#000000', color: '#fff', marginBottom: '16px' }}>{t(service.category)}</span>
          <h1 className="heading-display" style={{ marginTop: '16px' }}>{t(service.title)}</h1>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="split-layout" style={{ alignItems: 'start' }}>
            <div>
              <h2 className="heading-section">{t({ de: 'Ueber diese Leistung', en: 'About This Service' })}</h2>
              <p className="lead" style={{ marginBottom: '32px' }}>{t(service.detail)}</p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: '20px' }}>{t({ de: 'Vorteile', en: 'Benefits' })}</h3>
              <div className="grid-2">
                {t(service.benefits).map((benefit) => (
                  <div key={benefit} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <CheckCircle size={20} color="var(--primary)" style={{ marginTop: 4, flexShrink: 0 }} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <CenteredCard>
              <div style={{ padding: '28px', position: 'sticky', top: '100px' }}>
                <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-serif)', fontSize: '1.6rem' }}>
                  {t({ de: 'Leistungsdetails', en: 'Service Details' })}
                </h3>
                <div style={{ display: 'grid', gap: '14px', marginBottom: '24px' }}>
                  <div className="muted"><Clock size={18} style={{ marginRight: 8 }} /> {service.duration}</div>
                  <div style={{ fontWeight: 600 }}>{service.price}</div>
                </div>
                <button
                  type="button"
                  className="pill"
                  style={{ background: 'var(--primary)', color: '#fff', justifyContent: 'center', width: '100%', marginBottom: '12px', border: 0, cursor: 'pointer' }}
                  onClick={() => navigate(`/contact?service=${encodeURIComponent(t(service.title))}`)}
                >
                  {t({ de: 'Termin buchen', en: 'Book Appointment' })}
                </button>
                <Link to="/contact" className="pill" style={{ border: '2px solid var(--primary)', color: 'var(--primary)', justifyContent: 'center', width: '100%' }}>
                  {t({ de: 'Frage stellen', en: 'Ask a Question' })}
                </Link>
              </div>
            </CenteredCard>
          </div>
        </div>
      </section>

      <PageHero
        title={t({ de: 'Verwandte Leistungen', en: 'Related Services' })}
        description={t({
          de: 'Weitere Behandlungen mit dem gleichen Anspruch an Aesthetik, Funktion und Komfort.',
          en: 'Additional treatments with the same focus on aesthetics, function, and comfort.',
        })}
      />
    </div>
  );
}
