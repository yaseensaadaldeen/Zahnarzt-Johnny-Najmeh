import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { SEO } from '../components/SEO';
import { Shield, Sparkles, Heart, Clock, Smile, Stethoscope, Wrench, Baby } from 'lucide-react';

export function Services() {
  const services = [
    {
      id: 'preventive',
      icon: <Shield className="w-12 h-12" />,
      title: 'Professional Teeth Cleaning',
      category: 'Preventive Care',
      description: 'Thorough cleaning to remove plaque, tartar, and stains. Keeps your teeth healthy and your smile bright.',
      duration: '45-60 min',
      image: '/images/treatment_room.jpg'
    },
    {
      id: 'checkup',
      icon: <Stethoscope className="w-12 h-12" />,
      title: 'Dental Checkup & Examination',
      category: 'Preventive Care',
      description: 'Comprehensive oral examination including X-rays and early detection of potential issues.',
      duration: '30-45 min',
      image: '/images/checkup.jpg'
    },
    {
      id: 'whitening',
      icon: <Sparkles className="w-12 h-12" />,
      title: 'Teeth Whitening',
      category: 'Cosmetic Dentistry',
      description: 'Professional whitening treatment for a brighter, more confident smile.',
      duration: '60-90 min',
      image: '/images/dental_equipment.jpg'
    },
    {
      id: 'veneers',
      icon: <Smile className="w-12 h-12" />,
      title: 'Veneers',
      category: 'Cosmetic Dentistry',
      description: 'Custom porcelain veneers to transform your smile and correct imperfections.',
      duration: '2-3 visits',
      image: '/images/veneers.jpg'
    },
    {
      id: 'fillings',
      icon: <Wrench className="w-12 h-12" />,
      title: 'Fillings & Cavities',
      category: 'Restorative Care',
      description: 'High-quality composite fillings that match your natural tooth color.',
      duration: '30-60 min',
      image: '/images/fillings.jpg'
    },
    {
      id: 'crowns',
      icon: <Heart className="w-12 h-12" />,
      title: 'Crowns & Bridges',
      category: 'Restorative Care',
      description: 'Durable crowns and bridges to restore damaged or missing teeth.',
      duration: '2-3 visits',
      image: '/images/crowns.jpg'
    },
    {
      id: 'implants',
      icon: <Sparkles className="w-12 h-12" />,
      title: 'Dental Implants',
      category: 'Restorative Care',
      description: 'Permanent solution for missing teeth with natural-looking results.',
      duration: 'Multiple visits',
      image: '/images/implants.jpg'
    },
    {
      id: 'emergency',
      icon: <Clock className="w-12 h-12" />,
      title: 'Emergency Dental Care',
      category: 'Emergency',
      description: 'Immediate care for dental emergencies. Available every day of the week.',
      duration: 'As needed',
      image: '/images/reception.jpg'
    },
    {
      id: 'root-canal',
      icon: <Stethoscope className="w-12 h-12" />,
      title: 'Root Canal Treatment',
      category: 'Restorative Care',
      description: 'Gentle, effective root canal therapy to save infected teeth.',
      duration: '60-90 min',
      image: '/images/treatment_room.jpg'
    },
    {
      id: 'pediatric',
      icon: <Baby className="w-12 h-12" />,
      title: 'Pediatric Dentistry',
      category: 'Preventive Care',
      description: 'Specialized care for children in a friendly, comfortable environment.',
      duration: '30-45 min',
      image: '/images/waiting_area.jpg'
    }
  ];

  const categories = ['All', 'Preventive Care', 'Cosmetic Dentistry', 'Restorative Care', 'Emergency'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50">
      <SEO
        title="Leistungen – Zahnarzt Johnny Najmeh | Zahnarzt in Ludwigshafen am Rhein"
        description="Entdecken Sie unser Leistungsspektrum: Professionelle Zahnreinigung, Zahnimplantate, Kieferorthopädie, ästhetische Zahnmedizin und mehr. Zahnarzt Johnny Najmeh in Ludwigshafen am Rhein."
        canonical="/services"
      />
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-cyan-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Comprehensive dental care using state-of-the-art technology and techniques
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card key={service.id} hover className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-primary">{service.icon}</span>
                    <span className="text-sm font-medium text-primary">{service.category}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {service.duration}
                    </span>
                  </div>
                  <Link to={`/services/${service.id}`}>
                    <Button variant="primary" className="w-full">
                      Book This Service
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-4">Not Sure Which Service You Need?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact us for a consultation and we'll help you find the right treatment
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/book">
              <Button variant="primary" className="px-8 py-3">Schedule Consultation</Button>
            </Link>
            <Link to="/contact">
              <Button variant="secondary" className="px-8 py-3">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
