import { Link, useSearchParams } from 'react-router';
import { useState, useEffect } from 'react';
import { AnimatedSection } from '../components/AnimatedSection';
import { AnimatedCard } from '../components/AnimatedCard';
import { CounterAnimation } from '../components/CounterAnimation';
import { DentistCalendar } from '../components/DentistCalendar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SEO } from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Heart, Clock, Sparkles, ChevronLeft, ChevronRight, Star, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { appointmentsApi } from '../services/api';
import { initNotifications } from '../services/notificationService';

const PHONE_REGEX = /^[\+\d][\d\s\-\(\)\.]{6,20}$/;

const todayStr = () => new Date().toISOString().split('T')[0];

const homeTimeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export function Home() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [homeError, setHomeError] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>(homeTimeSlots);
  const [calendarKey, setCalendarKey] = useState(0);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  });

  const showSuccess = searchParams.get('booked') === 'true';

  useEffect(() => {
    if (!bookingForm.date) {
      setBookedTimes([]);
      return;
    }
    const load = async () => {
      setLoadingSlots(true);
      try {
        const data = await appointmentsApi.getTimeslots(bookingForm.date);
        setAvailableTimes(data.availableTimes);
        setBookedTimes(data.bookedTimes);
        if (data.bookedTimes.includes(bookingForm.time)) {
          setBookingForm(prev => ({ ...prev, time: '' }));
        }
      } catch {
        setAvailableTimes(homeTimeSlots);
        setBookedTimes([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    load();
  }, [bookingForm.date]);

  useEffect(() => {
    initNotifications();
  }, []);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setSearchParams({}, { replace: true });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, setSearchParams]);

  const services = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: t('Vorsorge', 'Preventive Care'),
      description: t(
        'Regelmäßige Kontrollen, professionelle Reinigung und Früherkennung für gesunde Zähne.',
        'Regular checkups, professional cleaning, and early detection to keep your teeth healthy.'
      ),
      link: '/services/preventive'
    },
    {
      icon: <Sparkles className="w-12 h-12" />,
      title: t('Kosmetische Zahnmedizin', 'Cosmetic Dentistry'),
      description: t(
        'Zahnaufhellung, Veneers und Smile-Makeovers für ein selbstbewusstes, schönes Lächeln.',
        'Teeth whitening, veneers, and smile makeovers for a confident, beautiful smile.'
      ),
      link: '/services/cosmetic'
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: t('Wiederherstellende Pflege', 'Restorative Care'),
      description: t(
        'Füllungen, Kronen, Brücken und Implantate zur Wiederherstellung von Funktion und Aussehen.',
        'Fillings, crowns, bridges, and implants to restore function and appearance.'
      ),
      link: '/services/restorative'
    },
    {
      icon: <Clock className="w-12 h-12" />,
      title: t('Notfallversorgung', 'Emergency Care'),
      description: t(
        'Termine am selben Tag für zahnärztliche Notfälle. Wir sind jeden Tag der Woche geöffnet.',
        'Same-day appointments for dental emergencies. We are open every day of the week.'
      ),
      link: '/services/emergency'
    }
  ];

  const testimonials = [
    {
      text: t(
        'Zahnarzt Najmeh und sein Team haben mir ein sehr gutes Gefühl gegeben. Die Klinik ist modern und makellos. Sehr zu empfehlen!',
        'Dentist Najmeh and his team made me feel completely at ease. The clinic is modern and spotless. Highly recommend!'
      ),
      author: 'Maria Schmidt',
      rating: 5
    },
    {
      text: t(
        'Die beste zahnärztliche Erfahrung, die ich je gemacht habe. Das Personal ist professionell, freundlich und die Technologie ist hochmodern.',
        'Best dental experience I have ever had. The staff is professional, friendly, and the technology is state-of-the-art.'
      ),
      author: 'Thomas Weber',
      rating: 5
    },
    {
      text: t(
        'Ich war beeindruckt, wie angenehm der gesamte Prozess war. Zahnarzt Najmeh hat alles klar erklärt.',
        'I was impressed by how comfortable the entire process was. Dentist Najmeh explained everything clearly.'
      ),
      author: 'Anna Müller',
      rating: 5
    }
  ];

  const galleryImages = [
    {
      url: '/images/treatment_room.jpg',
      caption: t('Hochmoderner Behandlungsraum', 'State-of-the-art treatment room')
    },
    {
      url: '/images/waiting_area.jpg',
      caption: t('Komfortabler Wartebereich', 'Comfortable waiting area')
    },
    {
      url: '/images/dental_equipment.jpg',
      caption: t('Moderne zahnärztliche Ausrüstung', 'Modern dental equipment')
    },
    {
      url: '/images/reception.jpg',
      caption: t('Einladende Rezeption', 'Welcoming reception')
    }
  ];

  const validatePhone = (phone: string) => {
    if (!phone) return false;
    return PHONE_REGEX.test(phone);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHomeError('');
    if (!validatePhone(bookingForm.phone)) {
      setHomeError('Please enter a valid phone number (e.g. +49 123 456 7890)');
      setSubmitting(false);
      return;
    }
    setSubmitting(true);
    try {
      await appointmentsApi.create({
        patientName: bookingForm.name,
        patientEmail: bookingForm.email,
        patientPhone: bookingForm.phone,
        date: bookingForm.date,
        time: bookingForm.time,
        service: bookingForm.service,
      });
      setBookingForm({ service: '', date: '', time: '', name: '', phone: '', email: '' });
      setCalendarKey(prev => prev + 1);
      setSearchParams({ booked: 'true' }, { replace: true });
    } catch (err: any) {
      setHomeError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <SEO />
      {showSuccess && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="container mx-auto px-4 py-4 flex items-center gap-3 text-green-800">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="font-medium">
              {t(
                'Vielen Dank! Ihre Terminanfrage wurde gesendet. Wir werden Sie in Kürze kontaktieren.',
                'Thank you! Your appointment request has been submitted. We will contact you shortly.'
              )}
            </p>
          </div>
        </div>
      )}
      {/* Hero Section */}
      <AnimatedSection>
        <section className="relative bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [360, 180, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"
            />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6"
              >
                {t('Zahnarzt Johnny Najmeh', 'Dentist Johnny Najmeh')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl md:text-3xl text-foreground/80 mb-4"
              >
                {t('Moderne Zahnmedizin, jeden Tag', 'Modern Dentistry, Every Day')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-muted-foreground mb-8"
              >
                Sundgauallee 15, Freiburg. {t('Wir sind jeden Tag der Woche für Sie da.', 'We are here for you every day of the week.')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-4 justify-center"
              >
                <Link to="/book">
                  <Button variant="primary" className="text-lg px-8 py-4">
                    {t('Termin buchen', 'Book Appointment')}
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="secondary" className="text-lg px-8 py-4">
                    {t('Leistungen ansehen', 'View Services')}
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Quick Booking Widget */}
            <AnimatedCard delay={0.8} className="max-w-4xl mx-auto p-8 shadow-2xl">
              <h2 className="font-serif text-2xl font-semibold mb-6 text-center">
                {t('Schnelle Terminanfrage', 'Quick Appointment Request')}
              </h2>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">{t('Leistung', 'Service')}</label>
                    <select
                      className="px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={bookingForm.service}
                      onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                      required
                    >
                      <option value="">{t('Leistung wählen', 'Select service')}</option>
                      <option value="preventive">{t('Vorsorge', 'Preventive Care')}</option>
                      <option value="cosmetic">{t('Kosmetisch', 'Cosmetic Dentistry')}</option>
                      <option value="restorative">{t('Wiederherstellend', 'Restorative Care')}</option>
                      <option value="emergency">{t('Notfall', 'Emergency Care')}</option>
                    </select>
                  </div>
                  <Input
                    type="date"
                    label={t('Wunschdatum', 'Preferred Date')}
                    value={bookingForm.date}
                    min={todayStr()}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value, time: '' })}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">
                      {t('Wunschzeit', 'Preferred Time')}
                      {loadingSlots && <span className="text-xs text-muted-foreground ml-2">(loading...)</span>}
                    </label>
                    <select
                      className={`px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${!bookingForm.date ? 'opacity-50' : ''}`}
                      value={bookingForm.time}
                      onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                      required
                      disabled={!bookingForm.date}
                    >
                      <option value="">{t('Zeit wählen', 'Select time')}</option>
                      {availableTimes.length === 0 && !loadingSlots ? (
                        <option value="" disabled>{t('Keine verfügbaren Zeiten', 'No available times')}</option>
                      ) : (
                        availableTimes.map(time => (
                          <option key={time} value={time} disabled={bookedTimes.includes(time)}>
                            {time}{bookedTimes.includes(time) ? ` (${t('besetzt', 'booked')})` : ''}
                          </option>
                        ))
                      )}
                    </select>
                    {bookedTimes.length > 0 && bookingForm.date && (
                      <p className="text-xs text-muted-foreground">Slots marked "(booked)" are unavailable</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="text"
                    label={t('Vollständiger Name', 'Full Name')}
                    placeholder="John Doe"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    required
                  />
                  <div>
                    <Input
                      type="tel"
                      label={t('Telefon', 'Phone')}
                      placeholder="+49 123 456 7890"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      required
                    />
                    {bookingForm.phone && !PHONE_REGEX.test(bookingForm.phone) && (
                      <p className="text-xs text-red-500 mt-1">Invalid phone format</p>
                    )}
                  </div>
                  <Input
                    type="email"
                    label="E-Mail"
                    placeholder="john@example.com"
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    required
                  />
                </div>
                {homeError && (
                  <p className="text-sm text-red-500 text-center">{homeError}</p>
                )}
                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting
                    ? t('Wird gesendet...', 'Submitting...')
                    : t('Termin anfragen', 'Request Appointment')}
                </Button>
              </form>
            </AnimatedCard>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Preview */}
      <AnimatedSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">
                {t('Unsere Leistungen', 'Our Services')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Umfassende zahnärztliche Versorgung mit modernster Technologie und Techniken',
                  'Comprehensive dental care using the latest technology and techniques'
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <AnimatedCard key={index} delay={index * 0.1} className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center">{service.icon}</div>
                  <h3 className="font-semibold text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Link to={service.link} className="text-primary font-medium hover:underline">
                    {t('Mehr erfahren', 'Learn more')} →
                  </Link>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Dentist's Calendar */}
      <AnimatedSection>
        <section className="py-20 bg-gradient-to-b from-white to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">
                {t('Verfügbarkeit von Zahnarzt Johnny', "Dentist Johnny's Availability")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Sehen Sie sich die aktuellen Terminverfügbarkeiten an',
                  'Check current appointment availability'
                )}
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <DentistCalendar refreshKey={calendarKey} />
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Stats with Counter Animation */}
      <AnimatedSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  <CounterAnimation end={15} suffix="+" />
                </div>
                <div className="text-muted-foreground">
                  {t('Jahre Erfahrung', 'Years of Excellence')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  <CounterAnimation end={5000} suffix="+" />
                </div>
                <div className="text-muted-foreground">
                  {t('Zufriedene Patienten', 'Happy Patients')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  <CounterAnimation end={100} suffix="%" />
                </div>
                <div className="text-muted-foreground">
                  {t('Moderne Ausstattung', 'Modern Equipment')}
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Clinic Gallery */}
      <AnimatedSection>
        <section className="py-20 bg-gradient-to-b from-white to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold mb-4">
                {t('Unsere moderne Klinik', 'Our Modern Clinic')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t(
                  'Erleben Sie Komfort und Fürsorge in unserer hochmodernen Einrichtung',
                  'Experience comfort and care in our state-of-the-art facility'
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {galleryImages.map((image, index) => (
                <AnimatedCard key={index} delay={index * 0.1}>
                  <div className="group relative overflow-hidden aspect-video">
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <p className="text-white font-medium">{image.caption}</p>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/gallery">
                <Button variant="secondary">{t('Komplette Galerie ansehen', 'View Full Gallery')}</Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection>
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-4xl font-bold text-center mb-12">
              {t('Was unsere Patienten sagen', 'What Our Patients Say')}
            </h2>
            <div className="max-w-3xl mx-auto">
              <AnimatedCard className="p-8 md:p-12">
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-xl text-center text-foreground mb-6 italic">
                  "{testimonials[currentTestimonial].text}"
                </p>
                <p className="text-center font-semibold text-primary">
                  — {testimonials[currentTestimonial].author}
                </p>
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection>
        <section className="py-20 bg-gradient-to-br from-primary to-cyan-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-4xl font-bold mb-6">
              {t('Bereit, Ihr Lächeln zu verwandeln?', 'Ready to Transform Your Smile?')}
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              {t(
                'Buchen Sie noch heute Ihren Termin und erleben Sie moderne Zahnmedizin vom Feinsten',
                'Book your appointment today and experience modern dentistry at its finest'
              )}
            </p>
            <Link to="/book">
              <Button variant="secondary" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90">
                {t('Ihren Termin buchen', 'Book Your Appointment')}
              </Button>
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
