import { Card } from '../components/Card';
import { AnimatedSection } from '../components/AnimatedSection';
import { SEO } from '../components/SEO';
import { MapPin, Phone, Mail, Car, Train, Footprints, Navigation, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function Location() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white pt-20">
      <SEO
        title="Anfahrt – Zahnarzt Johnny Najmeh | Zahnarzt in Freiburg"
        description="So finden Sie uns: Zahnarzt Johnny Najmeh in Freiburg. Adresse, Anfahrt mit PKW, öffentlichen Verkehrsmitteln und Parkmöglichkeiten."
        canonical="/location"
      />
      {/* Header */}
      <AnimatedSection>
        <section className="bg-gradient-to-br from-primary to-cyan-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-5xl font-bold mb-6">
              {t('Standort', 'Location')}
            </h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              {t(
                'Besuchen Sie uns in unserer modernen Praxis im Herzen von Freiburg',
                'Visit us at our modern practice in the heart of Freiburg'
              )}
            </p>
          </div>
        </section>
      </AnimatedSection>

      {/* Location & Map */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <AnimatedSection>
              <Card className="p-8 h-full">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  {t('Kontaktinformationen', 'Contact Information')}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t('Adresse', 'Address')}</h3>
                      <p className="text-muted-foreground">
                        Sundgauallee 15<br />
                        79110 Freiburg im Breisgau<br />
                        Deutschland
                      </p>
                      <a
                        href="https://maps.google.com/?q=Sundgauallee+15+Freiburg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline inline-flex items-center gap-1 mt-2"
                      >
                        <Navigation size={16} />
                        {t('In Google Maps öffnen', 'Open in Google Maps')}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t('Telefon', 'Phone')}</h3>
                      <a href="tel:+497612345678" className="text-muted-foreground hover:text-primary">
                        +49 761 234 5678
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Erreichbar während der Öffnungszeiten', 'Available during opening hours')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">E-Mail</h3>
                      <a href="mailto:info@dr-najmeh.de" className="text-muted-foreground hover:text-primary">
                        info@dr-najmeh.de
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('Antwort innerhalb von 24 Stunden', 'Response within 24 hours')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{t('Öffnungszeiten', 'Opening Hours')}</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p className="font-semibold text-foreground">
                          {t('Jeden Tag der Woche', 'Every Day of the Week')}
                        </p>
                        <p>{t('Montag - Sonntag', 'Monday - Sunday')}</p>
                        <p className="font-semibold text-foreground">8:00 - 20:00</p>
                        <p className="text-accent mt-2">
                          {t('Notfalltermine täglich verfügbar', 'Emergency appointments available daily')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            {/* Map */}
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[500px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2710.2!2d7.8494!3d48.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDAwJzAwLjAiTiA3wrg1MCc1OC4wIkU!5e0!3m2!1sen!2sde!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '500px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </AnimatedSection>
          </div>

          {/* Directions */}
          <AnimatedSection delay={0.2}>
            <div className="mb-16">
              <h2 className="font-serif text-3xl font-bold text-center mb-12">
                {t('So finden Sie uns', 'How to Find Us')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card centered hover className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t('Mit dem Auto', 'By Car')}</h3>
                  <p className="text-muted-foreground">
                    {t(
                      'Kostenlose Parkplätze hinter der Praxis. Gute Anbindung aus der Innenstadt.',
                      'Free parking behind the clinic. Easy access from the city center.'
                    )}
                  </p>
                </Card>

                <Card centered hover className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Train className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t('Mit öffentlichen Verkehrsmitteln', 'By Public Transport')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t(
                      'Straßenbahnlinie 5 - Haltestelle "Sundgauallee". Nur 2 Minuten Fußweg.',
                      'Tram line 5 - stop "Sundgauallee". Just a 2-minute walk.'
                    )}
                  </p>
                </Card>

                <Card centered hover className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Footprints className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{t('Zu Fuß', 'By Foot')}</h3>
                  <p className="text-muted-foreground">
                    {t(
                      '5 Minuten vom Freiburger Hauptbahnhof. Neben dem Rewe-Supermarkt.',
                      '5-minute walk from Freiburg main station. Next to Rewe supermarket.'
                    )}
                  </p>
                </Card>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
