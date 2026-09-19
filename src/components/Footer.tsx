import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="text-center py-4">
      <div className="container">
        <p className="text-muted">{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;
