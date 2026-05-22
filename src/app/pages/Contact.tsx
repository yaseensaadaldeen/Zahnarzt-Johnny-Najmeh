import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SEO } from '../components/SEO';
import { MapPin, Phone, Mail, Clock, Car, Train, Footprints, Navigation, Loader2 } from 'lucide-react';
import { contactApi } from '../services/api';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await contactApi.send(formData);
      setStatus({ type: 'success', message: 'Ihre Nachricht wurde gesendet. Wir melden uns bald bei Ihnen.' });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus({ type: 'error', message: 'Fehler beim Senden. Bitte versuchen Sie es später oder rufen Sie uns an.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Kontakt – Zahnarzt Johnny Najmeh | Zahnarzt in Freiburg"
        description="Kontaktieren Sie Zahnarzt Johnny Najmeh in Freiburg. Telefon, E-Mail, Anfahrt und Online-Kontaktformular. Wir freuen uns auf Ihre Nachricht."
        canonical="/contact"
      />
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-cyan-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            We're here to answer your questions and help you schedule your visit
          </p>
        </div>
      </section>

      {/* Contact Information & Map */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <div>
              <Card className="p-8 h-full">
                <h2 className="font-serif text-2xl font-semibold mb-6">Get in Touch</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Address</h3>
                      <p className="text-muted-foreground">
                        Sundgauallee 15<br />
                        79110 Freiburg im Breisgau<br />
                        Germany
                      </p>
                      <a
                        href="https://maps.google.com/?q=Sundgauallee+15+Freiburg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-medium hover:underline inline-flex items-center gap-1 mt-2"
                      >
                        <Navigation size={16} />
                        Open in Google Maps
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Phone</h3>
                      <a href="tel:+497612345678" className="text-muted-foreground hover:text-primary">
                        +49 761 234 5678
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        Available during opening hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <a href="mailto:info@dr-najmeh.de" className="text-muted-foreground hover:text-primary">
                        info@dr-najmeh.de
                      </a>
                      <p className="text-sm text-muted-foreground mt-1">
                        We'll respond within 24 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Opening Hours</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p className="font-semibold text-foreground">Every Day of the Week</p>
                        <p>Monday - Sunday</p>
                        <p className="font-semibold text-foreground">8:00 AM - 8:00 PM</p>
                        <p className="text-accent mt-2">Emergency slots available daily</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map */}
            <div>
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
            </div>
          </div>

          {/* Directions */}
          <div className="mb-16">
            <h2 className="font-serif text-3xl font-bold text-center mb-12">How to Find Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Car className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">By Car</h3>
                <p className="text-muted-foreground">
                  Free parking available behind the clinic. Easy access from the city center.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Train className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">By Public Transport</h3>
                <p className="text-muted-foreground">
                  Tram line 5 - stop "Sundgauallee". Just a 2-minute walk from the stop.
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Footprints className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">By Foot</h3>
                <p className="text-muted-foreground">
                  5-minute walk from Freiburg main station. Next to Rewe supermarket.
                </p>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <Card className="p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6 text-center">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="+49 123 456 7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Input
                    label="Subject"
                    type="text"
                    placeholder="General Inquiry"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    className="px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-32"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>
                {status && (
                  <div className={`p-4 rounded-lg text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {status.message}
                  </div>
                )}
                <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
                  {submitting ? <><Loader2 size={18} className="animate-spin mr-2" /> Sending...</> : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold mb-4">Dental Emergency?</h2>
          <p className="text-lg mb-6 opacity-90">
            We provide same-day emergency appointments every day of the week
          </p>
          <a href="tel:+497612345678">
            <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Phone size={20} className="mr-2" />
              Call Us Now: +49 761 234 5678
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
