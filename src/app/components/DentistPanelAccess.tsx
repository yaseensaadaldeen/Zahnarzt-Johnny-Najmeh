import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Button } from './Button';
import { Input } from './Input';
import { useLanguage } from '../context/LanguageContext';

interface DentistPanelAccessProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function DentistPanelAccess({ isOpen, onClose }: DentistPanelAccessProps) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/auth/dentist-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Access denied' }));
        setError(err.message || 'Access denied');
        return;
      }

      const data = await res.json();
      sessionStorage.setItem('dentistToken', data.token);
      navigate('/dentist/control-panel');
      onClose();
      setAccessCode('');
    } catch {
      setError('Connection error. Check server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 m-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-semibold">
                    {t('Praxis-Panel', 'Practice Panel')}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-muted-foreground mb-6">
                {t(
                  'Bitte geben Sie den Zugangscode ein, um auf das Praxis-Panel zuzugreifen.',
                  'Please enter the access code to access the practice panel.'
                )}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="password"
                  label={t('Zugangscode', 'Access Code')}
                  placeholder="••••••••••"
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    setError('');
                  }}
                  error={error}
                  autoFocus
                />
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? t('Überprüft...', 'Verifying...') : t('Zugriff', 'Access')}
                </Button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
