import { useEffect, useMemo, useState } from 'react';
import { CheckSquare, Download, Edit3, Filter, Plus, Save, Trash2 } from 'lucide-react';
import AppointmentEditorModal from '../components/AppointmentEditorModal';
import AppointmentTable from '../components/AppointmentTable';
import CenteredCard from '../components/CenteredCard';
import FormField from '../components/FormField';
import PageHero from '../components/PageHero';
import SeoHelmet from '../components/SeoHelmet';
import { appointmentsApi, settingsApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const emptyForm = {
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  date: '',
  time: '',
  service: '',
  status: 'pending',
};

export default function AdminPanel() {
  const { language, t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [settings, setSettings] = useState({
    workingHours: { start: '08:00', end: '20:00' },
    breakStart: '13:00',
    breakEnd: '14:00',
    holidays: [],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);
  const [savedMessage, setSavedMessage] = useState('');

  const labels = useMemo(
    () => ({
      patient: t({ de: 'Patient', en: 'Patient' }),
      date: t({ de: 'Datum', en: 'Date' }),
      time: t({ de: 'Zeit', en: 'Time' }),
      service: t({ de: 'Leistung', en: 'Service' }),
      status: t({ de: 'Status', en: 'Status' }),
      actions: t({ de: 'Aktionen', en: 'Actions' }),
      patientName: t({ de: 'Patientenname', en: 'Patient Name' }),
      patientEmail: t({ de: 'Patienten-E-Mail', en: 'Patient Email' }),
      patientPhone: t({ de: 'Patiententelefon', en: 'Patient Phone' }),
      pending: t({ de: 'Ausstehend', en: 'Pending' }),
      confirmed: t({ de: 'Bestaetigt', en: 'Confirmed' }),
      completed: t({ de: 'Abgeschlossen', en: 'Completed' }),
      cancelled: t({ de: 'Abgesagt', en: 'Cancelled' }),
      cancel: t({ de: 'Abbrechen', en: 'Cancel' }),
      save: t({ de: 'Speichern', en: 'Save' }),
    }),
    [t]
  );

  const loadData = async () => {
    const [appointmentsData, settingsData] = await Promise.all([appointmentsApi.getAll(), settingsApi.get()]);
    setAppointments(appointmentsData);
    setSettings({
      workingHours: settingsData.workingHours,
      breakStart: settingsData.breakStart,
      breakEnd: settingsData.breakEnd,
      holidays: (settingsData.holidays || []).map((item) => new Date(item).toISOString().slice(0, 10)),
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAppointments =
    statusFilter === 'all'
      ? appointments
      : appointments.filter((appointment) => appointment.status === statusFilter);

  const openEditor = (appointment) => {
    if (appointment) {
      setEditingAppointment(appointment);
      setFormValues({
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail || '',
        patientPhone: appointment.patientPhone || '',
        date: appointment.date?.slice(0, 10),
        time: appointment.time,
        service: appointment.service,
        status: appointment.status,
      });
    } else {
      setEditingAppointment(null);
      setFormValues(emptyForm);
    }
    setModalOpen(true);
  };

  const handleSaveAppointment = async () => {
    if (editingAppointment) {
      await appointmentsApi.update(editingAppointment._id, formValues);
    } else {
      await appointmentsApi.create(formValues);
    }
    setModalOpen(false);
    await loadData();
  };

  const handleSelectAll = (allSelected) => {
    setSelectedIds(allSelected ? [] : filteredAppointments.map((appointment) => appointment._id));
  };

  const exportCsv = () => {
    const rows = [
      ['Patient', 'Email', 'Phone', 'Date', 'Time', 'Service', 'Status'],
      ...filteredAppointments.map((appointment) => [
        appointment.patientName,
        appointment.patientEmail || '',
        appointment.patientPhone || '',
        appointment.date?.slice(0, 10),
        appointment.time,
        appointment.service,
        appointment.status,
      ]),
    ];

    const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'appointments.csv';
    link.click();
  };

  const saveSettings = async () => {
    await settingsApi.update(settings);
    setSavedMessage(t({ de: 'Einstellungen gespeichert.', en: 'Settings saved.' }));
  };

  return (
    <div>
      <SeoHelmet path="/admin-panel" title={{ de: 'Admin-Panel', en: 'Admin Panel' }} description={{ de: 'Admin-Panel zur Verwaltung von Terminen und Praxiseinstellungen.', en: 'Admin panel for managing appointments and practice settings.' }} />
      <meta name="robots" content="noindex, nofollow" />
      <PageHero
        invert
        title="Admin Panel"
        description={t({
          de: 'Volle Kontrolle ueber Termine, Massenaktionen und Praxiseinstellungen.',
          en: 'Full control over appointments, bulk actions, and practice settings.',
        })}
      />

      <section className="section section--gradient">
        <div className="container" style={{ display: 'grid', gap: '24px' }}>
          <CenteredCard>
            <div style={{ padding: '24px' }}>
              <div className="toolbar" style={{ justifyContent: 'space-between', marginBottom: '16px' }}>
                <div className="toolbar">
                  <Filter size={18} />
                  <FormField as="select" label="" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="all">{t({ de: 'Alle Status', en: 'All Statuses' })}</option>
                    <option value="pending">{labels.pending}</option>
                    <option value="confirmed">{labels.confirmed}</option>
                    <option value="completed">{labels.completed}</option>
                    <option value="cancelled">{labels.cancelled}</option>
                  </FormField>
                </div>
                <div className="toolbar">
                  <button type="button" className="pill" style={{ background: 'var(--primary)', color: '#fff', border: 0 }} onClick={() => openEditor(null)}><Plus size={16} />{t({ de: 'Termin', en: 'Appointment' })}</button>
                  <button type="button" className="pill" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }} onClick={() => appointmentsApi.bulkApprove(selectedIds).then(loadData)}><CheckSquare size={16} />{t({ de: 'Ausgewaehlte genehmigen', en: 'Approve Selected' })}</button>
                  <button type="button" className="pill" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }} onClick={() => appointmentsApi.bulkDelete(selectedIds).then(() => { setSelectedIds([]); loadData(); })}><Trash2 size={16} />{t({ de: 'Ausgewaehlte loeschen', en: 'Delete Selected' })}</button>
                  <button type="button" className="pill" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }} onClick={exportCsv}><Download size={16} />CSV</button>
                </div>
              </div>

              <AppointmentTable
                appointments={filteredAppointments}
                locale={language === 'de' ? 'de-DE' : 'en-US'}
                labels={labels}
                selectable
                selectedIds={selectedIds}
                onToggleSelect={(id) =>
                  setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))
                }
                onSelectAll={handleSelectAll}
                actions={(appointment) => (
                  <div className="toolbar">
                    <button type="button" className="pill" style={{ background: 'rgba(8,145,178,0.12)', color: 'var(--primary)', border: 0 }} onClick={() => openEditor(appointment)}><Edit3 size={16} /></button>
                    <button type="button" className="pill" style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: 0 }} onClick={() => appointmentsApi.delete(appointment._id).then(loadData)}><Trash2 size={16} /></button>
                  </div>
                )}
              />
            </div>
          </CenteredCard>

          <CenteredCard>
            <div style={{ padding: '24px' }}>
              <h2 className="heading-section" style={{ fontSize: '2rem' }}>{t({ de: 'Praxiseinstellungen', en: 'Practice Settings' })}</h2>
              <div className="form-grid-2">
                <FormField label={t({ de: 'Arbeitsbeginn', en: 'Working Hours Start' })} type="time" value={settings.workingHours.start} onChange={(event) => setSettings((current) => ({ ...current, workingHours: { ...current.workingHours, start: event.target.value } }))} />
                <FormField label={t({ de: 'Arbeitsende', en: 'Working Hours End' })} type="time" value={settings.workingHours.end} onChange={(event) => setSettings((current) => ({ ...current, workingHours: { ...current.workingHours, end: event.target.value } }))} />
                <FormField label={t({ de: 'Pausenbeginn', en: 'Break Start' })} type="time" value={settings.breakStart} onChange={(event) => setSettings((current) => ({ ...current, breakStart: event.target.value }))} />
                <FormField label={t({ de: 'Pausenende', en: 'Break End' })} type="time" value={settings.breakEnd} onChange={(event) => setSettings((current) => ({ ...current, breakEnd: event.target.value }))} />
              </div>
              <div style={{ marginTop: '18px', display: 'grid', gap: '12px' }}>
                {settings.holidays.map((holiday, index) => (
                  <div key={`${holiday}-${index}`} className="toolbar">
                    <FormField label={index === 0 ? t({ de: 'Feiertage', en: 'Holidays' }) : ''} type="date" value={holiday} onChange={(event) => setSettings((current) => ({ ...current, holidays: current.holidays.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)) }))} />
                    <button type="button" className="pill" style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: 0 }} onClick={() => setSettings((current) => ({ ...current, holidays: current.holidays.filter((_, itemIndex) => itemIndex !== index) }))}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button type="button" className="pill" style={{ background: 'var(--muted)', border: '1px solid var(--border)', width: 'fit-content' }} onClick={() => setSettings((current) => ({ ...current, holidays: [...current.holidays, ''] }))}>
                  <Plus size={16} />
                  {t({ de: 'Tag hinzufuegen', en: 'Add Day' })}
                </button>
              </div>
              <div className="toolbar" style={{ marginTop: '20px' }}>
                <button type="button" className="pill" style={{ background: 'var(--primary)', color: '#fff', border: 0 }} onClick={saveSettings}>
                  <Save size={16} />
                  {t({ de: 'Einstellungen speichern', en: 'Save Settings' })}
                </button>
                {savedMessage ? <span className="muted">{savedMessage}</span> : null}
              </div>
            </div>
          </CenteredCard>
        </div>
      </section>

      <AppointmentEditorModal
        open={modalOpen}
        title={editingAppointment ? t({ de: 'Termin bearbeiten', en: 'Edit Appointment' }) : t({ de: 'Neuen Termin erstellen', en: 'Create New Appointment' })}
        values={formValues}
        labels={labels}
        onChange={(field, value) => setFormValues((current) => ({ ...current, [field]: value }))}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveAppointment}
      />
    </div>
  );
}
