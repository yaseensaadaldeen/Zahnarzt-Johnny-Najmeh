import { Link } from 'react-router';
import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Shield, Heart, Clock, Sparkles, ChevronLeft, ChevronRight, MapPin, Star } from 'lucide-react';

export function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [bookingForm, setBookingForm] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  });

  const services = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Preventive Care',
      description: 'Regular checkups, professional cleaning, and early detection to keep your teeth healthy.',
      link: '/services/preventive'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Cosmetic Dentistry',
      description: 'Teeth whitening, veneers, and smile makeovers for a confident, beautiful smile.',
      link: '/services/cosmetic'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Restorative Care',
      description: 'Fillings, crowns, bridges, and implants to restore function and appearance.',
      link: '/services/restorative'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Emergency Care',
      description: 'Same-day appointments for dental emergencies. We are open every day of the week.',
      link: '/services/emergency'
    }
  ];

  const testimonials = [
    {
      text: 'Dentist Najmeh and his team made me feel completely at ease. The clinic is modern and spotless. Highly recommend!',
      author: 'Maria Schmidt',
      rating: 5
    },
    {
      text: 'Best dental experience I have ever had. The staff is professional, friendly, and the technology is state-of-the-art.',
      author: 'Thomas Weber',
      rating: 5
    },
    {
      text: 'I was impressed by how comfortable the entire process was. Dentist Najmeh explained everything clearly.',
      author: 'Anna Müller',
      rating: 5
    }
  ];

  const galleryImages = [
    {
      url: '/images/treatment_room.jpg',
      caption: 'State-of-the-art treatment room'
    },
    {
      url: '/images/waiting_area.jpg',
      caption: 'Comfortable waiting area'
    },
    {
      url: '/images/dental_equipment.jpg',
      caption: 'Modern dental equipment'
    },
    {
      url: '/images/reception.jpg',
      caption: 'Welcoming reception'
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking request:', bookingForm);
    alert('Thank you! We will contact you shortly to confirm your appointment.');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-6">
              {t('Zahnarzt Johnny Najmeh', 'Dentist Johnny Najmeh')}
            </h1>
            <p className="text-2xl md:text-3xl text-foreground/80 mb-4">
              Modern Dentistry, Every Day
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Schanzstraße 105, Ludwigshafen am Rhein. Wir sind jeden Tag der Woche für Sie da.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book">
                <Button variant="primary" className="text-lg px-8 py-4">
                  Book Appointment
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary" className="text-lg px-8 py-4">
                  View Services
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Booking Widget */}
          <Card className="max-w-4xl mx-auto p-8 shadow-2xl">
            <h2 className="font-serif text-2xl font-semibold mb-6 text-center">Quick Appointment Request</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Service</label>
                  <select
                    className="px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value })}
                    required
                  >
                    <option value="">Select service</option>
                    <option value="preventive">Preventive Care</option>
                    <option value="cosmetic">Cosmetic Dentistry</option>
                    <option value="restorative">Restorative Care</option>
                    <option value="emergency">Emergency Care</option>
                  </select>
                </div>
                <Input
                  type="date"
                  label="Preferred Date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  required
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Preferred Time</label>
                  <select
                    className="px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                    required
                  >
                    <option value="">Select time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="text"
                  label="Full Name"
                  placeholder="John Doe"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                  required
                />
                <Input
                  type="tel"
                  label="Phone"
                  placeholder="+49 123 456 7890"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  label="Email"
                  placeholder="john@example.com"
                  value={bookingForm.email}
                  onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Request Appointment
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive dental care using the latest technology and techniques
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card key={index} hover className="p-6">
                <div className="text-primary mb-4">{service.icon}</div>
                <h3 className="font-semibold text-xl mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <Link to={service.link} className="text-primary font-medium hover:underline">
                  Learn more →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Clinic Gallery */}
      <section className="py-20 bg-gradient-to-b from-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold mb-4">Our Modern Clinic</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience comfort and care in our state-of-the-art facility
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl aspect-video">
                <img
                  src={image.url}
                  alt={image.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <p className="text-white font-medium">{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/gallery">
              <Button variant="secondary">View Full Gallery</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Modern Technology</h3>
              <p className="text-muted-foreground">
                Latest equipment and techniques for precise, comfortable treatments
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Welcoming Environment</h3>
              <p className="text-muted-foreground">
                Comfortable, calming atmosphere designed with your peace of mind
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Open Every Day</h3>
              <p className="text-muted-foreground">
                Available Monday through Sunday, including emergency appointments
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Patient Comfort</h3>
              <p className="text-muted-foreground">
                Your comfort and well-being are our top priorities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Map */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">Visit Us</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <Card className="p-8 h-full">
                <h3 className="font-serif text-2xl font-semibold mb-6">Location & Contact</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Address</div>
                      <p className="text-muted-foreground">
                        Schanzstraße 105<br />
                        67063 Ludwigshafen am Rhein<br />
                        Germany
                      </p>
                      <a
                        href="https://maps.google.com/?q=Schanzstrasse+105+Ludwigshafen"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline inline-block mt-2"
                      >
                        Open in Google Maps →
                      </a>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">How to Get Here</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>🚗 By car: Free parking behind the clinic</li>
                      <li>🚊 By tram: Tram and bus stops nearby</li>
                      <li>🚶 By foot: 5 minutes from main station</li>
                      <li>📍 Next to Rewe supermarket</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
            <div>
              <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2710.2!2d7.8494!3d48.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDAwJzAwLjAiTiA3wrg1MCc1OC4wIkU!5e0!3m2!1sen!2sde!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-4xl font-bold text-center mb-12">What Our Patients Say</h2>
          <div className="max-w-3xl mx-auto">
            <Card className="p-8 md:p-12">
              <div className="flex gap-1 mb-6 justify-center">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-xl text-center text-foreground mb-6 italic">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="text-center font-semibold text-primary">
                — {testimonials[currentTestimonial].author}
              </p>
              <div className="flex justify-center gap-4 mt-8">
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-cyan-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">Ready to Transform Your Smile?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Book your appointment today and experience modern dentistry at its finest
          </p>
          <Link to="/book">
            <Button variant="secondary" className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
