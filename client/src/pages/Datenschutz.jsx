import PageHero from '../components/PageHero';
import SeoHelmet from '../components/SeoHelmet';
import { useLanguage } from '../contexts/LanguageContext';

export default function Datenschutz() {
  const { t } = useLanguage();

  return (
    <div>
      <SeoHelmet path="/datenschutz" title={{ de: 'Datenschutzerklärung', en: 'Privacy Policy' }} description={{ de: 'Datenschutzerklärung der Zahnarztpraxis Zahnarzt Johnny Najmeh. Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO.', en: 'Privacy policy of Dentist Johnny Najmeh. Information about the processing of personal data in accordance with GDPR.' }} />
      <PageHero
        title={t({ de: 'Datenschutzerklärung', en: 'Privacy Policy' })}
        description={t({
          de: 'Informationen über die Erhebung und Verarbeitung personenbezogener Daten',
          en: 'Information about the collection and processing of personal data',
        })}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="surface-card" style={{ padding: 40 }}>

            <h2 className="heading-section" style={{ marginTop: 0 }}>
              {t({ de: '1. Verantwortlicher', en: '1. Data Controller' })}
            </h2>
            <p className="lead">
              {t({
                de: 'Zahnarzt Johnny Najmeh, Schanzstraße 105, 67063 Ludwigshafen am Rhein, E-Mail: info.za.johnny@gmail.com, Telefon: +49 162 2731687',
                en: 'Zahnarzt Johnny Najmeh, Schanzstraße 105, 67063 Ludwigshafen am Rhein, Email: info.za.johnny@gmail.com, Phone: +49 162 2731687',
              })}
            </p>

            <h2 className="heading-section">
              {t({
                de: '2. Erhebung und Speicherung personenbezogener Daten',
                en: '2. Collection and Storage of Personal Data',
              })}
            </h2>
            <p className="lead">
              {t({
                de: 'Beim Besuch unserer Website werden automatisch Informationen erfasst, die Ihr Browser an unseren Server übermittelt. Dies umfasst IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp und -version sowie das Betriebssystem. Darüber hinaus erheben wir personenbezogene Daten, die Sie uns bei der Terminbuchung oder über unser Kontaktformular freiwillig mitteilen (Name, E-Mail-Adresse, Telefonnummer, Nachricht).',
                en: 'When you visit our website, information that your browser transmits to our server is automatically collected. This includes IP address, date and time of access, browser type and version, and operating system. We also collect personal data that you voluntarily provide to us when booking an appointment or via our contact form (name, email address, phone number, message).',
              })}
            </p>

            <h2 className="heading-section">
              {t({
                de: '3. Zweck der Datenverarbeitung',
                en: '3. Purpose of Data Processing',
              })}
            </h2>
            <p className="lead">
              {t({
                de: 'Die Verarbeitung Ihrer Daten erfolgt zur Terminvereinbarung, Bearbeitung Ihrer Anfragen über das Kontaktformular sowie zur Sicherstellung eines reibungslosen Praxisablaufs. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) und lit. f DSGVO (berechtigtes Interesse).',
                en: 'Your data is processed for appointment scheduling, handling your inquiries via the contact form, and ensuring smooth practice operations. The legal basis is Art. 6(1)(b) GDPR (contract initiation) and Art. 6(1)(f) GDPR (legitimate interest).',
              })}
            </p>

            <h2 className="heading-section">
              {t({
                de: '4. Weitergabe von Daten an Dritte',
                en: '4. Disclosure of Data to Third Parties',
              })}
            </h2>
            <p className="lead">
              {t({
                de: 'Eine Weitergabe Ihrer personenbezogenen Daten an Dritte erfolgt nur, soweit dies zur Erfüllung unserer vertraglichen Verpflichtungen erforderlich ist oder Sie zuvor eingewilligt haben. Wir setzen ggf. Dienstleister (z. B. Hosting-Anbieter) ein, die als Auftragsverarbeiter gemäß Art. 28 DSGVO tätig werden.',
                en: 'Your personal data is only disclosed to third parties to the extent necessary for fulfilling our contractual obligations or if you have given prior consent. We may use service providers (e.g., hosting providers) who act as data processors in accordance with Art. 28 GDPR.',
              })}
            </p>

            <h2 className="heading-section">
              {t({
                de: '5. Rechte der betroffenen Person',
                en: '5. Rights of the Data Subject',
              })}
            </h2>
            <p className="lead">
              {t({
                de: 'Sie haben das Recht, jederzeit Auskunft über die bei uns gespeicherten personenbezogenen Daten zu erhalten, deren Berichtigung, Löschung oder Einschränkung der Verarbeitung zu verlangen sowie der Verarbeitung zu widersprechen. Zudem steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.',
                en: 'You have the right to request information about the personal data stored about you at any time, to demand its correction, deletion, or restriction of processing, and to object to processing. You also have the right to lodge a complaint with the competent supervisory authority.',
              })}
            </p>

            <h2 className="heading-section">
              {t({
                de: '6. Datensicherheit',
                en: '6. Data Security',
              })}
            </h2>
            <p className="lead">
              {t({
                de: 'Wir treffen angemessene technische und organisatorische Maßnahmen, um Ihre personenbezogenen Daten gegen unbeabsichtigte oder unrechtmäßige Löschung, Veränderung oder gegen Verlust und gegen unbefugte Weitergabe oder Zugriff zu schützen.',
                en: 'We take appropriate technical and organizational measures to protect your personal data against accidental or unlawful deletion, alteration, or loss, and against unauthorized disclosure or access.',
              })}
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}
