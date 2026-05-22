import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarRange, CheckCircle2, Edit3, LogOut, Plus, Settings2, Trash2, XCircle } from 'lucide-react';
import AppointmentEditorModal from '../components/AppointmentEditorModal';
import AppointmentRequestModal from '../components/AppointmentRequestModal';
import AppointmentTable from '../components/AppointmentTable';
import CenteredCard from '../components/CenteredCard';
import PageHero from '../components/PageHero';
import { appointmentsApi } from '../services/api';
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

export default function DentistPanel() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [appointments, setAppointments] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [formValues, setFormValues] = useState(emptyForm);

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

  const loadAppointments = async () => {
    const data = await appointmentsApi.getAll();
    setAppointments(data);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const stats = {
    pending: appointments.filter((appointment) => appointment.status === 'pending').length,
    confirmed: appointments.filter((appointment) => appointment.status === 'confirmed').length,
    completed: appointments.filter((appointment) => appointment.status === 'completed').length,
  };

  const openCreate = () => {
    setCreateModalOpen(true);
  };

  const openEdit = (appointment) => {
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
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    await appointmentsApi.update(editingAppointment._id, formValues);
    setEditModalOpen(false);
    setFormValues(emptyForm);
    setEditingAppointment(null);
    await loadAppointments();
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    loadAppointments();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dentistAccessGranted');
    sessionStorage.removeItem('dentistToken');
    navigate('/');
  };

  return (
    <div>
      <PageHero
        invert
        title={t({ de: 'Praxis-Panel', en: 'Practice Panel' })}
        description={t({
          de: 'Verwalten Sie Anfragen, bestaetigen Sie Termine und halten Sie den Kalender aktuell.',
          en: 'Manage requests, confirm appointments, and keep the calendar current.',
        })}
      />

      <div style={{ borderBottom: '1px solid #e5e7eb', background: '#fff' }}>
        <div className="container" style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
          <button
            onClick={() => navigate('/dentist/control-panel')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: location.pathname === '/dentist/control-panel' ? '#0d9488' : 'transparent',
              color: location.pathname === '/dentist/control-panel' ? '#fff' : '#374151',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CalendarRange size={16} />
            {t({ de: 'Termine', en: 'Appointments' })}
          </button>
          <button
            onClick={() => navigate('/dentist/shifts')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: location.pathname === '/dentist/shifts' ? '#0d9488' : 'transparent',
              color: location.pathname === '/dentist/shifts' ? '#fff' : '#374151',
              fontWeight: 500,
              fontSize: 14,
              cursor: 'pointer',
              borderTopRightRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Settings2 size={16} />
            {t({ de: 'Öffnungszeiten', en: 'Shifts' })}
          </button>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#dc2626',
                fontWeight: 500,
                fontSize: 13,
                cursor: 'pointer',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <LogOut size={15} />
              {t({ de: 'Abmelden', en: 'Logout' })}
            </button>
          </div>
        </div>
      </div>

      <section className="section section--gradient">
        <div className="container">
          <div className="toolbar" style={{ justifyContent: 'space-between', marginBottom: '24px' }}>
            <div className="grid-3" style={{ flex: 1 }}>
              <CenteredCard><div style={{ padding: '24px' }}><strong>{labels.pending}</strong><div style={{ color: '#b45309', fontSize: '2rem', marginTop: 8 }}>{stats.pending}</div></div></CenteredCard>
              <CenteredCard><div style={{ padding: '24px' }}><strong>{labels.confirmed}</strong><div style={{ color: '#15803d', fontSize: '2rem', marginTop: 8 }}>{stats.confirmed}</div></div></CenteredCard>
              <CenteredCard><div style={{ padding: '24px' }}><strong>{labels.completed}</strong><div style={{ color: '#1d4ed8', fontSize: '2rem', marginTop: 8 }}>{stats.completed}</div></div></CenteredCard>
            </div>
          </div>

          <div className="toolbar" style={{ marginBottom: '20px' }}>
            <button type="button" className="pill" style={{ background: 'var(--primary)', color: '#fff', border: 0 }} onClick={openCreate}>
              <Plus size={16} />
              {t({ de: 'Neuer Termin', en: 'New Appointment' })}
            </button>
          </div>

          <CenteredCard>
            <AppointmentTable
              appointments={appointments}
              locale={language === 'de' ? 'de-DE' : 'en-US'}
              labels={labels}
              actions={(appointment) => (
                <div className="toolbar">
                  {appointment.status === 'pending' ? (
                    <button type="button" className="pill" style={{ background: '#dcfce7', color: '#15803d', border: 0 }} onClick={() => appointmentsApi.updateStatus(appointment._id, 'confirmed').then(loadAppointments)}>
                      <CheckCircle2 size={16} />
                    </button>
                  ) : null}
                  {appointment.status === 'confirmed' ? (
                    <button type="button" className="pill" style={{ background: '#dbeafe', color: '#1d4ed8', border: 0 }} onClick={() => appointmentsApi.updateStatus(appointment._id, 'completed').then(loadAppointments)}>
                      <CheckCircle2 size={16} />
                    </button>
                  ) : null}
                  <button type="button" className="pill" style={{ background: 'rgba(8,145,178,0.12)', color: 'var(--primary)', border: 0 }} onClick={() => openEdit(appointment)}>
                    <Edit3 size={16} />
                  </button>
                  <button type="button" className="pill" style={{ background: '#fee2e2', color: '#b91c1c', border: 0 }} onClick={() => appointmentsApi.updateStatus(appointment._id, 'cancelled').then(loadAppointments)}>
                    <XCircle size={16} />
                  </button>
                  <button type="button" className="pill" style={{ background: 'rgba(220,38,38,0.1)', color: '#dc2626', border: 0 }} onClick={() => appointmentsApi.delete(appointment._id).then(loadAppointments)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            />
          </CenteredCard>
        </div>
      </section>

      <AppointmentRequestModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <AppointmentEditorModal
        open={editModalOpen}
        title={t({ de: 'Termin bearbeiten', en: 'Edit Appointment' })}
        values={formValues}
        labels={labels}
        onChange={(field, value) => setFormValues((current) => ({ ...current, [field]: value }))}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
}
