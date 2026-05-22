import styles from './FormField.module.css';

export default function FormField({ label, as = 'input', className = '', ...props }) {
  const Component = as;

  return (
    <label className={styles.field}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <Component className={`${styles.control} ${className}`} {...props} />
    </label>
  );
}
