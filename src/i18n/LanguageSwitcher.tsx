import React from 'react';
import { useLanguage } from './LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="d-flex align-items-center ms-3">
      <button
        className="btn btn-sm me-1"
        style={{
          fontWeight: language === 'nl' ? 'bold' : 'normal',
          textDecoration: language === 'nl' ? 'underline' : 'none',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
        onClick={() => setLanguage('nl')}
      >
        NL
      </button>
      <span className="text-muted">|</span>
      <button
        className="btn btn-sm ms-1"
        style={{
          fontWeight: language === 'en' ? 'bold' : 'normal',
          textDecoration: language === 'en' ? 'underline' : 'none',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
