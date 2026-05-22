import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { SEO } from '../components/SEO';
import { Save, Plus, Trash2, LogOut, Calendar, X, ArrowLeft, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { availabilityApi, WeeklyShift, OutTime } from '../services/api';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function DentistShiftManager() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [weeklyShifts, setWeeklyShifts] = useState<WeeklyShift[]>([]);
  const [outTimes, setOutTimes] = useState<OutTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [newOutTime, setNewOutTime] = useState<Partial<OutTime>>({
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

  const toggleDay = (dayOfWeek: number) => {
    setWeeklyShifts(prev =>
      prev.map(s => s.dayOfWeek === dayOfWeek ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const updateShift = (dayOfWeek: number, field: 'start' | 'end', value: string) => {
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

  const handleDeleteOutTime = async (id: string) => {
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
        <p className="text-muted-foreground">{t('Laden...', 'Loading...')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/dentist/control-panel">
              <Button variant="secondary" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                {t('Termine', 'Appointments')}
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
              <Link to="/dentist/control-panel">
                <button className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-white transition-colors">
                  {t('Termine', 'Appointments')}
                </button>
              </Link>
              <button className="px-4 py-2 rounded-md text-sm font-medium bg-white shadow-sm">
                {t('Arbeitszeiten', 'Shifts')}
              </button>
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

          <h1 className="font-serif text-4xl font-bold mb-2">
            {t('Arbeitszeiten & Abwesenheiten', 'Shifts & Out-Times')}
          </h1>
          <p className="text-muted-foreground">
            {t('Legen Sie Ihre wöchentlichen Arbeitszeiten und Abwesenheitstage fest', 'Set your weekly working hours and out-of-office days')}
          </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
          }`}>
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Shifts */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-semibold">
                {t('Wöchentliche Arbeitszeiten', 'Weekly Working Hours')}
              </h2>
              <Button variant="primary" onClick={handleSaveWeekly} disabled={saving}>
                <Save size={18} className="mr-2" />
                {saving ? t('Speichert...', 'Saving...') : t('Speichern', 'Save')}
              </Button>
            </div>
            <div className="space-y-3">
              {weeklyShifts.map((shift) => (
                <div
                  key={shift.dayOfWeek}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    shift.enabled ? 'border-border' : 'border-border/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={shift.enabled}
                        onChange={() => toggleDay(shift.dayOfWeek)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="font-semibold">{t(DAYS[shift.dayOfWeek], DAYS[shift.dayOfWeek])}</span>
                    </label>
                  </div>
                  {shift.enabled && (
                    <div className="flex items-center gap-3 ml-8">
                      <Input
                        type="time"
                        value={shift.start}
                        onChange={(e) => updateShift(shift.dayOfWeek, 'start', e.target.value)}
                        className="w-36"
                      />
                      <span className="text-muted-foreground">—</span>
                      <Input
                        type="time"
                        value={shift.end}
                        onChange={(e) => updateShift(shift.dayOfWeek, 'end', e.target.value)}
                        className="w-36"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Out-Times */}
          <Card className="p-6">
            <h2 className="font-serif text-2xl font-semibold mb-6">
              {t('Abwesenheitstage', 'Out-of-Office Days')}
            </h2>

            <div className="space-y-3 mb-6 p-4 bg-muted/30 rounded-xl">
              <h3 className="font-semibold text-sm">{t('Neue Abwesenheit', 'New Out-Time')}</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={newOutTime.date}
                  onChange={(e) => setNewOutTime({ ...newOutTime, date: e.target.value })}
                />
                <Input
                  placeholder={t('Grund (optional)', 'Reason (optional)')}
                  value={newOutTime.reason}
                  onChange={(e) => setNewOutTime({ ...newOutTime, reason: e.target.value })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={newOutTime.allDay}
                  onChange={(e) => setNewOutTime({ ...newOutTime, allDay: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                {t('Ganztägig', 'All day')}
              </label>
              {!newOutTime.allDay && (
                <div className="flex items-center gap-3">
                  <Input
                    type="time"
                    value={newOutTime.start || ''}
                    onChange={(e) => setNewOutTime({ ...newOutTime, start: e.target.value })}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">—</span>
                  <Input
                    type="time"
                    value={newOutTime.end || ''}
                    onChange={(e) => setNewOutTime({ ...newOutTime, end: e.target.value })}
                    className="w-32"
                  />
                </div>
              )}
              <Button variant="primary" onClick={handleAddOutTime} disabled={!newOutTime.date || saving}>
                <Plus size={16} className="mr-2" />
                {t('Hinzufügen', 'Add')}
              </Button>
            </div>

            <div className="space-y-2">
              {outTimes.length === 0 ? (
                <p className="text-muted-foreground text-sm">{t('Keine Abwesenheiten eingetragen', 'No out-times recorded')}</p>
              ) : (
                outTimes.map((ot) => (
                  <div key={ot._id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Calendar size={16} className="text-primary" />
                      <div>
                        <div className="font-medium text-sm">
                          {new Date(ot.date).toLocaleDateString()}
                        </div>
                        {ot.reason && <div className="text-xs text-muted-foreground">{ot.reason}</div>}
                        {!ot.allDay && ot.start && ot.end && (
                          <div className="text-xs text-muted-foreground">{ot.start} — {ot.end}</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteOutTime(ot._id!)}
                      className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
