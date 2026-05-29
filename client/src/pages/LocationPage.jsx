import { Car, Footprints, MapPin, Navigation, Train } from 'lucide-react';
import CenteredCard from '../components/CenteredCard';
import PageHero from '../components/PageHero';
import SeoHelmet from '../components/SeoHelmet';
import { useLanguage } from '../contexts/LanguageContext';

export default function LocationPage() {
  const { t } = useLanguage();

  return (
    <div>
      <SeoHelmet path="/location" title={{ de: 'Anfahrt & Standort', en: 'Location & Directions' }} description={{ de: 'Anfahrt zur Zahnarztpraxis Zahnarzt Johnny Najmeh in Ludwigshafen am Rhein, Schanzstraße 105. Mit dem Auto, Zug oder zu Fuß erreichbar.', en: 'Directions to Dentist Johnny Najmeh in Ludwigshafen am Rhein, Schanzstraße 105. Accessible by car, train or on foot.' }} />
      <PageHero
        invert
        title={t({ de: 'Standort', en: 'Location' })}
        description={t({
de: 'Besuchen Sie uns in unserer modernen Praxis in Ludwigshafen am Rhein.',
en: 'Visit our modern clinic in Ludwigshafen am Rhein.',
        })}
      />

      <section className="section section--gradient">
        <div className="container">
          <div className="split-layout">
            <CenteredCard>
              <div style={{ padding: '32px' }}>
                <h2 className="heading-section">{t({ de: 'Adresse und Kontakt', en: 'Address & Contact' })}</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div><strong>Schanzstraße 105, 67063 Ludwigshafen am Rhein</strong></div>
                  <div className="muted">+49 162 2731687</div>
                  <div className="muted">info.za.johnny@gmail.com</div>
                  <div className="muted">{t({ de: 'Von montag bis Donnerstag 09:00 bis 19:00 Uhr', en: 'Monday to Thursday 09:00 to 19:00' })}</div>
                  <a href="https://maps.google.com/?q=Schanzstrasse+105+Ludwigshafen" target="_blank" rel="noreferrer" className="pill" style={{ background: 'var(--primary)', color: '#fff', width: 'fit-content' }}>
                    <Navigation size={16} />
                    {t({ de: 'In Google Maps oeffnen', en: 'Open in Google Maps' })}
                  </a>
                </div>
              </div>
            </CenteredCard>

            <CenteredCard>
              <iframe
                title={t({ de: 'Standort Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh location' })}
                src="https://www.google.com/maps?q=Schanzstrasse%20105%20Ludwigshafen&z=15&output=embed"
                style={{ width: '100%', height: '520px', border: 0 }}
                loading="lazy"
              />
            </CenteredCard>
          </div>

          <div className="grid-3" style={{ marginTop: '32px' }}>
            <CenteredCard hover>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Schanzstrasse+105,+67063+Ludwigshafen+am+Rhein&travelmode=driving" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '24px', textAlign: 'center' }}>
                <Car color="var(--primary)" size={34} />
                <h3>{t({ de: 'Mit dem Auto', en: 'By Car' })}</h3>
                <p className="muted">{t({ de: 'Kostenlose Parkplaetze hinter der Praxis.', en: 'Free parking behind the clinic.' })}</p>
              </a>
            </CenteredCard>
            <CenteredCard hover>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Schanzstrasse+105,+67063+Ludwigshafen+am+Rhein&travelmode=transit" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '24px', textAlign: 'center' }}>
                <Train color="var(--primary)" size={34} />
                <h3>{t({ de: 'Mit der Strassenbahn', en: 'By Tram' })}</h3>
                <p className="muted">{t({ de: 'Gute Anbindung an den oeffentlichen Nahverkehr.', en: 'Well connected to public transit.' })}</p>
              </a>
            </CenteredCard>
            <CenteredCard hover>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Schanzstrasse+105,+67063+Ludwigshafen+am+Rhein&travelmode=walking" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '24px', textAlign: 'center' }}>
                <Footprints color="var(--primary)" size={34} />
                <h3>{t({ de: 'Zu Fuss', en: 'On Foot' })}</h3>
                <p className="muted">{t({ de: 'Zentrale Lage mit guter Erreichbarkeit.', en: 'Central location with easy accessibility.' })}</p>
              </a>
            </CenteredCard>
          </div>
        </div>
      </section>
    </div>
  );
}
