import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import AppointmentRequestForm from './AppointmentRequestForm';
import styles from './AppointmentRequestModal.module.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function AppointmentRequestModal({ open, onClose, defaultService = '', onSuccess }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={onClose}
          />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className={`${styles.card} surface-card`}>
              <button type="button" className={styles.closeButton} onClick={onClose} aria-label={t({ de: 'Dialog schliessen', en: 'Close dialog' })}>
                <X size={20} />
              </button>
              <h2 className="heading-section text-center" style={{ fontSize: '2rem', marginBottom: '24px' }}>
                {t({ de: 'Schnelle Terminanfrage', en: 'Quick Appointment Request' })}
              </h2>
              <AppointmentRequestForm defaultService={defaultService} onSuccess={onSuccess} />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
