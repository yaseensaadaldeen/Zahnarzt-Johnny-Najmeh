const wixMedia = (id) => `/images/${id}`;

export const services = [
  {
    id: 'zahnaerztliche-untersuchung',
    icon: 'Stethoscope',
    title: { de: 'Zahnaerztliche Untersuchung', en: 'Dental Examination' },
    category: { de: 'Diagnostik', en: 'Diagnostics' },
    description: {
      de: 'Gruendliche Untersuchung mit moderner Diagnostik, taeglicher Verfuegbarkeit und freundlicher Betreuung in Freiburg.',
      en: 'Comprehensive examination with modern diagnostics, daily availability, and friendly care in Freiburg.',
    },
    detail: {
      de: 'Die auf der Live-Website veroeffentlichte Hauptleistung ist die zahnaerztliche Untersuchung. Sie ist online buchbar, dauert 30 Minuten und wird in der Praxis in der Sundgauallee 15 in Freiburg angeboten.',
      en: 'The main service published on the live website is the dental examination. It can be booked online, lasts 30 minutes, and is offered at the clinic on Sundgauallee 15 in Freiburg.',
    },
    duration: '30 min',
    price: 'kostenfallabhaengig',
    image: wixMedia('5d64f5_23c436025e924bfd8056df879a24900c~mv2.jpg'),
    benefits: {
      de: ['Online buchbar', 'Taeglich verfuegbar', 'Moderne Diagnostik', 'Persoenliche Betreuung'],
      en: ['Bookable online', 'Available daily', 'Modern diagnostics', 'Personal care'],
    },
  },
  {
    id: 'zahnersatz',
    icon: 'Heart',
    title: { de: 'Zahnersatz', en: 'Dental Prosthetics' },
    category: { de: 'Zahnersatz', en: 'Restoration' },
    description: {
      de: 'Festsitzender oder herausnehmbarer Zahnersatz von Metalllegierung bis Vollkeramik fuer funktionelle und natuerlich aussehende Zaehne.',
      en: 'Fixed or removable prosthetics, from metal alloys to full ceramics, for functional and natural-looking teeth.',
    },
    detail: {
      de: 'Heute muss in der Regel niemand mehr auf funktionelle und natuerlich aussehende Zaehne verzichten. Das Angebot reicht von Kronen und Bruecken bis zu Teil- und Vollprothesen.',
      en: 'Today, patients usually do not have to give up functional and natural-looking teeth. The range includes crowns, bridges, partial, and full dentures.',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_cb0beef0d71f4823a8b864423360bac9~mv2.jpg'),
    benefits: {
      de: ['Kronen und Teilkronen', 'Bruecken', 'Teil- und Vollprothesen', 'Vollkeramik moeglich'],
      en: ['Crowns and partial crowns', 'Bridges', 'Partial and full dentures', 'Full ceramic options'],
    },
  },
  {
    id: 'wurzelbehandlung',
    icon: 'Shield',
    title: { de: 'Wurzelbehandlung', en: 'Root Canal Treatment' },
    category: { de: 'Zahnerhalt', en: 'Tooth Preservation' },
    description: {
      de: 'Moderne Wurzelkanalbehandlung zum Erhalt tief erkrankter Zaehne mit Praezision und zeitgemaesser Technik.',
      en: 'Modern root canal treatment to preserve deeply affected teeth with precision and contemporary technology.',
    },
    detail: {
      de: 'Infizierte Kanaele werden gereinigt und Entzuendungen im Zahninnern meist beseitigt. Erfahrung, Praezision auf kleinstem Raum und moderne Technik sind dabei entscheidend.',
      en: 'Infected canals are cleaned and inflammation inside the tooth is usually removed. Experience, precision, and modern technology are essential.',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_2ad317ce941945878d5511515fc7abc4~mv2.jpeg'),
    benefits: {
      de: ['Kofferdam', 'Elektrische Wurzellaengenmessung', 'Maschinelle Aufbereitung', 'Zahnerhalt'],
      en: ['Rubber dam', 'Electronic length measurement', 'Machine-assisted preparation', 'Tooth preservation'],
    },
  },
  {
    id: 'paradontose-behandlung',
    icon: 'Shield',
    title: { de: 'Paradontose Behandlung', en: 'Periodontal Treatment' },
    category: { de: 'Parodontologie', en: 'Periodontics' },
    description: {
      de: 'Behandlung chronischer Entzuendungen des Zahnhalteapparates zum Erhalt gesunder Zaehne und Kieferstrukturen.',
      en: 'Treatment of chronic inflammation in the supporting structures of the teeth to preserve oral health.',
    },
    detail: {
      de: 'Unbehandelte Parodontitis kann zu Knochenabbau und Zahnverlust fuehren und auch die Allgemeingesundheit beeinflussen. Die Behandlung zielt auf Entzuendungskontrolle und Stabilitaet ab.',
      en: 'Untreated periodontitis can lead to bone loss, tooth loss, and broader health effects. Treatment focuses on inflammation control and stability.',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_0e456e3ddd784730be755d7b47adaf84~mv2.jpg'),
    benefits: {
      de: ['Entzuendungsreduktion', 'Erhalt des Zahnhalteapparates', 'Schutz des Kieferknochens', 'Langfristige Stabilitaet'],
      en: ['Inflammation reduction', 'Support structure preservation', 'Jawbone protection', 'Long-term stability'],
    },
  },
  {
    id: 'aesthetische-behandlung',
    icon: 'Sparkles',
    title: { de: 'Aesthetische Behandlung', en: 'Aesthetic Treatment' },
    category: { de: 'Aesthetik', en: 'Aesthetics' },
    description: {
      de: 'Aesthetische Zahnbehandlungen wie Zoom Bleaching fuer ein sichtbar helleres und gepflegteres Laecheln.',
      en: 'Aesthetic dental treatments such as Zoom bleaching for a visibly brighter smile.',
    },
    detail: {
      de: 'Beim ZOOM-Bleaching wird ein aufhellendes Gel auf die Zaehne aufgetragen und mit einer Speziallampe aktiviert, um die Wirksamkeit zu steigern.',
      en: 'With ZOOM bleaching, a whitening gel is applied to the teeth and activated by a special lamp to increase effectiveness.',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_12113e96162a40309a3f023f5ba18a4d~mv2.jpg'),
    benefits: {
      de: ['Zoom Bleaching', 'Sichtbare Aufhellung', 'Schonendes Verfahren', 'Aesthetischer Fokus'],
      en: ['Zoom bleaching', 'Visible whitening', 'Gentle procedure', 'Aesthetic focus'],
    },
  },
  {
    id: 'veneers',
    icon: 'Smile',
    title: { de: 'Veneers', en: 'Veneers' },
    category: { de: 'Aesthetik', en: 'Aesthetics' },
    description: {
      de: 'Sehr duenne keramische Verblendschalen zur Verbesserung der Frontzahn-Aesthetik bei Luecken, leichten Fehlstellungen oder optischen Stoerungen.',
      en: 'Very thin ceramic shells to improve front-tooth aesthetics for gaps, mild misalignment, or cosmetic concerns.',
    },
    detail: {
      de: 'Veneers werden von aussen auf die Schneidezaehne aufgesetzt. Sie sind haltbar und kaum von natuerlichen Zaehnen zu unterscheiden.',
      en: 'Veneers are placed on the outside of front teeth. They are durable and difficult to distinguish from natural teeth.',
    },
    duration: 'nach Planung',
    price: 'individuell',
    image: wixMedia('5d64f5_cb0beef0d71f4823a8b864423360bac9~mv2.jpg'),
    benefits: {
      de: ['Keramische Verblendschalen', 'Bei Zahnluecken', 'Bei leichten Fehlstellungen', 'Natuerliche Optik'],
      en: ['Ceramic shells', 'For tooth gaps', 'For slight misalignment', 'Natural appearance'],
    },
  },
  {
    id: 'kinder-zahnbehandlungen',
    icon: 'Smile',
    title: { de: 'Kinder Zahnbehandlungen', en: 'Children’s Dental Care' },
    category: { de: 'Kinderzahnheilkunde', en: 'Pediatric Dentistry' },
    description: {
      de: 'Fruehe Vorsorge- und Kontrolluntersuchungen mit speziell zugeschnittenen Prophylaxekonzepten fuer Kinder.',
      en: 'Early preventive and checkup visits with tailored prophylaxis concepts for children.',
    },
    detail: {
      de: 'In der Kindheit wird der Grundstein fuer Zahn- und Mundgesundheit gelegt. Die Praxis plant viel Zeit fuer kleine Patienten ein und unterstuetzt Familien mit Recall-Terminen.',
      en: 'Childhood lays the foundation for lifelong oral health. The clinic dedicates extra time to young patients and supports families with recall visits.',
    },
    duration: 'nach Bedarf',
    price: 'individuell',
    image: wixMedia('5d64f5_f3b8cb5d64614742a9dc3b78209762a9~mv2.jpg'),
    benefits: {
      de: ['Fruehe Vorsorge', 'Kontrolluntersuchungen', 'Recall-System', 'Kindgerechte Betreuung'],
      en: ['Early prevention', 'Checkups', 'Recall system', 'Child-friendly care'],
    },
  },
  {
    id: 'kieferorthopaeden',
    icon: 'Shield',
    title: { de: 'Kieferorthopaeden', en: 'Orthodontics' },
    category: { de: 'Kieferorthopaedie', en: 'Orthodontics' },
    description: {
      de: 'Unterstuetzung fuer eine gute Zahn- und Kieferstellung als Grundlage fuer Gesundheit, Wohlbefinden und ein sicheres Auftreten.',
      en: 'Support for healthy tooth and jaw alignment as a foundation for well-being and confidence.',
    },
    detail: {
      de: 'Eine korrekte Zahn- und Kieferstellung ist elementar fuer Gesundheit und Wohlbefinden. Eine fruehe Vorstellung in der Praxis wird auf der Website besonders empfohlen.',
      en: 'Proper tooth and jaw alignment is presented as essential for health and well-being. The website especially recommends early consultation.',
    },
    duration: 'nach Beratung',
    price: 'individuell',
    image: wixMedia('5d64f5_cb0beef0d71f4823a8b864423360bac9~mv2.jpg'),
    benefits: {
      de: ['Fruehe Beratung', 'Zahn- und Kieferstellung', 'Gesundheit und Aesthetik', 'Sicheres Auftreten'],
      en: ['Early consultation', 'Tooth and jaw alignment', 'Health and aesthetics', 'Confidence'],
    },
  },
];

export const galleryImages = [
  {
    url: wixMedia('5d64f5_ced5b909cca849a9b74254318ee1cf96~mv2.jpg'),
    title: { de: 'Professionalitaet und Freundlichkeit', en: 'Professionalism and Friendliness' },
    description: {
      de: 'Unser Team besteht aus hochqualifizierten Fachleuten, die sich durch ihre Freundlichkeit und Professionalitaet auszeichnen.',
      en: 'Our team consists of highly qualified professionals known for friendliness and professionalism.',
    },
  },
  {
    url: wixMedia('5d64f5_e232489f79294b33acda05942a23f5db~mv2.jpg'),
    title: { de: 'Behandlungsraum', en: 'Treatment Room' },
    description: {
      de: 'Ein echter Einblick in die Praxisraeume von Zahnarztpraxis Zahnarzt Johnny.',
      en: 'A real look into the clinic spaces of Dentist Johnny Najmeh.',
    },
  },
  {
    url: wixMedia('5d64f5_c7cbe58af220444f9ca064a9f111db60~mv2.jpg'),
    title: { de: 'Praxisimpression', en: 'Clinic Impression' },
    description: {
      de: 'Originalbild aus der aktuellen Website-Galerie der Praxis.',
      en: 'Original image from the current website gallery.',
    },
  },
  {
    url: wixMedia('5d64f5_126b2ff5ce244e2eb52e56cd03e6eb9c~mv2.jpg'),
    title: { de: 'Moderne Praxis', en: 'Modern Clinic' },
    description: {
      de: 'Bildmaterial direkt aus der Live-Praesenz der Praxis.',
      en: 'Imagery used directly from the live clinic website.',
    },
  },
  {
    url: wixMedia('5d64f5_377f00d6bbec4a2d82c6126999e98161~mv2.jpg'),
    title: { de: 'Zahnarzt Johnny Najmeh', en: 'Dentist Johnny Najmeh' },
    description: {
      de: 'Portraetbild von Zahnarzt Johnny Najmeh aus den auf der Website hinterlegten Medien.',
      en: 'Portrait of Dentist Johnny Najmeh from the media published on the website.',
    },
  },
  {
    url: wixMedia('5d64f5_ec92fda0264d4c98a90fe4898eef3593~mv2.jpg'),
    title: { de: 'Weitere Praxisansicht', en: 'Additional Clinic View' },
    description: {
      de: 'Weitere Originalaufnahme aus den veroeffentlichten Praxisbildern.',
      en: 'Another original image from the published clinic gallery.',
    },
  },
];

export const testimonials = [
  {
    author: 'Zahnarztpraxis Zahnarzt Johnny',
    quote: {
      de: 'Besuchen Sie die Zahnarztpraxis Zahnarzt Johnny in Freiburg, die taeglich geoeffnet ist, auch am Wochenende.',
      en: 'Visit Dentist Johnny Najmeh in Freiburg, open daily, including weekends.',
    },
  },
  {
    author: 'Zahnarztpraxis Zahnarzt Johnny',
    quote: {
      de: 'Wir bieten hochwertige Zahnbehandlungen und Notfalldienste.',
      en: 'We offer high-quality dental treatments and emergency services.',
    },
  },
  {
    author: 'Zahnarztpraxis Zahnarzt Johnny',
    quote: {
      de: 'Entdecken Sie unsere freundliche Betreuung und professionellen Service fuer ein gesundes Laecheln.',
      en: 'Discover our friendly care and professional service for a healthy smile.',
    },
  },
];

export const stats = [
  { value: 8, suffix: '', label: { de: 'Importierte Leistungen', en: 'Imported Services' } },
  { value: 30, suffix: ' min', label: { de: 'Online-Buchungsdauer', en: 'Online Booking Duration' } },
  { value: 7, suffix: '', label: { de: 'Tage pro Woche geoeffnet', en: 'Days Open Per Week' } },
];
