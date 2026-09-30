import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import cvNl from '../data/cv.json';
import cvEng from '../data/cv-eng.json';
import {
  IconCar,
  IconGithub,
  IconInfo,
  IconLinkedin,
  IconMail,
  IconUser,
} from './Icons';

/**
 * Splits a skill string on commas that are not inside parentheses,
 * so entries like "Java (JSP, Spring Boot)" stay intact.
 */
const splitSkills = (value: string): string[] => {
  const parts: string[] = [];
  let depth = 0;
  let current = '';

  for (const char of value.replace(/`/g, '')) {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);

    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }

  if (current.trim()) parts.push(current.trim());
  return parts.filter(Boolean);
};

const formatCategory = (category: string): string =>
  category.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const About: React.FC = () => {
  const { language, t } = useLanguage();
  const cvData = language === 'en' ? cvEng : cvNl;

  const contactRows = [
    {
      icon: <IconUser size={18} />,
      label: t('about.name'),
      value: cvData.name,
    },
    {
      icon: <IconMail size={18} />,
      label: t('about.email'),
      value: cvData.contact.email,
      href: `mailto:${cvData.contact.email}`,
    },
    {
      icon: <IconLinkedin size={18} />,
      label: 'LinkedIn',
      value: cvData.contact.linkedin,
      href: `https://${cvData.contact.linkedin}`,
      external: true,
    },
    {
      icon: <IconGithub size={18} />,
      label: 'GitHub',
      value: cvData.contact.github,
      href: `https://${cvData.contact.github}`,
      external: true,
    },
  ];

  return (
    <section id="about">
      <div className="container">
        <h2 data-reveal>{t('about.title')}</h2>

        <div className="row g-4">
          <div className="col-lg-7" data-reveal>
            <div className="info-card info-card--profile">
              <h4 className="mt-0">{t('about.profileTitle')}</h4>
              <p className="profile-text">{cvData.profile}</p>
              <div className="callout">
                <IconInfo size={18} />
                <span>{cvData.notice}</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5" data-reveal data-reveal-delay="1">
            <div className="info-card">
              <h4 className="mt-0">{t('about.contactDetails')}</h4>
              <ul className="contact-list">
                {contactRows.map((row) => (
                  <li className="contact-row" key={row.label}>
                    <span className="contact-row__icon" aria-hidden="true">
                      {row.icon}
                    </span>
                    <span>
                      <span className="contact-row__label">{row.label}</span>
                      {row.href ? (
                        <a
                          href={row.href}
                          {...(row.external
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {row.value}
                        </a>
                      ) : (
                        <span className="value">{row.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              <h4>{t('about.languages')}</h4>
              <div className="chips">
                {cvData.languages.map((lang) => (
                  <span className="chip" key={lang.language}>
                    {lang.language} · {lang.proficiency}
                  </span>
                ))}
              </div>

              <h4>{t('about.mobility')}</h4>
              <div className="chips">
                <span className="chip">
                  <IconCar size={15} className="me-2" />
                  {cvData.transport}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-4">
          <div className="col-lg-7" data-reveal>
            <h4 className="mt-0">{t('about.experience')}</h4>
            <ul className="timeline">
              {cvData.workExperience.map((job, index) => (
                <li className="timeline__item" key={`${job.role}-${index}`}>
                  <span className="timeline__role">{job.role}</span>
                  <span className="timeline__meta">
                    {job.company}
                    {job.company && job.period ? ' · ' : ''}
                    {job.period}
                  </span>
                  {Array.isArray(job.description) && job.description.length > 0 && (
                    <ul className="timeline__list">
                      {job.description.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-5" data-reveal data-reveal-delay="1">
            <h4 className="mt-0">{t('about.education')}</h4>
            <div className="panel mb-4">
              {cvData.education.map((edu, index) => (
                <div className="edu-item" key={`${edu.degree}-${index}`}>
                  <span className="edu-item__year">{edu.year}</span>
                  <span>
                    <span className="edu-item__degree">{edu.degree}</span>
                    {edu.institution && (
                      <span className="edu-item__where"> — {edu.institution}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            <h4>{t('about.skills')}</h4>
            <div className="panel">
              {Object.entries(cvData.skills).map(([category, skills]) => (
                <div className="skill-group" key={category}>
                  <span className="skill-group__label">{formatCategory(category)}</span>
                  <div className="chips">
                    {splitSkills(skills).map((skill) => (
                      <span className="chip" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
