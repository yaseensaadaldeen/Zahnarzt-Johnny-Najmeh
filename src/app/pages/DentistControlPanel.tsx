import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link, useNavigate } from 'react-router';
import { SEO } from '../components/SEO';
import { Calendar, CheckCircle, LogOut, X, Edit, Trash2, Plus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { appointmentsApi, Appointment } from '../services/api';

export function DentistControlPanel() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    service: '',
    status: 'pending' as const
  });

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

  const handleApprove = async (id: string) => {
    await appointmentsApi.updateStatus(id, 'confirmed');
    await loadAppointments();
  };

  const handleReject = async (id: string) => {
    if (confirm(t('Termin wirklich ablehnen/löschen?', 'Really reject/delete appointment?'))) {
      await appointmentsApi.updateStatus(id, 'cancelled');
      await loadAppointments();
    }
  };

  const handleComplete = async (id: string) => {
    await appointmentsApi.updateStatus(id, 'completed');
    await loadAppointments();
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('Termin wirklich löschen?', 'Really delete appointment?'))) {
      await appointmentsApi.delete(id);
      await loadAppointments();
    }
  };

  const handleCreate = async () => {
    if (!newAppointment.patientName || !newAppointment.date || !newAppointment.time || !newAppointment.service) {
      alert(t('Bitte alle Felder ausfüllen', 'Please fill all fields'));
      return;
    }
    await appointmentsApi.create(newAppointment);
    setShowCreateModal(false);
    setNewAppointment({ patientName: '', date: '', time: '', service: '', status: 'pending' });
    await loadAppointments();
  };

  const handleEdit = async (id: string) => {
    setEditingId(id);
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      await appointmentsApi.update(editingId, newAppointment);
      setEditingId(null);
      setNewAppointment({ patientName: '', date: '', time: '', service: '', status: 'pending' });
      await loadAppointments();
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };

    const labels: Record<string, string> = {
      pending: t('Ausstehend', 'Pending'),
      confirmed: t('Bestätigt', 'Confirmed'),
      completed: t('Abgeschlossen', 'Completed'),
      cancelled: t('Abgesagt', 'Cancelled'),
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">{t('Laden...', 'Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
            <button className="px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm">
              {t('Termine', 'Appointments')}
            </button>
            <Link to="/dentist/shifts">
              <button className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-white transition-colors">
                {t('Arbeitszeiten', 'Shifts')}
              </button>
            </Link>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('dentistToken');
              navigate('/');
            }}
            className="ml-auto px-3 py-1.5 text-sm border border-red-200 rounded-md text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5"
          >
            <LogOut size={14} />
            {t('Abmelden', 'Logout')}
          </button>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-4xl font-bold mb-2">
              {t('Admin Panel', 'Admin Panel')}
            </h1>
            <p className="text-muted-foreground">
              {t('Terminverwaltung für Zahnarzt Johnny Najmeh', 'Appointment Management for Dentist Johnny Najmeh')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={20} className="mr-2" />
              {t('Neuer Termin', 'New Appointment')}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  {t('Ausstehend', 'Pending')}
                </div>
                <div className="text-3xl font-bold text-yellow-600">
                  {appointments.filter(a => a.status === 'pending').length}
                </div>
              </div>
              <Clock className="w-12 h-12 text-yellow-600/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  {t('Bestätigt', 'Confirmed')}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {appointments.filter(a => a.status === 'confirmed').length}
                </div>
              </div>
              <CheckCircle className="w-12 h-12 text-green-600/20" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  {t('Abgeschlossen', 'Completed')}
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === 'completed').length}
                </div>
              </div>
              <Calendar className="w-12 h-12 text-blue-600/20" />
            </div>
          </Card>
        </div>

        {/* Appointments Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">{t('Patient', 'Patient')}</th>
                  <th className="text-left p-4 font-semibold">{t('Datum', 'Date')}</th>
                  <th className="text-left p-4 font-semibold">{t('Zeit', 'Time')}</th>
                  <th className="text-left p-4 font-semibold">{t('Leistung', 'Service')}</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">{t('Aktionen', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <motion.tr
                    key={appointment._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-medium">{appointment.patientName}</td>
                    <td className="p-4">
                      {new Date(appointment.date).toLocaleDateString(t('de-DE', 'en-US'), {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4">{appointment.time}</td>
                    <td className="p-4">{appointment.service}</td>
                    <td className="p-4">{getStatusBadge(appointment.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {appointment.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(appointment._id)}
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                            title={t('Genehmigen', 'Approve')}
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {appointment.status === 'confirmed' && (
                          <button
                            onClick={() => handleComplete(appointment._id)}
                            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                            title={t('Abschließen', 'Complete')}
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingId(appointment._id);
                            setNewAppointment({
                              patientName: appointment.patientName,
                              date: appointment.date.slice(0, 10),
                              time: appointment.time,
                              service: appointment.service,
                              status: appointment.status,
                            });
                          }}
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          title={t('Bearbeiten', 'Edit')}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleReject(appointment._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          title={t('Ablehnen', 'Reject')}
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                          title={t('Löschen', 'Delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingId) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => {
                setShowCreateModal(false);
                setEditingId(null);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
            >
              <Card className="p-8 m-4">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  {editingId
                    ? t('Termin bearbeiten', 'Edit Appointment')
                    : t('Neuen Termin erstellen', 'Create New Appointment')}
                </h2>
                <div className="space-y-4">
                  <Input
                    label={t('Patientenname', 'Patient Name')}
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                  />
                  <Input
                    label={t('Datum', 'Date')}
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                  />
                  <Input
                    label={t('Zeit', 'Time')}
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  />
                  <Input
                    label={t('Leistung', 'Service')}
                    value={newAppointment.service}
                    onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                  />
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="primary"
                      onClick={editingId ? handleSaveEdit : handleCreate}
                      className="flex-1"
                    >
                      {editingId
                        ? t('Speichern', 'Save')
                        : t('Erstellen', 'Create')}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setShowCreateModal(false);
                        setEditingId(null);
                      }}
                      className="flex-1"
                    >
                      {t('Abbrechen', 'Cancel')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}