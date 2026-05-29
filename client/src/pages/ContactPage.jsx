import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import AppointmentRequestForm from '../components/AppointmentRequestForm';
import BookingForm from '../components/BookingForm';
import SeoHelmet from '../components/SeoHelmet';
import { bookingServices, services } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { t } = useLanguage();
  const [selectedService, setSelectedService] = useState(null);
  const [booking, setBooking] = useState(null);
  const primaryService = bookingServices[0];

  const serviceData = [...bookingServices, ...services].find(
    (s) => t(s.title) === (booking?.service || t(selectedService?.title))
  );

  if (!selectedService) {
    return (
      <>
        <SeoHelmet path="/contact" title={{ de: 'Termin buchen', en: 'Book Appointment' }} description={{ de: 'Vereinbaren Sie einen Termin bei Zahnarzt Johnny Najmeh in Ludwigshafen am Rhein. Online-Buchung für Zahnreinigung, Untersuchung und weitere Behandlungen.', en: 'Book an appointment at Dentist Johnny Najmeh in Ludwigshafen am Rhein. Online booking for teeth cleaning, examination and other treatments.' }} />
        <section className="booking-services-page animate-fade-in">
        <div className="booking-shell">
          <h1 className="animate-up" style={{ animationDelay: '0.1s' }}>{t({ de: 'Unsere Services', en: 'Our Services' })}</h1>
          <article className="booking-service-card animate-up" style={{ animationDelay: '0.25s' }}>
            <img src={primaryService.image} alt={t(primaryService.title)} />
            <div className="booking-service-card__body">
              <h2>{t(primaryService.title)}</h2>
              <hr />
              <p>{t(primaryService.duration)}</p>
              <p>{t(primaryService.price)}</p>
              <button type="button" onClick={() => setSelectedService(primaryService)}>
                {t({ de: 'Buchen', en: 'Book' })}
              </button>
            </div>
          </article>
        </div>
      </section>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <SeoHelmet path="/contact" title={{ de: 'Termin buchen', en: 'Book Appointment' }} description={{ de: 'Vereinbaren Sie einen Termin bei Zahnarzt Johnny Najmeh in Ludwigshafen am Rhein. Online-Buchung für Zahnreinigung, Untersuchung und weitere Behandlungen.', en: 'Book an appointment at Dentist Johnny Najmeh in Ludwigshafen am Rhein. Online booking for teeth cleaning, examination and other treatments.' }} />
        <section className="booking-flow-page animate-fade-in">
        <div className="booking-flow-shell">
          <button type="button" className="booking-back" onClick={() => setSelectedService(null)}>
            <ChevronLeft size={18} />
            {t({ de: 'Zurück', en: 'Back' })}
          </button>

          <div className="booking-flow-heading animate-up" style={{ animationDelay: '0.15s' }}>
            <h1>{t({ de: 'Service buchen', en: 'Book service' })}</h1>
            <p>{t({ de: 'Jetzt unsere verfügbaren Termine entdecken und buchen.', en: 'Discover and book our available appointments now.' })}</p>
          </div>

          <div className="booking-flow-grid animate-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <h2>{t({ de: 'Datum und Uhrzeit wählen', en: 'Choose date and time' })}</h2>
              <AppointmentRequestForm
                defaultService={t(selectedService.title)}
                onDateTimeSelected={(data) => setBooking(data)}
              />
            </div>
            <aside className="booking-details">
              <h2>{t({ de: 'Servicedetails', en: 'Service details' })}</h2>
              <p>{t(selectedService.title)}</p>
              <span>{t(selectedService.duration)}</span>
              <span>{t(selectedService.price)}</span>
            </aside>
          </div>
        </div>
      </section>
      </>
    );
  }

  return (
    <>
      <SeoHelmet path="/contact" title={{ de: 'Termin buchen', en: 'Book Appointment' }} description={{ de: 'Vereinbaren Sie einen Termin bei Zahnarzt Johnny Najmeh in Ludwigshafen am Rhein. Online-Buchung für Zahnreinigung, Untersuchung und weitere Behandlungen.', en: 'Book an appointment at Dentist Johnny Najmeh in Ludwigshafen am Rhein. Online booking for teeth cleaning, examination and other treatments.' }} />
      <section className="booking-flow-page animate-fade-in">
      <div className="booking-flow-shell">
        <div className="animate-up" style={{ animationDelay: '0.15s' }}>
          <BookingForm
            booking={booking}
            serviceData={serviceData}
            onBack={() => setBooking(null)}
            onDone={() => {
              setBooking(null);
              setSelectedService(null);
            }}
          />
        </div>
      </div>
    </section>
    </>
  );
}
