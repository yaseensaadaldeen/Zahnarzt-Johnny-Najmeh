import { Link } from 'react-router-dom';
import { services } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <section className="section johnny-services-page">
      <div className="johnny-page-heading">
        <h1 className="heading-display">{t({ de: 'Leistunges', en: 'Services' })}</h1>
        <p className="lead">
          {t({
            de: 'Hochwertige Zahnbehandlungen mit klarer Beratung, moderner Technik und ruhiger Betreuung.',
            en: 'High-quality dental treatments with clear consultation, modern technology, and calm care.',
          })}
        </p>
      </div>

      <div className="johnny-service-feature-list">
        {services.map((service, index) => (
          <Link
            key={service.id}
            to={`/services/${service.id}`}
            className={`johnny-service-feature ${index % 2 ? 'johnny-service-feature--reverse' : ''} animate-up`}
            style={{ animationDelay: `${0.1 + index * 0.12}s` }}
          >
            <img src={index === 0 ? '/images/veneers.jpg' : service.image} alt={t(service.title)} />
            <div>
              <span>{t(service.category)}</span>
              <h2>{t(service.title)}</h2>
              <p>{t(service.description)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
