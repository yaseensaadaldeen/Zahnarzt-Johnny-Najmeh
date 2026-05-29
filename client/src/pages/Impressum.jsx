import PageHero from '../components/PageHero';
import SeoHelmet from '../components/SeoHelmet';
import { useLanguage } from '../contexts/LanguageContext';

export default function Impressum() {
  const { t } = useLanguage();

  return (
    <div>
      <SeoHelmet path="/impressum" title={{ de: 'Impressum', en: 'Impressum' }} description={{ de: 'Impressum der Zahnarztpraxis Zahnarzt Johnny Najmeh in Ludwigshafen am Rhein. Angaben gemäß § 5 TMG.', en: 'Legal notice of Dentist Johnny Najmeh in Ludwigshafen am Rhein. Information according to § 5 TMG.' }} />
      <PageHero
        title={t({ de: 'Impressum', en: 'Impressum' })}
        description={t({
          de: 'Rechtliche Angaben gemäß § 5 DDG',
          en: 'Legal information according to § 5 DDG',
        })}
      />
      <section className="section">
        <div className="container" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="surface-card" style={{ padding: 40 }}>
            <h2 className="heading-section" style={{ marginTop: 0 }}>
              {t({ de: 'Angaben gemäß § 5 DDG', en: 'Information according to § 5 DDG' })}
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  {
                    label: t({ de: 'Praxisname', en: 'Practice Name' }),
                    value: 'Zahnarzt Johnny Najmeh',
                  },
                  {
                    label: t({ de: 'Anschrift', en: 'Address' }),
                    value: 'Schanzstraße 105, 67063 Ludwigshafen am Rhein',
                  },
                  {
                    label: t({ de: 'Telefon', en: 'Phone' }),
                    value: '+49 162 2731687',
                  },
                  {
                    label: 'E-Mail',
                    value: 'info.za.johnny@gmail.com',
                  },
                  {
                    label: t({ de: 'Vertreten durch', en: 'Represented by' }),
                    value: 'Johnny Najmeh',
                  },
                  {
                    label: t({ de: 'Berufsbezeichnung', en: 'Professional Title' }),
                    value: t({ de: 'Zahnarzt (verliehen in Deutschland)', en: 'Dentist (conferred in Germany)' }),
                  },
                  {
                    label: t({ de: 'Zuständige Kammer', en: 'Competent Chamber' }),
                    value: 'Landeszahnärztekammer Rheinland-Pfalz',
                  },
                  {
                    label: t({ de: 'Berufsordnung', en: 'Professional Code' }),
                    value: t({ de: 'Berufsordnung für Zahnärzte in Rheinland-Pfalz', en: 'Professional Code of Conduct for Dentists in Rhineland-Palatinate' }),
                  },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ padding: '12px 16px 12px 0', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap', borderBottom: '1px solid var(--border)' }}>{row.label}</td>
                    <td style={{ padding: '12px 0', verticalAlign: 'top', borderBottom: '1px solid var(--border)' }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
