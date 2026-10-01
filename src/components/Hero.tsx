import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="jumbotron text-center">
      <div className="container">
        <h1 className="display-4">{t('hero.title')}</h1>
        <p className="lead text-muted text-readable-shadow">{t('hero.subtitle')}</p>
      </div>
    </section>
  );
};

export default Hero;
