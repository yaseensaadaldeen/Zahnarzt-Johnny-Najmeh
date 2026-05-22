import { AnimatePresence, motion } from 'framer-motion';
import FormField from './FormField';
import styles from './AppointmentEditorModal.module.css';

export default function AppointmentEditorModal({
  open,
  title,
  values,
  onChange,
  onClose,
  onSubmit,
  labels,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className={styles.card}>
              <h3 className={styles.title}>{title}</h3>
              <div className={styles.form}>
                <FormField label={labels.patientName} value={values.patientName} onChange={(event) => onChange('patientName', event.target.value)} />
                <FormField label={labels.patientEmail} type="email" value={values.patientEmail} onChange={(event) => onChange('patientEmail', event.target.value)} />
                <FormField label={labels.patientPhone} value={values.patientPhone} onChange={(event) => onChange('patientPhone', event.target.value)} />
                <FormField label={labels.date} type="date" value={values.date} onChange={(event) => onChange('date', event.target.value)} />
                <FormField label={labels.time} type="time" value={values.time} onChange={(event) => onChange('time', event.target.value)} />
                <FormField label={labels.service} value={values.service} onChange={(event) => onChange('service', event.target.value)} />
                <FormField as="select" label={labels.status} value={values.status} onChange={(event) => onChange('status', event.target.value)}>
                  <option value="pending">{labels.pending}</option>
                  <option value="confirmed">{labels.confirmed}</option>
                  <option value="completed">{labels.completed}</option>
                  <option value="cancelled">{labels.cancelled}</option>
                </FormField>
              </div>
              <div className={styles.actions}>
                <button type="button" className={styles.secondary} onClick={onClose}>{labels.cancel}</button>
                <button type="button" className={styles.primary} onClick={onSubmit}>{labels.save}</button>
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
