import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Calendar, Clock, User, CheckCircle, X, Settings } from 'lucide-react';
import { appointmentsApi, Appointment } from '../services/api';

export function DentistDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = async () => {
    try {
      const data = await appointmentsApi.getAll();
      setAppointments(data);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const todayApps = appointments.filter(a =>
    new Date(a.date).toDateString() === selectedDate.toDateString()
  ).sort((a, b) => a.time.localeCompare(b.time));

  const stats = {
    today: todayApps.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    totalPatients: [...new Set(appointments.map(a => a.patientName))].length,
    completed: appointments.filter(a => a.status === 'completed').length,
  };

  const handleConfirm = async (id: string) => {
    await appointmentsApi.updateStatus(id, 'confirmed');
    await loadAppointments();
    setSelectedAppointment(null);
  };

  const handleCancel = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await appointmentsApi.updateStatus(id, 'cancelled');
      await loadAppointments();
      setSelectedAppointment(null);
    }
  };

  const handleComplete = async (id: string) => {
    await appointmentsApi.updateStatus(id, 'completed');
    await loadAppointments();
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-3xl font-bold">{t('Zahnarzt Dashboard', 'Dentist Dashboard')}</h1>
              <p className="text-muted-foreground">{t('Zahnarzt Johnny Najmeh', 'Dentist Johnny Najmeh')}</p>
            </div>
            <Button variant="secondary">
              <Settings size={20} className="mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Today's Appointments</div>
                <div className="text-3xl font-bold">{stats.today}</div>
              </div>
              <Calendar className="w-12 h-12 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Pending Confirmations</div>
                <div className="text-3xl font-bold">{stats.pending}</div>
              </div>
              <Clock className="w-12 h-12 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Patients</div>
                <div className="text-3xl font-bold">{stats.totalPatients}</div>
              </div>
              <User className="w-12 h-12 text-primary/20" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Completed Today</div>
                <div className="text-3xl font-bold">
                  {todayApps.filter(a => a.status === 'completed').length}
                </div>
              </div>
              <CheckCircle className="w-12 h-12 text-primary/20" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar & Schedule */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold">Today's Schedule</h2>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" className="px-4 py-2">
                    <Calendar size={18} className="mr-2" />
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {todayApps.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No appointments today</p>
                ) : (
                  todayApps.map((appointment) => (
                    <div
                      key={appointment._id}
                      onClick={() => setSelectedAppointment(appointment)}
                      className="p-4 border-2 border-border rounded-xl hover:border-primary/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{appointment.time}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="font-semibold mb-1">{appointment.patientName}</div>
                          <div className="text-sm text-muted-foreground">{appointment.service}</div>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === 'pending' && (
                            <Button
                              variant="primary"
                              className="px-3 py-1.5 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConfirm(appointment._id);
                              }}
                            >
                              Confirm
                            </Button>
                          )}
                          {appointment.status === 'confirmed' && (
                            <Button
                              variant="primary"
                              className="px-3 py-1.5 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleComplete(appointment._id);
                              }}
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Appointment Details Modal */}
          <div className="lg:col-span-1">
            {selectedAppointment ? (
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-xl font-semibold">Appointment Details</h3>
                  <button
                    onClick={() => setSelectedAppointment(null)}
                    className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Patient</div>
                    <div className="font-semibold">{selectedAppointment.patientName}</div>
                  </div>
                  {selectedAppointment.patientEmail && (
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Contact</div>
                      <div className="text-sm">{selectedAppointment.patientEmail}</div>
                      {selectedAppointment.patientPhone && (
                        <div className="text-sm">{selectedAppointment.patientPhone}</div>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Service</div>
                    <div className="font-semibold">{selectedAppointment.service}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Date</div>
                      <div className="font-semibold">
                        {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Time</div>
                      <div className="font-semibold">{selectedAppointment.time}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-6 pt-6 border-t">
                  {selectedAppointment.status === 'pending' && (
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => handleConfirm(selectedAppointment._id)}
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Confirm Appointment
                    </Button>
                  )}
                  {selectedAppointment.status === 'confirmed' && (
                    <Button
                      variant="primary"
                      className="w-full"
                      onClick={() => handleComplete(selectedAppointment._id)}
                    >
                      <CheckCircle size={18} className="mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                  <Button
                    variant="tertiary"
                    className="w-full text-destructive"
                    onClick={() => handleCancel(selectedAppointment._id)}
                  >
                    <X size={18} className="mr-2" />
                    Cancel Appointment
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center sticky top-24">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select an appointment to view details
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}