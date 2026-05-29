import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { galleryImages } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    if (selectedIndex === null) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedIndex(null);
      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
      }
      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex]);

  const openGallery = (index) => setSelectedIndex(index);
  const goPrevious = () => setSelectedIndex((current) => (current === 0 ? galleryImages.length - 1 : current - 1));
  const goNext = () => setSelectedIndex((current) => (current === galleryImages.length - 1 ? 0 : current + 1));

  return (
    <div>
      <section className="johnny-hero animate-fade-in">
        <div className="johnny-hero__image">
          <img
            src="/images/5d64f5_1950d7baa2c34d36b9ef9ff86e026a7b~mv2.jpg"
            alt={t({ de: 'Zahnarztpraxis Johnny Najmeh', en: 'Dentist Johnny Najmeh clinic' })}
          />
        </div>
        <div className="johnny-hero__content">
          <div className="johnny-hero__copy">
            <h1>
              <span className="animate-up" style={{ animationDelay: '0.15s' }}>{t({ de: 'Willkommen in', en: 'Welcome to' })}</span>
              <span className="animate-up" style={{ animationDelay: '0.3s' }}>{t({ de: 'der Zahnarztpraxis', en: 'the Dental Practice' })}</span>
            </h1>
            <h2 className="animate-up" style={{ animationDelay: '0.45s' }}>Johnny Najmeh</h2>
            <Link to="/contact" className="johnny-button animate-up" style={{ animationDelay: '0.6s' }}>
              {t({ de: 'Termin Buchen', en: 'Book Appointment' })}
            </Link>
            <p className="animate-up" style={{ animationDelay: '0.75s' }}>{t({ de: 'Wir sind jeden Tag der Woche für Sie da', en: 'We are here for you every day of the week' })}</p>
          </div>
        </div>
      </section>

      <section className="section johnny-intro animate-fade-in">
        <div className="johnny-intro__copy">
          <h2 className="heading-section">{t({ de: 'Unsere Praxis', en: 'Our Practice' })}</h2>
          <p>
            {t({
              de: 'Entdecken Sie eine Praxis, die mit modernster Technologie und einem einladenden Ambiente dafür sorgt, dass Sie sich bei jedem Besuch wohl fühlen.',
              en: 'Discover a practice that uses cutting-edge technology and a welcoming atmosphere to ensure you feel comfortable at every visit.',
            })}
          </p>
        </div>
      </section>

      <section style={{ padding: '0 0 80px' }}>
        <div style={{ padding: '0 30px' }}>
          <div className="johnny-masonry">
            {galleryImages.map((item, i) => {
              const isFirst = i === 0 && item.title;
              const cls = ['johnny-masonry-item', 'animate-up', isFirst ? 'johnny-masonry-item--XL' : (i % 3 === 0 ? 'johnny-masonry-item--TALL' : '')].join(' ');

              if (isFirst) {
                return (
                  <button key={item.url} type="button" className={cls} style={{ animationDelay: `${0.1 + i * 0.04}s` }} onClick={() => openGallery(i)}>
                    <img src={item.url} alt="" />
                    <div className="johnny-masonry-overlay">
                      <h2>{t(item.title)}</h2>
                      <p>{t(item.description)}</p>
                    </div>
                  </button>
                );
              }

              return (
                <button key={item.url} type="button" className={cls} style={{ animationDelay: `${0.1 + i * 0.04}s` }} onClick={() => openGallery(i)}>
                  <img src={item.url} alt="" />
                  {item.title && (
                    <div className="johnny-masonry-overlay johnny-masonry-overlay--subtle">
                      <span className="johnny-masonry-tag">{t(item.title)}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedIndex !== null ? (
        <div className="johnny-lightbox" role="dialog" aria-modal="true" aria-label={t({ de: 'Galerie', en: 'Gallery' })}>
          <button type="button" className="johnny-lightbox__expand" aria-label={t({ de: 'Vollbild', en: 'Fullscreen' })}>
            ↗
          </button>
          <button type="button" className="johnny-lightbox__close" onClick={() => setSelectedIndex(null)} aria-label={t({ de: 'Schließen', en: 'Close' })}>
            ×
          </button>
          <button type="button" className="johnny-lightbox__prev" onClick={goPrevious} aria-label={t({ de: 'Vorheriges Bild', en: 'Previous image' })}>
            ‹
          </button>
          <img src={galleryImages[selectedIndex].url} alt="" />
          <button type="button" className="johnny-lightbox__next" onClick={goNext} aria-label={t({ de: 'Nächstes Bild', en: 'Next image' })}>
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
