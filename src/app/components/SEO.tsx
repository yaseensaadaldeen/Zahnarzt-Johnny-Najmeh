import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

const BASE_URL = 'https://dr-najmeh.de';

export function SEO({
  title = 'Zahnarzt Johnny Najmeh – Zahnarzt in Ludwigshafen am Rhein | Moderne Zahnmedizin & Online-Terminbuchung',
  description = 'Zahnarzt Johnny Najmeh – Ihr Zahnarzt in Ludwigshafen am Rhein. Professionelle Zahnreinigung, Zahnimplantate, Kieferorthopädie und ästhetische Zahnmedizin. Online-Terminbuchung verfügbar.',
  keywords = 'Zahnarzt Ludwigshafen, Zahnarzt Johnny Najmeh, Zahnmedizin, Zahnreinigung, Zahnimplantate, Kieferorthopädie, ästhetische Zahnmedizin, Zahnarzttermin',
  ogImage = '/images/treatment_room.jpg',
  ogType = 'website',
  canonical = '/',
}: SEOProps) {
  const fullTitle = title;
  const fullUrl = `${BASE_URL}${canonical}`;
  const imageUrl = `${BASE_URL}${ogImage}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content="de_DE" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
