import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarRange, LogOut, Save, Plus, Trash2, Calendar, Clock, Settings2 } from 'lucide-react';
import SeoHelmet from '../components/SeoHelmet';
import { useLanguage } from '../contexts/LanguageContext';
import { availabilityApi } from '../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DentistShiftManager() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [weeklyShifts, setWeeklyShifts] = useState([]);
  const [outTimes, setOutTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newOutTime, setNewOutTime] = useState({
    date: '',
    reason: '',
    allDay: true,
    start: '',
    end: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await availabilityApi.get();
        setWeeklyShifts(data.weeklyShifts);
        setOutTimes(data.outTimes);
      } catch {
        setMessage('Failed to load availability');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleDay = (dayOfWeek) => {
    setWeeklyShifts(prev =>
      prev.map(s => s.dayOfWeek === dayOfWeek ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const updateShift = (dayOfWeek, field, value) => {
    setWeeklyShifts(prev =>
      prev.map(s => s.dayOfWeek === dayOfWeek ? { ...s, [field]: value } : s)
    );
  };

  const handleSaveWeekly = async () => {
    setSaving(true);
    setMessage('');
    try {
      await availabilityApi.updateWeekly(weeklyShifts);
      setMessage('Weekly shifts saved successfully');
    } catch {
      setMessage('Failed to save weekly shifts');
    } finally {
      setSaving(false);
    }
  };

  const handleAddOutTime = async () => {
    if (!newOutTime.date) return;
    setSaving(true);
    try {
      const result = await availabilityApi.addOutTime(newOutTime);
      setOutTimes(result.outTimes);
      setNewOutTime({ date: '', reason: '', allDay: true, start: '', end: '' });
      setMessage('Out-time added');
    } catch {
      setMessage('Failed to add out-time');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOutTime = async (id) => {
    if (!confirm('Delete this out-time?')) return;
    try {
      const result = await availabilityApi.deleteOutTime(id);
      setOutTimes(result.outTimes);
    } catch {
      setMessage('Failed to delete out-time');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">{t({ de: 'Laden...', en: 'Loading...' })}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
      <SeoHelmet path="/dentist/shifts" title={{ de: 'Schichtplan', en: 'Shift Schedule' }} description={{ de: 'Schichtplan-Verwaltung für die Zahnarztpraxis.', en: 'Shift schedule management for the dental practice.' }} />
      <meta name="robots" content="noindex, nofollow" />
      <div className="container mx-auto px-4 py-8">
        {/* Tab bar */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 12 }}>
          <div style={{ display: 'flex', gap: 0, background: '#f1f5f9', borderRadius: 8, padding: 4 }}>
            <button
              onClick={() => navigate('/dentist/control-panel')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: location.pathname === '/dentist/control-panel' ? '#fff' : 'transparent',
                color: '#374151',
                fontWeight: 500,
                fontSize: 14,
                cursor: 'pointer',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: location.pathname === '/dentist/control-panel' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <CalendarRange size={16} />
              {t({ de: 'Termine', en: 'Appointments' })}
            </button>
            <button
              onClick={() => navigate('/dentist/shifts')}
              style={{
                padding: '8px 16px',
                border: 'none',
                background: location.pathname === '/dentist/shifts' ? '#fff' : 'transparent',
                color: '#374151',
                fontWeight: 500,
                fontSize: 14,
                cursor: 'pointer',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: location.pathname === '/dentist/shifts' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Settings2 size={16} />
              {t({ de: 'Öffnungszeiten', en: 'Shifts' })}
            </button>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => {
                sessionStorage.removeItem('dentistAccessGranted');
                sessionStorage.removeItem('dentistToken');
                navigate('/');
              }}
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

        <h1 className="font-serif text-4xl font-bold mb-2">
          {t({ de: 'Arbeitszeiten & Abwesenheiten', en: 'Shifts & Out-Times' })}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          {t({ de: 'Legen Sie Ihre wöchentlichen Arbeitszeiten und Abwesenheitstage fest', en: 'Set your weekly working hours and out-of-office days' })}
        </p>

        {message && (
          <div style={{
            marginBottom: 24, padding: 16, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12,
            ...(message.includes('Failed')
              ? { background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca' }
              : { background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0' })
          }}>
            <span>{message}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Weekly Shifts */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 className="font-serif text-2xl font-semibold">
                {t({ de: 'Wöchentliche Arbeitszeiten', en: 'Weekly Working Hours' })}
              </h2>
              <button
                onClick={handleSaveWeekly}
                disabled={saving}
                style={{
                  padding: '8px 16px', background: '#0d9488', color: '#fff', border: 'none', borderRadius: 6,
                  fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <Save size={16} />
                {saving ? t({ de: 'Speichert...', en: 'Saving...' }) : t({ de: 'Speichern', en: 'Save' })}
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {weeklyShifts.map((shift) => {
                const dayDe = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][shift.dayOfWeek];
                return (
                <div
                  key={shift.dayOfWeek}
                  style={{
                    padding: 16, borderRadius: 12, border: '2px solid',
                    borderColor: shift.enabled ? '#e5e7eb' : '#f3f4f6',
                    opacity: shift.enabled ? 1 : 0.6,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={shift.enabled}
                        onChange={() => toggleDay(shift.dayOfWeek)}
                        style={{ width: 18, height: 18 }}
                      />
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{t({ de: dayDe, en: DAYS[shift.dayOfWeek] })}</span>
                    </label>
                  </div>
                  {shift.enabled && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 30 }}>
                      <input
                        type="time"
                        value={shift.start}
                        onChange={(e) => updateShift(shift.dayOfWeek, 'start', e.target.value)}
                        style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, width: 130 }}
                      />
                      <span style={{ color: '#6b7280' }}>—</span>
                      <input
                        type="time"
                        value={shift.end}
                        onChange={(e) => updateShift(shift.dayOfWeek, 'end', e.target.value)}
                        style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, width: 130 }}
                      />
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>

          {/* Out-Times */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
            <h2 className="font-serif text-2xl font-semibold" style={{ marginBottom: 24 }}>
              {t({ de: 'Abwesenheitstage', en: 'Out-of-Office Days' })}
            </h2>

            <div style={{ padding: 16, background: '#f9fafb', borderRadius: 12, marginBottom: 24 }}>
              <h3 style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
                {t({ de: 'Neue Abwesenheit', en: 'New Out-Time' })}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <input
                  type="date"
                  value={newOutTime.date}
                  onChange={(e) => setNewOutTime({ ...newOutTime, date: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                />
                <input
                  placeholder={t({ de: 'Grund (optional)', en: 'Reason (optional)' })}
                  value={newOutTime.reason}
                  onChange={(e) => setNewOutTime({ ...newOutTime, reason: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14 }}
                />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 12 }}>
                <input
                  type="checkbox"
                  checked={newOutTime.allDay}
                  onChange={(e) => setNewOutTime({ ...newOutTime, allDay: e.target.checked })}
                />
                {t({ de: 'Ganztägig', en: 'All day' })}
              </label>
              {!newOutTime.allDay && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <input
                    type="time"
                    value={newOutTime.start || ''}
                    onChange={(e) => setNewOutTime({ ...newOutTime, start: e.target.value })}
                    style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, width: 120 }}
                  />
                  <span style={{ color: '#6b7280' }}>—</span>
                  <input
                    type="time"
                    value={newOutTime.end || ''}
                    onChange={(e) => setNewOutTime({ ...newOutTime, end: e.target.value })}
                    style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14, width: 120 }}
                  />
                </div>
              )}
              <button
                onClick={handleAddOutTime}
                disabled={!newOutTime.date || saving}
                style={{
                  padding: '8px 16px', background: '#0d9488', color: '#fff', border: 'none', borderRadius: 6,
                  fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                  opacity: (!newOutTime.date || saving) ? 0.5 : 1,
                }}
              >
                <Plus size={16} />
                {t({ de: 'Hinzufügen', en: 'Add' })}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {outTimes.length === 0 ? (
                <p style={{ color: '#6b7280', fontSize: 14 }}>
                  {t({ de: 'Keine Abwesenheiten eingetragen', en: 'No out-times recorded' })}
                </p>
              ) : (
                outTimes.map((ot) => (
                  <div key={ot._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Calendar size={16} style={{ color: '#0d9488' }} />
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>
                          {new Date(ot.date).toLocaleDateString()}
                        </div>
                        {ot.reason && <div style={{ fontSize: 12, color: '#6b7280' }}>{ot.reason}</div>}
                        {!ot.allDay && ot.start && ot.end && (
                          <div style={{ fontSize: 12, color: '#6b7280' }}>{ot.start} — {ot.end}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteOutTime(ot._id)}
                      style={{ padding: 8, border: 'none', background: 'transparent', color: '#dc2626', cursor: 'pointer', borderRadius: 6 }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


