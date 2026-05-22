import { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('de');

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (copy) => (typeof copy === 'string' ? copy : copy?.[language] ?? ''),
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  return context;
}
