import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { authApi } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import styles from './DentistPanelAccess.module.css';

export default function DentistPanelAccess({ isOpen, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authApi.verifyDentistCode(code);
      sessionStorage.setItem('dentistAccessGranted', 'true');
      onClose();
      setCode('');
      navigate('/dentist-panel');
    } catch (requestError) {
      setError(t({ de: 'Falscher Zugangscode', en: 'Incorrect access code' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className={styles.card}>
              <div className={styles.header}>
                <div className={styles.iconWrap}><Lock size={24} /></div>
                <button type="button" className={styles.close} onClick={onClose}><X size={18} /></button>
              </div>
              <h3 className={styles.title}>{t({ de: 'Praxis-Panel', en: 'Practice Panel' })}</h3>
              <p className={styles.copy}>
                {t({
                  de: 'Bitte geben Sie den Zugangscode ein, um die Terminverwaltung fuer Zahnarzt Johnny zu oeffnen.',
                  en: 'Enter the access code to open Dentist Johnny’s appointment management panel.',
                })}
              </p>
              <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>{t({ de: 'Zugangscode', en: 'Access Code' })}</label>
                <input
                  type="password"
                  value={code}
                  className={styles.input}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder=""
                  autoFocus
                />
                {error ? <div className={styles.error}>{error}</div> : null}
                <button type="submit" className={styles.submit} disabled={loading}>
                  {loading ? t({ de: 'Pruefe...', en: 'Checking...' }) : t({ de: 'Zugriff', en: 'Access' })}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
