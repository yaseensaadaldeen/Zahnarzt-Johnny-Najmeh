import { useParams, Link } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Clock, CheckCircle, ArrowLeft } from 'lucide-react';

export function ServiceDetail() {
  const { id } = useParams();

  const serviceData: Record<string, any> = {
    preventive: {
      title: 'Professional Teeth Cleaning',
      category: 'Preventive Care',
      image: '/images/treatment_room.jpg',
      duration: '45-60 minutes',
      description: 'Professional teeth cleaning is an essential part of maintaining optimal oral health. Our dental hygienists use advanced techniques and equipment to thoroughly clean your teeth, removing plaque, tartar, and surface stains that regular brushing cannot eliminate.',
      benefits: [
        'Prevents cavities and gum disease',
        'Removes stubborn plaque and tartar buildup',
        'Freshens breath and brightens smile',
        'Early detection of dental problems',
        'Reduces risk of heart disease and stroke',
        'Maintains overall oral health'
      ],
      whatToExpect: [
        'Thorough examination of teeth and gums',
        'Removal of plaque and tartar with specialized tools',
        'Professional polishing to remove surface stains',
        'Flossing and fluoride treatment',
        'Personalized oral hygiene recommendations'
      ]
    },
    emergency: {
      title: 'Emergency Dental Care',
      category: 'Emergency',
      image: '/images/reception.jpg',
      duration: 'As needed',
      description: 'Dental emergencies can happen at any time. We provide same-day emergency appointments every day of the week to address urgent dental issues and provide immediate relief.',
      benefits: [
        'Immediate pain relief',
        'Prevention of further damage',
        'Same-day appointments available',
        'Open every day of the week',
        'Expert emergency care',
        'Advanced pain management'
      ],
      whatToExpect: [
        'Rapid assessment of your condition',
        'Immediate pain management',
        'X-rays if necessary',
        'Treatment to address the emergency',
        'Follow-up care instructions'
      ]
    },
    whitening: {
      title: 'Teeth Whitening',
      category: 'Cosmetic Dentistry',
      image: '/images/dental_equipment.jpg',
      duration: '60-90 minutes',
      description: 'Professional teeth whitening delivers dramatic results that over-the-counter products cannot match. Our advanced whitening system safely and effectively brightens your smile by several shades in just one visit.',
      benefits: [
        'Immediate, noticeable results',
        'Safe and effective treatment',
        'Customized to your desired shade',
        'Long-lasting white smile',
        'Boosts confidence and self-esteem',
        'Professional supervision'
      ],
      whatToExpect: [
        'Consultation to determine your desired results',
        'Protection of gums and soft tissues',
        'Application of professional-grade whitening gel',
        'Activation with specialized light',
        'Post-treatment care instructions'
      ]
    }
  };

  const service = serviceData[id as string] || serviceData.preventive;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link to="/services" className="inline-flex items-center gap-2 text-white mb-4 hover:underline">
              <ArrowLeft size={20} />
              Back to Services
            </Link>
            <span className="inline-block px-3 py-1 bg-primary text-white rounded-full text-sm mb-4">
              {service.category}
            </span>
            <h1 className="font-serif text-5xl font-bold text-white">{service.title}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="prose max-w-none">
              <h2 className="font-serif text-3xl font-bold mb-4">About This Service</h2>
              <p className="text-lg text-muted-foreground mb-8">{service.description}</p>

              <h3 className="font-serif text-2xl font-semibold mb-4">Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {service.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-serif text-2xl font-semibold mb-4">What to Expect</h3>
              <div className="space-y-3">
                {service.whatToExpect.map((step: string, index: number) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-serif text-xl font-semibold mb-4">Service Details</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5" />
                  <div>
                    <div className="text-sm">Duration</div>
                    <div className="font-semibold text-foreground">{service.duration}</div>
                  </div>
                </div>
              </div>
              <Link to="/book">
                <Button variant="primary" className="w-full mb-3">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary" className="w-full">
                  Ask a Question
                </Button>
              </Link>

              <div className="mt-8 p-4 bg-secondary rounded-lg">
                <h4 className="font-semibold mb-2">Need Help Choosing?</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Not sure if this is the right treatment for you? Contact us for a free consultation.
                </p>
                <a href="tel:+497612345678" className="text-primary font-medium text-sm hover:underline">
                  Call us: +49 761 234 5678
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Related Services */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold mb-8">Related Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['preventive', 'whitening', 'emergency']
              .filter(s => s !== id)
              .slice(0, 3)
              .map((serviceId) => (
                <Card key={serviceId} hover className="p-6">
                  <h3 className="font-serif text-xl font-semibold mb-3">
                    {serviceData[serviceId]?.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {serviceData[serviceId]?.description.slice(0, 100)}...
                  </p>
                  <Link to={`/services/${serviceId}`} className="text-primary font-medium hover:underline">
                    Learn more →
                  </Link>
                </Card>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}
