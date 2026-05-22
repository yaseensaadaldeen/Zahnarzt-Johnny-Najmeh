import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SEO } from '../components/SEO';
import { CheckCircle, ChevronRight, Calendar, Clock, User, XCircle } from 'lucide-react';
import { appointmentsApi } from '../services/api';
import { requestNotificationPermission, notifyBookingConfirmation, storeAppointment } from '../services/notificationService';

const PHONE_REGEX = /^[\+\d][\d\s\-\(\)\.]{6,20}$/;

export function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const services = [
    { id: 'Professional Teeth Cleaning', name: 'Professional Teeth Cleaning', duration: '45-60 min' },
    { id: 'Dental Checkup & Examination', name: 'Dental Checkup & Examination', duration: '30-45 min' },
    { id: 'Teeth Whitening', name: 'Teeth Whitening', duration: '60-90 min' },
    { id: 'Veneers Consultation', name: 'Veneers Consultation', duration: '30 min' },
    { id: 'Fillings & Cavities', name: 'Fillings & Cavities', duration: '30-60 min' },
    { id: 'Crowns & Bridges', name: 'Crowns & Bridges', duration: '60 min' },
    { id: 'Dental Implants Consultation', name: 'Dental Implants Consultation', duration: '45 min' },
    { id: 'Emergency Dental Care', name: 'Emergency Dental Care', duration: 'As needed' },
    { id: 'Root Canal Treatment', name: 'Root Canal Treatment', duration: '60-90 min' },
    { id: 'Pediatric Dentistry', name: 'Pediatric Dentistry', duration: '30-45 min' }
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (!formData.date) {
      setBookedTimes([]);
      return;
    }
    const load = async () => {
      setLoadingSlots(true);
      try {
        const data = await appointmentsApi.getTimeslots(formData.date);
        setAvailableTimes(data.availableTimes);
        setBookedTimes(data.bookedTimes);
        if (data.bookedTimes.includes(formData.time)) {
          setFormData(prev => ({ ...prev, time: '' }));
        }
      } catch {
        setAvailableTimes([]);
        setBookedTimes([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    load();
  }, [formData.date]);

  const handleNext = () => {
    if (step === 2 && !formData.time) {
      setServerError('Please select an available time slot');
      return;
    }
    setServerError('');
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const refreshTimeslots = async () => {
    if (!formData.date) return;
    try {
      const data = await appointmentsApi.getTimeslots(formData.date);
      setAvailableTimes(data.availableTimes);
      setBookedTimes(data.bookedTimes);
    } catch {
      // silent
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError('');
    try {
      const created = await appointmentsApi.create({
        patientName: formData.name,
        patientEmail: formData.email,
        patientPhone: formData.phone,
        date: formData.date,
        time: formData.time,
        service: formData.service,
      });
      requestNotificationPermission();
      notifyBookingConfirmation(formData.service, formData.date, formData.time);
      storeAppointment({ id: created._id, date: formData.date, time: formData.time, service: formData.service });
      navigate('/?booked=true');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('already booked') || msg.includes('409')) {
        setServerError('Dieser Zeitraum ist bereits reserviert. Bitte wählen Sie einen anderen Termin.');
        await refreshTimeslots();
        setFormData(prev => ({ ...prev, time: '' }));
      } else if (msg) {
        setServerError(msg);
      } else {
        setServerError('Fehler bei der Buchung. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const validatePhone = (phone: string) => {
    if (!phone) return 'Phone number is required';
    if (!PHONE_REGEX.test(phone)) return 'Please enter a valid phone number (e.g. +49 123 456 7890)';
    return '';
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.service !== '';
      case 2: return formData.date !== '' && formData.time !== '';
      case 3: {
        const phoneErr = validatePhone(formData.phone);
        return formData.name && formData.email && formData.phone && !phoneErr;
      }
      default: return true;
    }
  };

  const canGoNext = isStepValid();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-cyan-50 py-12">
      <SEO
        title="Termin buchen – Zahnarzt Johnny Najmeh | Zahnarzt in Freiburg"
        description="Vereinbaren Sie jetzt online Ihren Termin bei Zahnarzt Johnny Najmeh in Freiburg. Wählen Sie Leistung, Datum und Uhrzeit – schnell und unkompliziert."
        canonical="/book"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-lg text-muted-foreground">Follow the simple steps to schedule your visit</p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {[1, 2, 3, 4].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`flex flex-col items-center ${index > 0 ? 'ml-4' : ''}`}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step > s ? <CheckCircle size={24} /> : s}
                  </div>
                  <span className="text-xs mt-2 hidden md:block">
                    {s === 1 && 'Service'}
                    {s === 2 && 'Date & Time'}
                    {s === 3 && 'Details'}
                    {s === 4 && 'Confirm'}
                  </span>
                </div>
                {index < 3 && (
                  <ChevronRight className="text-muted-foreground mx-2 hidden md:block" size={20} />
                )}
              </div>
            ))}
          </div>

          <Card className="p-8">
            {/* Step 1: Choose Service */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold">Choose a Service</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setFormData({ ...formData, service: service.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.service === service.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="font-semibold mb-1">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {service.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Choose Date & Time */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold">Select Date & Time</h2>
                </div>

                <div className="mb-6">
                  <label className="block font-medium mb-3">Choose Date</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableDates.slice(0, 8).map((date) => {
                      const d = new Date(date + 'T12:00:00');
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const month = d.toLocaleDateString('en-US', { month: 'short' });
                      const isPast = d < today;

                      return (
                        <button
                          key={date}
                          disabled={isPast}
                          onClick={() => {
                            setFormData({ ...formData, date, time: '' });
                            setServerError('');
                          }}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            isPast
                              ? 'border-border opacity-40 cursor-not-allowed'
                              : formData.date === date
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="text-xs text-muted-foreground">{dayName}</div>
                          <div className="text-lg font-semibold">{dayNum}</div>
                          <div className="text-xs text-muted-foreground">{month}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {formData.date && (
                  <div>
                    <label className="block font-medium mb-3">
                      Choose Time
                      {loadingSlots && <span className="text-sm text-muted-foreground ml-2">(loading...)</span>}
                    </label>
                    {bookedTimes.length > 0 && (
                      <p className="text-xs text-muted-foreground mb-3">
                        Grayed out slots are already reserved
                      </p>
                    )}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {availableTimes.length === 0 && !loadingSlots ? (
                        <div className="col-span-full text-center text-muted-foreground py-6">
                          {t('Keine verfügbaren Zeiten an diesem Tag', 'No available times on this day')}
                        </div>
                      ) : (
                        availableTimes.map((time) => {
                          const isBooked = bookedTimes.includes(time);
                          return (
                            <button
                              key={time}
                              disabled={isBooked}
                              onClick={() => {
                                setFormData({ ...formData, time });
                                setServerError('');
                              }}
                              className={`p-3 rounded-lg border-2 text-center transition-all relative ${
                                isBooked
                                  ? 'border-border bg-gray-100 text-muted-foreground cursor-not-allowed line-through'
                                  : formData.time === time
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              }`}
                              title={isBooked ? 'Already booked' : time}
                            >
                              {time}
                              {isBooked && (
                                <span className="absolute -top-1.5 -right-1.5 text-xs bg-red-100 text-red-600 rounded-full px-1.5 py-0.5">
                                  ✕
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Your Details */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold">Your Information</h2>
                </div>
                <div className="space-y-4">
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
                  <div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+49 123 456 7890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    {formData.phone && validatePhone(formData.phone) && (
                      <p className="text-xs text-red-500 mt-1">{validatePhone(formData.phone)}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Additional Notes (Optional)</label>
                    <textarea
                      className="px-4 py-2.5 rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-24"
                      placeholder="Any special requests or information we should know?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login here</Link>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold">Confirm Your Appointment</h2>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Service</div>
                    <div className="font-semibold">
                      {services.find(s => s.id === formData.service)?.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Date</div>
                      <div className="font-semibold">
                        {new Date(formData.date + 'T12:00:00').toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Time</div>
                      <div className="font-semibold">{formData.time}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Patient</div>
                    <div className="font-semibold">{formData.name}</div>
                    <div className="text-sm">{formData.email}</div>
                    <div className="text-sm">{formData.phone}</div>
                  </div>
                  {formData.notes && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Notes</div>
                      <div className="text-sm">{formData.notes}</div>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-sm">
                    By confirming this appointment, you agree to receive SMS and email notifications about your appointment.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
              )}
              {step < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={`ml-auto ${!canGoNext ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Continue
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit} disabled={submitting} className="ml-auto">
                  {submitting ? 'Submitting...' : 'Confirm Booking'}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
