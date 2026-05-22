import { Car, Footprints, MapPin, Navigation, Train } from 'lucide-react';
import CenteredCard from '../components/CenteredCard';
import PageHero from '../components/PageHero';
import { useLanguage } from '../contexts/LanguageContext';

export default function LocationPage() {
  const { t } = useLanguage();

  return (
    <div>
      <PageHero
        invert
        title={t({ de: 'Standort', en: 'Location' })}
        description={t({
          de: 'Besuchen Sie uns in unserer modernen Praxis im Herzen von Freiburg.',
          en: 'Visit our modern clinic in the heart of Freiburg.',
        })}
      />

      <section className="section section--gradient">
        <div className="container">
          <div className="split-layout">
            <CenteredCard>
              <div style={{ padding: '32px' }}>
                <h2 className="heading-section">{t({ de: 'Adresse und Kontakt', en: 'Address & Contact' })}</h2>
                <div style={{ display: 'grid', gap: '20px' }}>
                  <div><strong>Sundgauallee 15, 79110 Freiburg im Breisgau</strong></div>
                  <div className="muted">+49 761 234 5678</div>
                  <div className="muted">info@dr-najmeh.de</div>
                  <div className="muted">{t({ de: 'Jeden Tag geoeffnet: 08:00 - 20:00', en: 'Open every day: 08:00 AM - 08:00 PM' })}</div>
                  <a href="https://maps.google.com/?q=Sundgauallee+15+Freiburg" target="_blank" rel="noreferrer" className="pill" style={{ background: 'var(--primary)', color: '#fff', width: 'fit-content' }}>
                    <Navigation size={16} />
                    {t({ de: 'In Google Maps oeffnen', en: 'Open in Google Maps' })}
                  </a>
                </div>
              </div>
            </CenteredCard>

            <CenteredCard>
              <iframe
                title={t({ de: 'Standort Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh location' })}
                src="https://www.google.com/maps?q=Sundgauallee%2015%20Freiburg&z=15&output=embed"
                style={{ width: '100%', height: '520px', border: 0 }}
                loading="lazy"
              />
            </CenteredCard>
          </div>

          <div className="grid-3" style={{ marginTop: '32px' }}>
            <CenteredCard hover>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Sundgauallee+15,+79110+Freiburg+im+Breisgau&travelmode=driving" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '24px', textAlign: 'center' }}>
                <Car color="var(--primary)" size={34} />
                <h3>{t({ de: 'Mit dem Auto', en: 'By Car' })}</h3>
                <p className="muted">{t({ de: 'Kostenlose Parkplaetze hinter der Praxis.', en: 'Free parking behind the clinic.' })}</p>
              </a>
            </CenteredCard>
            <CenteredCard hover>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Sundgauallee+15,+79110+Freiburg+im+Breisgau&travelmode=transit" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '24px', textAlign: 'center' }}>
                <Train color="var(--primary)" size={34} />
                <h3>{t({ de: 'Mit der Strassenbahn', en: 'By Tram' })}</h3>
                <p className="muted">{t({ de: 'Linie 5, Haltestelle Sundgauallee.', en: 'Line 5, stop Sundgauallee.' })}</p>
              </a>
            </CenteredCard>
            <CenteredCard hover>
              <a href="https://www.google.com/maps/dir/?api=1&destination=Sundgauallee+15,+79110+Freiburg+im+Breisgau&travelmode=walking" target="_blank" rel="noreferrer" style={{ display: 'block', padding: '24px', textAlign: 'center' }}>
                <Footprints color="var(--primary)" size={34} />
                <h3>{t({ de: 'Zu Fuss', en: 'On Foot' })}</h3>
                <p className="muted">{t({ de: '5 Minuten vom Hauptbahnhof, neben Rewe.', en: '5 minutes from the main station, next to Rewe.' })}</p>
              </a>
            </CenteredCard>
          </div>
        </div>
      </section>
    </div>
  );
}
