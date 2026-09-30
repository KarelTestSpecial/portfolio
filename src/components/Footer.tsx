import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { IconArrowUp } from './Icons';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <a className="brand" href="#top">
          <span className="brand__mark" aria-hidden="true">KD</span>
          <span className="brand__text">{t('header.brand')}</span>
        </a>

        <ul className="footer-links">
          <li><a href="#about">{t('header.about')}</a></li>
          <li><a href="#projects">{t('header.projects')}</a></li>
          <li><a href="#athena-showcase">Athena</a></li>
          <li><a href="#contact">{t('header.contact')}</a></li>
        </ul>

        <a className="to-top" href="#top">
          <IconArrowUp size={15} />
          {t('footer.top')}
        </a>
      </div>

      <hr />

      <div className="site-footer__inner">
        <p className="footer-note">{t('footer.copyright')}</p>
        <p className="footer-note">{t('footer.builtWith')}</p>
      </div>
    </footer>
  );
};

export default Footer;
