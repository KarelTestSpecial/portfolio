import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="contact">
      <div className="container">
        <h2>{t('contact.title')}</h2>
        <p>{t('contact.text')} <a href="mailto:karel.decherf@gmail.com">karel.decherf@gmail.com</a></p>
      </div>
    </section>
  );
};

export default Contact;
