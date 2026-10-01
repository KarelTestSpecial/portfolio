import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-switch" role="group" aria-label="Language">
      <button
        type="button"
        className={language === 'nl' ? 'is-active' : undefined}
        aria-pressed={language === 'nl'}
        onClick={() => setLanguage('nl')}
      >
        NL
      </button>
      <button
        type="button"
        className={language === 'en' ? 'is-active' : undefined}
        aria-pressed={language === 'en'}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
