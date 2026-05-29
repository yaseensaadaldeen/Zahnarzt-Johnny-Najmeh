const wixMedia = (id) => `/images/${id}`;

export const bookingServices = [
  {
    id: 'zahnaerztliche-untersuchung',
    title: { de: 'Zahnärztliche Untersuchung', en: 'Dental Examination' },
    duration: { de: '30 Min.', en: '30 min.' },
    price: { de: 'Kostenfallabhängig', en: 'Cost depends on case' },
    image: wixMedia('5d64f5_b284d564ce1f4f43b27a282b42bba57c~mv2.jpg'),
  },
];

export const homeGalleryImages = [
  wixMedia('5d64f5_ced5b909cca849a9b74254318ee1cf96~mv2.jpg'),
  wixMedia('5d64f5_4d3e2eaa59a149f7a3e706362aa42191~mv2.jpg'),
  wixMedia('5d64f5_b284d564ce1f4f43b27a282b42bba57c~mv2.jpg'),
  wixMedia('5d64f5_5f3e6a70357b403980e8d264e0cdb416~mv2.jpg'),
  wixMedia('5d64f5_ed7464745c8f47128a625ac166b85e1e~mv2.jpg'),
  wixMedia('5d64f5_5419f2cb10cc4b13967031e5bb9ea297~mv2.jpg'),
  wixMedia('5d64f5_2787f2f708674c43bbc31104dbd82473~mv2.jpg'),
  wixMedia('5d64f5_d032ad9cb3264122863b1a9b82669440~mv2.jpg'),
];

export const services = [
  {
    id: 'zahnersatz',
    icon: 'Heart',
    title: { de: 'Zahnersatz', en: 'Dental Prosthetics' },
    category: { de: 'Zahnersatz', en: 'Restoration' },
    description: {
      de: 'Die eigenen Zähne ein Leben lang bewahren ein solcher Idealzustand lässt sich leider nicht für jeden Patienten erfüllen. Jedoch braucht heute in der Regel niemand mehr auf funktionelle und natürlich aussehende Zähne zu verzichten: Festsitzender oder herausnehmbarer Zahnersatz, zahn- oder implantatgetragene Kronen, Brücken oder Prothesen, das Angebot reicht von der hochwertigen Metalllegierung bis hin zur ästhetischen Vollkeramik.',
      en: 'Preserving your own teeth for a lifetime is not always possible, but today no one has to go without functional, natural-looking teeth. Options range from fixed or removable prosthetics to implant-supported crowns, bridges, dentures, and aesthetic all-ceramic restorations.',
    },
    detail: {
      de: 'Zahnersatzarten im Überblick: Kronen und Teilkronen, wenn ein großer Teil der Zahnkrone beschädigt ist | Brücken, wenn einer oder mehrere Zähne nebeneinander fehlen | Teil- und Vollprothesen, wenn eine Brücke nicht mehr ausreicht bzw. bei zahnlosem Kiefe.',
      en: 'Types of dental prosthetics: Crowns and partial crowns when a large part of the tooth is damaged | Bridges when one or more adjacent teeth are missing | Partial and full dentures when a bridge is no longer sufficient or for edentulous jaws.',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_848872d48f8f435282da787468da6b96~mv2.jpeg'),
    benefits: {
      de: ['Kronen und Teilkronen', 'Brücken', 'Teil- und Vollprothesen', 'Hochwertige Metalllegierung', 'Ästhetische Vollkeramik'],
      en: ['Crowns and partial crowns', 'Bridges', 'Partial and full dentures', 'High-quality metal alloys', 'Aesthetic all-ceramic'],
    },
  },
  {
    id: 'wurzelbehandlung',
    icon: 'Shield',
    title: { de: 'Wurzelbehandlung', en: 'Root Canal Treatment' },
    category: { de: 'Zahnerhalt', en: 'Tooth Preservation' },
    description: {
      de: 'Die nach modernen Maßstäben durchgeführte Wurzelkanalbehandlung stellt eine erfolgversprechende Möglichkeit dar, tief wurzelerkrankte Zähne zu erhalten. Mussten diese früher in der Regel gezogen werden, können wir heute die infizierten Kanäle reinigen und die Entzündung im Zahninnern meist beseitigen.Dabei sind Erfahrung, Präzision auf kleinstem Raum und moderne Technik erforderlich, da die Wurzelkanäle haarfein und teilweise stark verästelt sind.',
      en: 'Root canal treatment performed to modern standards offers a promising way to preserve deeply diseased teeth. While these used to be extracted, we can now clean the infected canals and eliminate inflammation inside the tooth. This requires experience, precision, and modern technology, as the canals are hair-thin and heavily branched.',
    },
    detail: {
      de: 'Moderne Technik für den Zahnerhalt: Kofferdam | Elektrisches Wurzellängenmessgerät | Maschinelle Wurzelkanalaufbereitung',
      en: 'Modern technology for tooth preservation: Rubber dam | Electronic apex locator | Mechanical root canal preparation',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_2ad317ce941945878d5511515fc7abc4~mv2.jpeg'),
    benefits: {
      de: ['Kofferdam', 'Elektrisches Wurzellängenmessgerät', 'Maschinelle Wurzelkanalaufbereitung'],
      en: ['Rubber dam', 'Electronic apex locator', 'Mechanical root canal preparation'],
    },
  },
  {
    id: 'paradontose-behandlung',
    icon: 'Shield',
    title: { de: 'Paradontose Behandlung', en: 'Periodontal Treatment' },
    category: { de: 'Parodontologie', en: 'Periodontics' },
    description: {
      de: 'Die Parodontitis ist eine durch bakterielle Zahnbeläge verursachte, chronische Entzündung des Zahnhalteapparates. Sie ist mittlerweile Hauptursache für den Verlust eigentlich gesunder Zähne bei Erwachsenen. Wird eine Parodontitis nicht behandelt, kommt es zu einer Schädigung des Kieferknochens – die Zähne verlieren ihren festen Halt. Darüber hinaus kann eine unbehandelte Parodontitis auch die Allgemeingesundheit beeinträchtigen.',
      en: 'Periodontitis is a chronic inflammation of the tooth-supporting structures caused by bacterial plaque. It is now the main cause of tooth loss in adults. Untreated, it leads to jawbone damage and can also affect general health.',
    },
    detail: {
      de: 'Eine Parodontitis kann nicht geheilt, aber durch eine systematische Zahnfleischtaschenreinigung aufgehalten werden.',
      en: 'Periodontitis cannot be cured, but it can be halted through systematic periodontal pocket cleaning.',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_fecccd6ab7a245f8bb6dddc7f264ee53~mv2.jpg'),
    benefits: {
      de: ['Systematische Zahnfleischtaschenreinigung', 'Erhalt des Kieferknochens', 'Schutz der Allgemeingesundheit', 'Langfristige Stabilität'],
      en: ['Systematic pocket cleaning', 'Jawbone preservation', 'General health protection', 'Long-term stability'],
    },
  },
  {
    id: 'aesthetische-behandlung',
    icon: 'Sparkles',
    title: { de: 'Ästhetische Behandlung', en: 'Aesthetic Treatment' },
    category: { de: 'Ästhetik', en: 'Aesthetics' },
    description: {
      de: 'Möchten Sie Ihre Zahnfarbe aufhellen, können wir ein Bleaching durchführen. Wir verwenden dabei das moderne ZOOM!®-Bleaching-System. Bei diesem Verfahren wird auf den einzelnen Zahn oder die gesamte Zahnreihe ein aufhellendes Gel aufgetragen und die Oberfläche anschließend mit einer Speziallampe bestrahlt. Das Licht aktiviert das Gel und erhöht so die Wirksamkeit des Bleachings. Eine solche Aufhellung ist für gesunde Zähne unbedenklich, vorab empfehlen wir allerdings eine professionelle Zahnreinigung. Dabei werden harte und weiche Beläge auf der Zahnoberfläche entfernt, sodass das Mittel besser einwirken kann.',
      en: 'Would you like to brighten your tooth color? We use the ZOOM!® bleaching system. A whitening gel is applied and activated with a special lamp. This is safe for healthy teeth; we recommend a professional cleaning beforehand so the agent can work more effectively.',
    },
    detail: {
      de: 'Veneers: Veneers sind sehr dünne Verblendschalen aus Keramik, die von außen auf die Schneidezähne aufgesetzt werden. Wir empfehlen sie bei Zahnlücken, leichten Fehlstellungen oder unschönem Aussehen der Frontzähne, um die Zahnästhetik zu verbessern. Sie sind sehr haltbar und kaum von den natürlichen Zähnen zu unterscheiden.',
      en: 'Veneers: Veneers are very thin ceramic shells placed on the outside of front teeth. We recommend them for gaps, slight misalignment, or unattractive front teeth. They are durable and barely distinguishable from natural teeth.',
    },
    duration: 'nach Befund',
    price: 'individuell',
    image: wixMedia('5d64f5_12113e96162a40309a3f023f5ba18a4d~mv2.jpg'),
    benefits: {
      de: ['ZOOM!® Bleaching', 'Veneers', 'Professionelle Zahnreinigung', 'Natürliche Ästhetik'],
      en: ['ZOOM!® bleaching', 'Veneers', 'Professional cleaning', 'Natural aesthetics'],
    },
  },
  {
    id: 'kinder-zahnbehandlungen',
    icon: 'Smile',
    title: { de: 'Kinder Zahnbehandlungen', en: "Children's Dental Care" },
    category: { de: 'Kinderzahnheilkunde', en: 'Pediatric Dentistry' },
    description: {
      de: 'In der Kindheit wird der Grundstein für eine Zahn- und Mundgesundheit bis ins Erwachsenenalter gelegt. Daher sind Vorsorge- und Kontrolluntersuchungen bereits frühzeitig empfehlenswert. Wir unterstützen Sie und Ihr Kind dabei mit speziell zugeschnittenen Prophylaxekonzepten und regelmäßigen Kontrollterminen, an die wir Sie auch gern im Rahmen unseres Recall-Systems erinnern. Unseren kleinen Patienten widmen wir besondere Aufmerksamkeit und planen viel Zeit für die Termine ein.',
      en: 'Childhood lays the foundation for lifelong dental and oral health. Preventive checkups are recommended early on. We support you with tailored prophylaxis concepts and regular appointments through our recall system. We dedicate special attention to our young patients and schedule plenty of time for their visits.',
    },
    detail: {
      de: 'Vorsorge und Kontrolle für die kleinsten Patienten – mit viel Zeit und Einfühlungsvermögen.',
      en: 'Prevention and checkups for the smallest patients – with plenty of time and empathy.',
    },
    duration: 'nach Bedarf',
    price: 'individuell',
    image: wixMedia('5d64f5_f3b8cb5d64614742a9dc3b78209762a9~mv2.jpg'),
    benefits: {
      de: ['Frühzeitige Vorsorge', 'Kontrolluntersuchungen', 'Recall-System', 'Viel Zeit für kleine Patienten'],
      en: ['Early prevention', 'Checkups', 'Recall system', 'Extra time for children'],
    },
  },
  {
    id: 'kieferorthopaeden',
    icon: 'Shield',
    title: { de: 'Kieferorthopäden', en: 'Orthodontics' },
    category: { de: 'Kieferorthopädie', en: 'Orthodontics' },
    description: {
      de: 'Gesundheit, Schönheit, Ästhetik, Erfolg Der Mensch als Ganzes Sicher gibt es eine Formel für die Schönheit… wir finden jedoch, Schönheit liegt immer im Auge des Betrachters. Klar ist, Zähne tragen maßgeblich zu unserem Erscheinungsbild bei und entscheiden darüber, wie uns unser Umfeld wahrnimmt. Eine gute/korrekte Zahn- und Kieferstellung ist elementar vor allem für unsere Gesundheit und unser Wohlbefinden aber auch wiederum ein Garant für ein selbstsicheres Auftreten. Bereits im Kindesalter legen Sie den Grundstein für eine gesunde Zahnentwicklung. Für beste Ergebnisse, um so wichtiger, dass Sie sich frühzeitig in unserer Praxis vorstellen.',
      en: 'Health, beauty, aesthetics, success – the whole person. Teeth significantly contribute to our appearance. Proper tooth and jaw alignment is fundamental for health and well-being and a guarantee of self-confidence. Childhood lays the foundation for healthy dental development. For the best results, early consultation in our practice is important.',
    },
    detail: {
      de: 'Frühzeitige Vorstellung für beste Ergebnisse – legen Sie bereits im Kindesalter den Grundstein.',
      en: 'Early consultation for the best results – lay the foundation in childhood.',
    },
    duration: 'nach Beratung',
    price: 'individuell',
    image: wixMedia('5d64f5_cb0beef0d71f4823a8b864423360bac9~mv2.jpg'),
    benefits: {
      de: ['Gesunde Zahnentwicklung', 'Korrekte Kieferstellung', 'Selbstsicheres Auftreten', 'Frühzeitige Beratung'],
      en: ['Healthy dental development', 'Correct jaw alignment', 'Self-confidence', 'Early consultation'],
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
      de: 'Bildmaterial direkt aus der aktuellen Website-Galerie der Praxis.',
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
  ...homeGalleryImages.slice(1).map((src) => ({ url: src })),
];

export const testimonials = [
  {
    author: 'Zahnarztpraxis Zahnarzt Johnny',
    quote: {
      de: 'Besuchen Sie die Zahnarztpraxis Zahnarzt Johnny in Ludwigshafen am Rhein, die taeglich geoeffnet ist, auch am Wochenende.',
      en: 'Visit Dentist Johnny Najmeh in Ludwigshafen am Rhein, open daily, including weekends.',
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
