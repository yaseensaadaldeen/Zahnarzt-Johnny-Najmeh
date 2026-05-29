import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../contexts/LanguageContext';

const SITE_NAME = { de: 'Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh' };
const BASE_URL = 'https://dr-najmeh.de';

export default function SeoHelmet({ title, description, path = '' }) {
  const { language } = useLanguage();
  const lang = language === 'de' ? 'de' : 'en';

  const pageTitle = title?.[lang] ?? title?.de ?? '';
  const siteName = SITE_NAME[lang];
  const fullTitle = pageTitle ? `${pageTitle} | ${siteName}` : siteName;
  const desc = description?.[lang] ?? description?.de ?? '';
  const url = `${BASE_URL}${path}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={lang === 'de' ? 'de_DE' : 'en_US'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="de" href={`${BASE_URL}/de${path}`} />
      <link rel="alternate" hrefLang="en" href={`${BASE_URL}/en${path}`} />
      <link rel="alternate" hrefLang="x-default" href={url} />
    </Helmet>
  );
}
