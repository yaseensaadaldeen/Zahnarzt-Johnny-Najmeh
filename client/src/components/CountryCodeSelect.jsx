import countries from '../data/countryData';
import styles from './CountryCodeSelect.module.css';

const FLAG_BASE = 'https://flagcdn.com/16x12';

export default function CountryCodeSelect({ value, onChange, onDigitsChange }) {
  const selected = countries.find((c) => c.dial === value) || countries[0];

  const handleChange = (e) => {
    const newDial = e.target.value;
    onChange(newDial);
    const country = countries.find((c) => c.dial === newDial);
    if (country && onDigitsChange) {
      onDigitsChange(country.digits);
    }
  };

  return (
    <div className={styles.wrapper}>
      <img
        className={styles.flag}
        src={`${FLAG_BASE}/${selected.code.toLowerCase()}.png`}
        alt=""
        width="16"
        height="12"
      />
      <select
        className={styles.select}
        value={value}
        onChange={handleChange}
      >
        {countries.map((c) => (
          <option key={c.code} value={c.dial}>
            {c.name} ({c.dial})
          </option>
        ))}
      </select>
    </div>
  );
}
