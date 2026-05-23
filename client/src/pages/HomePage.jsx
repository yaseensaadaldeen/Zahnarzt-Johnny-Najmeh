import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Calendar, ChevronLeft, ChevronRight, Clock, Heart, MapPin, Shield, Smile, Sparkles, Star, Stethoscope } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import AppointmentRequestForm from '../components/AppointmentRequestForm';
import CenteredCard from '../components/CenteredCard';
import DentistCalendar from '../components/DentistCalendar';
import NumberCounter from '../components/NumberCounter';
import { galleryImages, services, stats, testimonials } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

const serviceIcons = {
  Shield,
  Sparkles,
  Heart,
  Clock,
  Stethoscope,
  Smile,
};

export default function HomePage() {
  const { t } = useLanguage();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    skipSnaps: false,
  });

  const previewServices = useMemo(() => services, []);

  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);

    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  useEffect(() => {
    if (!emblaApi) {
      return undefined;
    }

    const syncActiveIndex = () => {
      setActiveServiceIndex(emblaApi.selectedScrollSnap());
    };

    syncActiveIndex();
    emblaApi.on('select', syncActiveIndex);
    emblaApi.on('reInit', syncActiveIndex);

    return () => {
      emblaApi.off('select', syncActiveIndex);
      emblaApi.off('reInit', syncActiveIndex);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [cardsPerView, emblaApi]);

  const serviceSnapCount = emblaApi ? emblaApi.scrollSnapList().length : Math.max(1, previewServices.length - cardsPerView + 1);

  return (
    <div>
      <AnimatedSection>
        <section className="section hero-gradient" style={{ overflow: 'hidden', position: 'relative' }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', top: 80, left: 20, width: 260, height: 260, borderRadius: '999px', background: 'rgba(8,145,178,0.1)', filter: 'blur(44px)' }}
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ position: 'absolute', right: 30, bottom: 10, width: 360, height: 360, borderRadius: '999px', background: 'rgba(217,119,6,0.1)', filter: 'blur(52px)' }}
          />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div className="text-center" style={{ maxWidth: 880, margin: '0 auto 48px' }}>
              <span className="eyebrow">
                <Calendar size={16} />
                {t({ de: 'Jeden Tag der Woche fuer Sie da', en: 'Here for you every day of the week' })}
              </span>
              <h1 className="heading-display" style={{ margin: '24px 0 20px' }}>{t({ de: 'Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh' })}</h1>
              <p style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', margin: '0 0 12px' }}>
                {t({ de: 'Moderne Zahnmedizin, jeden Tag', en: 'Modern Dentistry, Every Day' })}
              </p>
              <p className="lead" style={{ maxWidth: 720, margin: '0 auto 32px' }}>
                Schanzstraße 105, Ludwigshafen am Rhein. {t({ de: 'Wir sind jeden Tag der Woche fuer Sie da.', en: 'We are here for you every day of the week.' })}
              </p>
              <div className="button-row" style={{ justifyContent: 'center' }}>
                <Link to="/contact" className="pill" style={{ background: 'var(--primary)', color: '#fff', padding: '16px 26px' }}>
                  {t({ de: 'Termin buchen', en: 'Book Appointment' })}
                </Link>
                <Link to="/services" className="pill" style={{ borderColor: 'var(--primary)', color: 'var(--primary)', padding: '16px 26px', borderWidth: 2, borderStyle: 'solid' }}>
                  {t({ de: 'Leistungen ansehen', en: 'View Services' })}
                </Link>
              </div>
            </div>

            <CenteredCard>
              <div style={{ padding: '32px' }}>
                <h2 className="heading-section text-center" style={{ fontSize: '2rem' }}>
                  {t({ de: 'Schnelle Terminanfrage', en: 'Quick Appointment Request' })}
                </h2>
                <AppointmentRequestForm />
              </div>
            </CenteredCard>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="text-center" style={{ maxWidth: 760, margin: '0 auto 48px' }}>
              <h2 className="heading-section">{t({ de: 'Unsere Leistungen', en: 'Our Services' })}</h2>
              <p className="lead">
                {t({
                  de: 'Umfassende Zahnmedizin mit moderner Technik, ruhiger Atmosphaere und klarer Beratung.',
                  en: 'Comprehensive dentistry with modern technology, a calm atmosphere, and clear guidance.',
                })}
              </p>
            </div>
            <div className="toolbar" style={{ justifyContent: 'flex-end', marginBottom: '20px' }}>
              <button
                type="button"
                className="pill"
                style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!emblaApi?.canScrollPrev()}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="pill"
                style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}
                onClick={() => emblaApi?.scrollNext()}
                disabled={!emblaApi?.canScrollNext()}
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="services-slider" ref={emblaRef}>
              <div className="services-slider-track">
                {previewServices.map((service) => (
                  <div key={service.id} className="services-slide" style={{ width: `${100 / cardsPerView}%` }}>
                    <CenteredCard hover className="services-slide-card">
                      <div style={{ padding: '28px', textAlign: 'center' }}>
                        {(() => {
                          const Icon = serviceIcons[service.icon];
                          return Icon ? (
                            <div style={{ color: 'var(--primary)', marginBottom: '16px' }}>
                              <Icon size={42} />
                            </div>
                          ) : null;
                        })()}
                        <h3 style={{ margin: '0 0 12px', fontSize: '1.25rem' }}>{t(service.category)}</h3>
                        <p className="muted" style={{ margin: '0 0 16px', lineHeight: 1.7 }}>{t(service.description)}</p>
                        <Link to={`/services/${service.id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>
                          {t({ de: 'Mehr erfahren', en: 'Learn more' })}
                        </Link>
                      </div>
                    </CenteredCard>
                  </div>
                ))}
              </div>
            </div>
            <div className="toolbar" style={{ justifyContent: 'center', marginTop: '20px' }}>
              {Array.from({ length: serviceSnapCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to service slide ${index + 1}`}
                  onClick={() => emblaApi?.scrollTo(index)}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '999px',
                    border: 0,
                    padding: 0,
                    background: index === activeServiceIndex ? 'var(--primary)' : 'rgba(8, 145, 178, 0.2)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="section section--gradient">
          <div className="container">
            <div className="text-center" style={{ marginBottom: '40px' }}>
              <h2 className="heading-section">{t({ de: 'Verfuegbarkeit von Zahnarzt Johnny', en: 'Dentist Johnny Availability' })}</h2>
              <p className="lead">{t({ de: 'Oeffentlicher Kalender mit Zeit und Leistung.', en: 'Public calendar with time and service only.' })}</p>
            </div>
            <DentistCalendar />
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="grid-3">
              {stats.map((item) => (
                <div key={item.label.de} className="text-center">
                  <div style={{ fontSize: '3.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                    <NumberCounter target={item.value} suffix={item.suffix} />
                  </div>
                  <div className="muted">{t(item.label)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="section section--gradient">
          <div className="container">
            <div className="text-center" style={{ maxWidth: 760, margin: '0 auto 48px' }}>
              <h2 className="heading-section">{t({ de: 'Unsere moderne Klinik', en: 'Our Modern Clinic' })}</h2>
              <p className="lead">{t({ de: 'Licht, Klarheit und moderne Technik fuer ein beruhigendes Behandlungserlebnis.', en: 'Light, clarity, and modern technology for a reassuring treatment experience.' })}</p>
            </div>
            <div className="grid-2">
              {galleryImages.slice(0, 4).map((image) => (
                <CenteredCard key={image.url} hover>
                  <div style={{ position: 'relative' }}>
                    <img src={image.url} alt={t(image.title)} style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: '20px', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 100%)', color: '#fff' }}>
                      <strong>{t(image.title)}</strong>
                    </div>
                  </div>
                </CenteredCard>
              ))}
            </div>
            <div className="text-center" style={{ marginTop: '28px' }}>
              <Link to="/gallery" className="pill" style={{ border: '2px solid var(--primary)', color: 'var(--primary)' }}>
                {t({ de: 'Komplette Galerie ansehen', en: 'View Full Gallery' })}
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="section">
          <div className="container">
            <div className="split-layout">
              <CenteredCard>
                <div style={{ padding: '32px' }}>
                  <span className="eyebrow"><MapPin size={16} /> Ludwigshafen am Rhein</span>
                  <h2 className="heading-section" style={{ marginTop: '20px' }}>{t({ de: 'Standort und Anfahrt', en: 'Location & Directions' })}</h2>
                  <div style={{ display: 'grid', gap: '18px' }}>
                    <div>
                      <strong>Schanzstraße 105, 67063 Ludwigshafen am Rhein</strong>
                    </div>
                    <div className="muted">{t({ de: 'Mit dem Auto: Kostenlose Parkplaetze hinter der Praxis.', en: 'By car: Free parking behind the clinic.' })}</div>
                    <div className="muted">{t({ de: 'Mit der Strassenbahn: Gute Anbindung an den oeffentlichen Nahverkehr.', en: 'By tram: Well connected to public transit.' })}</div>
                    <div className="muted">{t({ de: 'Zu Fuss: Zentrale Lage mit guter Erreichbarkeit.', en: 'On foot: Central location with easy accessibility.' })}</div>
                    <Link to="/location" className="pill" style={{ background: 'var(--primary)', color: '#fff', width: 'fit-content' }}>
                      {t({ de: 'Route ansehen', en: 'View Directions' })}
                    </Link>
                  </div>
                </div>
              </CenteredCard>
              <CenteredCard>
                <iframe
                  title={t({ de: 'Zahnarzt Johnny Najmeh Karte', en: 'Dentist Johnny Najmeh map' })}
                  src="https://www.google.com/maps?q=Schanzstrasse%20105%20Ludwigshafen&z=15&output=embed"
                  style={{ width: '100%', minHeight: '420px', border: 0, display: 'block' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </CenteredCard>
            </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection>
        <section className="section">
          <div className="container">
            <CenteredCard>
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={20} fill="var(--accent)" color="var(--accent)" />)}
                </div>
                <p style={{ fontSize: '1.25rem', lineHeight: 1.8, maxWidth: 780, margin: '0 auto 16px' }}>
                  "{t(testimonials[activeTestimonial].quote)}"
                </p>
                <strong style={{ color: 'var(--primary)' }}>{testimonials[activeTestimonial].author}</strong>
                <div className="button-row" style={{ justifyContent: 'center', marginTop: '24px' }}>
                  <button type="button" className="pill" style={{ border: '1px solid var(--border)', background: 'var(--muted)' }} onClick={() => setActiveTestimonial((value) => (value === 0 ? testimonials.length - 1 : value - 1))}>
                    {t({ de: 'Zurueck', en: 'Previous' })}
                  </button>
                  <button type="button" className="pill" style={{ border: '1px solid var(--border)', background: 'var(--muted)' }} onClick={() => setActiveTestimonial((value) => (value === testimonials.length - 1 ? 0 : value + 1))}>
                    {t({ de: 'Weiter', en: 'Next' })}
                  </button>
                </div>
              </div>
            </CenteredCard>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
