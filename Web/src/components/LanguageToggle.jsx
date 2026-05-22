import styles from './LanguageToggle.module.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={styles.toggle}>
      <button
        type="button"
        className={`${styles.option} ${language === 'de' ? styles.active : ''}`}
        onClick={() => setLanguage('de')}
      >
        DE
      </button>
      <button
        type="button"
        className={`${styles.option} ${language === 'en' ? styles.active : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
}
