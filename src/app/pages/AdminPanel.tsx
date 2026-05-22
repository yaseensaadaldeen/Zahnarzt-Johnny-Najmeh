import { useState, useEffect } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import {
  Calendar, Users, Activity, TrendingUp, Edit, Trash2, Plus, CheckSquare,
  Filter, Download, Settings as SettingsIcon, X, Clock, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { CounterAnimation } from '../components/CounterAnimation';
import { appointmentsApi, settingsApi, Appointment } from '../services/api';

export function AdminPanel() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'settings'>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState({ start: '', end: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: '',
    time: '',
    service: '',
    status: 'pending' as const
  });

  const [settings, setSettings] = useState({
    workingHours: { start: '09:00', end: '18:00' },
    breakStart: '13:00',
    breakEnd: '14:00',
    holidays: ['2026-12-25', '2026-12-26', '2026-01-01'] as string[],
  });

  const loadData = async () => {
    try {
      const [appts, s] = await Promise.all([
        appointmentsApi.getAll(),
        settingsApi.get().catch(() => null),
      ]);
      setAppointments(appts);
      if (s) {
        setSettings({
          workingHours: s.workingHours,
          breakStart: s.breakStart,
          breakEnd: s.breakEnd,
          holidays: (s.holidays || []).map((h: string) => new Date(h).toISOString().slice(0, 10)),
        });
      }
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false;
    const d = apt.date.slice(0, 10);
    if (filterDateRange.start && d < filterDateRange.start) return false;
    if (filterDateRange.end && d > filterDateRange.end) return false;
    return true;
  });

  const stats = {
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    total: appointments.length,
  };

  const serviceMap = new Map<string, number>();
  appointments.forEach(a => {
    serviceMap.set(a.service, (serviceMap.get(a.service) || 0) + 1);
  });
  const serviceStats = [...serviceMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([service, count]) => ({
      service,
      count,
      percentage: Math.round((count / (appointments.length || 1)) * 100),
    }));

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (editingAppointment) {
      await appointmentsApi.update(editingAppointment._id, {
        patientName: editingAppointment.patientName,
        date: editingAppointment.date,
        time: editingAppointment.time,
        service: editingAppointment.service,
      });
      setShowEditModal(false);
      setEditingAppointment(null);
      await loadData();
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
    await loadData();
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('Termin wirklich löschen?', 'Really delete appointment?'))) {
      await appointmentsApi.delete(id);
      await loadData();
    }
  };

  const handleApprove = async (id: string) => {
    await appointmentsApi.updateStatus(id, 'confirmed');
    await loadData();
  };

  const handleReject = async (id: string) => {
    await appointmentsApi.updateStatus(id, 'cancelled');
    await loadData();
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = async () => {
    await appointmentsApi.bulkApprove(selectedIds);
    setSelectedIds([]);
    await loadData();
  };

  const handleBulkDelete = async () => {
    if (confirm(t('Ausgewählte Termine wirklich löschen?', 'Really delete selected appointments?'))) {
      await appointmentsApi.bulkDelete(selectedIds);
      setSelectedIds([]);
      await loadData();
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['ID', 'Patient', 'Date', 'Time', 'Service', 'Status'],
      ...filteredAppointments.map(apt => [
        apt._id,
        apt.patientName,
        apt.date.slice(0, 10),
        apt.time,
        apt.service,
        apt.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    a.click();
  };

  const handleSaveSettings = async () => {
    await settingsApi.update({
      workingHours: settings.workingHours,
      breakStart: settings.breakStart,
      breakEnd: settings.breakEnd,
      holidays: settings.holidays,
    });
    alert(t('Einstellungen gespeichert', 'Settings saved'));
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };

    const labels: Record<string, string> = {
      pending: t('Ausstehend', 'Pending'),
      confirmed: t('Bestätigt', 'Confirmed'),
      completed: t('Abgeschlossen', 'Completed'),
      cancelled: t('Abgesagt', 'Cancelled')
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
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            {t('Vollständige Verwaltung und Übersicht', 'Complete Management and Overview')}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Activity className="w-5 h-5 inline mr-2" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'appointments'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            {t('Termine', 'Appointments')}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'settings'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <SettingsIcon className="w-5 h-5 inline mr-2" />
            {t('Einstellungen', 'Settings')}
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('Ausstehend', 'Pending')}</div>
                    <div className="text-3xl font-bold text-yellow-600">
                      <CounterAnimation end={stats.pending} />
                    </div>
                  </div>
                  <Clock className="w-12 h-12 text-yellow-600/20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('Bestätigt', 'Confirmed')}</div>
                    <div className="text-3xl font-bold text-green-600">
                      <CounterAnimation end={stats.confirmed} />
                    </div>
                  </div>
                  <CheckSquare className="w-12 h-12 text-green-600/20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('Abgeschlossen', 'Completed')}</div>
                    <div className="text-3xl font-bold text-blue-600">
                      <CounterAnimation end={stats.completed} />
                    </div>
                  </div>
                  <Activity className="w-12 h-12 text-blue-600/20" />
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{t('Gesamt', 'Total')}</div>
                    <div className="text-3xl font-bold">
                      <CounterAnimation end={stats.total} />
                    </div>
                  </div>
                  <BarChart3 className="w-12 h-12 text-primary/20" />
                </div>
              </Card>
            </div>

            {serviceStats.length > 0 && (
              <Card className="p-8">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  {t('Beliebte Leistungen', 'Popular Services')}
                </h2>
                <div className="space-y-4">
                  {serviceStats.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.service}</span>
                        <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-primary to-cyan-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-muted-foreground" />
                  <span className="font-medium">{t('Filter:', 'Filters:')}</span>
                </div>
                <select
                  className="px-4 py-2 rounded-lg border border-border bg-input-background"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">{t('Alle Status', 'All Statuses')}</option>
                  <option value="pending">{t('Ausstehend', 'Pending')}</option>
                  <option value="confirmed">{t('Bestätigt', 'Confirmed')}</option>
                  <option value="completed">{t('Abgeschlossen', 'Completed')}</option>
                  <option value="cancelled">{t('Abgesagt', 'Cancelled')}</option>
                </select>
                <Input
                  type="date"
                  placeholder={t('Von', 'From')}
                  value={filterDateRange.start}
                  onChange={(e) => setFilterDateRange({ ...filterDateRange, start: e.target.value })}
                  className="w-auto"
                />
                <Input
                  type="date"
                  placeholder={t('Bis', 'To')}
                  value={filterDateRange.end}
                  onChange={(e) => setFilterDateRange({ ...filterDateRange, end: e.target.value })}
                  className="w-auto"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  <Plus size={18} className="mr-2" />
                  {t('Neuer Termin', 'New Appointment')}
                </Button>
                <Button variant="secondary" onClick={handleBulkApprove}>
                  <CheckSquare size={18} className="mr-2" />
                  {t('Ausgewählte genehmigen', 'Approve Selected')}
                </Button>
                <Button variant="secondary" onClick={handleBulkDelete}>
                  <Trash2 size={18} className="mr-2" />
                  {t('Ausgewählte löschen', 'Delete Selected')}
                </Button>
                <Button variant="secondary" onClick={handleExportCSV}>
                  <Download size={18} className="mr-2" />
                  {t('Export CSV', 'Export CSV')}
                </Button>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4">
                        <input type="checkbox" className="w-4 h-4" />
                      </th>
                      <th className="text-left p-4 font-semibold">{t('Patient', 'Patient')}</th>
                      <th className="text-left p-4 font-semibold">{t('Datum', 'Date')}</th>
                      <th className="text-left p-4 font-semibold">{t('Zeit', 'Time')}</th>
                      <th className="text-left p-4 font-semibold">{t('Leistung', 'Service')}</th>
                      <th className="text-left p-4 font-semibold">Status</th>
                      <th className="text-left p-4 font-semibold">{t('Aktionen', 'Actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAppointments.map((apt) => (
                      <tr key={apt._id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            className="w-4 h-4"
                            checked={selectedIds.includes(apt._id)}
                            onChange={() => handleToggleSelect(apt._id)}
                          />
                        </td>
                        <td className="p-4 font-medium">{apt.patientName}</td>
                        <td className="p-4">{new Date(apt.date).toLocaleDateString()}</td>
                        <td className="p-4">{apt.time}</td>
                        <td className="p-4">{apt.service}</td>
                        <td className="p-4">{getStatusBadge(apt.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(apt)}
                              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                              title={t('Bearbeiten', 'Edit')}
                            >
                              <Edit size={16} />
                            </button>
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => handleApprove(apt._id)}
                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                title={t('Genehmigen', 'Approve')}
                              >
                                ✓
                              </button>
                            )}
                            {apt.status === 'pending' && (
                              <button
                                onClick={() => handleReject(apt._id)}
                                className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                                title={t('Ablehnen', 'Reject')}
                              >
                                ✗
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(apt._id)}
                              className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                              title={t('Löschen', 'Delete')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6">
                {t('Arbeitszeiten', 'Working Hours')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Input
                  label={t('Beginn', 'Start Time')}
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, start: e.target.value } })}
                />
                <Input
                  label={t('Ende', 'End Time')}
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => setSettings({ ...settings, workingHours: { ...settings.workingHours, end: e.target.value } })}
                />
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6">
                {t('Pausenzeiten', 'Break Times')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <Input
                  label={t('Beginn', 'Start Time')}
                  type="time"
                  value={settings.breakStart}
                  onChange={(e) => setSettings({ ...settings, breakStart: e.target.value })}
                />
                <Input
                  label={t('Ende', 'End Time')}
                  type="time"
                  value={settings.breakEnd}
                  onChange={(e) => setSettings({ ...settings, breakEnd: e.target.value })}
                />
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="font-serif text-2xl font-semibold mb-6">
                {t('Feiertage & Urlaubstage', 'Holidays & Days Off')}
              </h2>
              <div className="space-y-3 max-w-2xl">
                {settings.holidays.map((holiday, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Input
                      type="date"
                      value={holiday}
                      onChange={(e) => {
                        const newHolidays = [...settings.holidays];
                        newHolidays[idx] = e.target.value;
                        setSettings({ ...settings, holidays: newHolidays });
                      }}
                    />
                    <button
                      onClick={() => setSettings({ ...settings, holidays: settings.holidays.filter((_, i) => i !== idx) })}
                      className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
                <Button
                  variant="secondary"
                  onClick={() => setSettings({ ...settings, holidays: [...settings.holidays, ''] })}
                >
                  <Plus size={18} className="mr-2" />
                  {t('Tag hinzufügen', 'Add Day')}
                </Button>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSaveSettings}>
                {t('Einstellungen speichern', 'Save Settings')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && editingAppointment && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowEditModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
            >
              <Card className="p-8 m-4">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  {t('Termin bearbeiten', 'Edit Appointment')}
                </h2>
                <div className="space-y-4">
                  <Input
                    label={t('Patientenname', 'Patient Name')}
                    value={editingAppointment.patientName}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, patientName: e.target.value })}
                  />
                  <Input
                    label={t('Datum', 'Date')}
                    type="date"
                    value={editingAppointment.date?.slice(0, 10)}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                  />
                  <Input
                    label={t('Zeit', 'Time')}
                    type="time"
                    value={editingAppointment.time}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                  />
                  <Input
                    label={t('Leistung', 'Service')}
                    value={editingAppointment.service}
                    onChange={(e) => setEditingAppointment({ ...editingAppointment, service: e.target.value })}
                  />
                  <div className="flex gap-3 mt-6">
                    <Button variant="primary" onClick={handleSaveEdit} className="flex-1">
                      {t('Speichern', 'Save')}
                    </Button>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)} className="flex-1">
                      {t('Abbrechen', 'Cancel')}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
            >
              <Card className="p-8 m-4">
                <h2 className="font-serif text-2xl font-semibold mb-6">
                  {t('Neuen Termin erstellen', 'Create New Appointment')}
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
                    <Button variant="primary" onClick={handleCreate} className="flex-1">
                      {t('Erstellen', 'Create')}
                    </Button>
                    <Button variant="secondary" onClick={() => setShowCreateModal(false)} className="flex-1">
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