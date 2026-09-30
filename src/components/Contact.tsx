import React, { useCallback, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import cvNl from '../data/cv.json';
import cvEng from '../data/cv-eng.json';
import { IconGithub, IconLinkedin, IconMail } from './Icons';

const Contact: React.FC = () => {
  const { language, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const cvData = language === 'en' ? cvEng : cvNl;
  const { email, linkedin, github } = cvData.contact;

  const copyEmail = useCallback(async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }, [email]);

  return (
    <section id="contact">
      <div className="container">
        <div className="contact-panel" data-reveal>
          <h2>{t('contact.title')}</h2>
          <p className="mb-0">
            {t('contact.text')} <a href={`mailto:${email}`}>{email}</a>
          </p>

          <div className="contact-panel__actions">
            <a className="btn btn-light-brand" href={`mailto:${email}`}>
              <IconMail size={16} className="me-2" />
              {t('contact.emailMe')}
            </a>
            <button type="button" className="btn btn-glass" onClick={copyEmail}>
              {copied ? t('contact.copied') : t('contact.copy')}
            </button>
            <a
              className="btn btn-glass"
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconLinkedin size={16} className="me-2" />
              LinkedIn
            </a>
            <a
              className="btn btn-glass"
              href={`https://${github}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconGithub size={16} className="me-2" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
