import React from 'react';
import projectsData from '../data/projects.json';
import { showcaseSites } from '../data/showcase';
import { useLanguage } from '../i18n/LanguageContext';
import {
  IconArrowRight,
  IconGlobe,
  IconMail,
  IconPuzzle,
} from './Icons';
import deskImage from '../assets/desk-setup.jpg';

const Hero: React.FC = () => {
  const { t } = useLanguage();

  const { chromeExtensions, githubProjects, websites } = projectsData;
  const projectCount = chromeExtensions.length + githubProjects.length + websites.length;

  const stats = [
    { value: projectCount, label: t('hero.stat.projects') },
    { value: chromeExtensions.length, label: t('hero.stat.extensions') },
    { value: showcaseSites.length, label: t('hero.stat.showcase') },
  ];

  return (
    <section className="hero">
      <div className="hero__grid">
        <div className="hero__intro">
          <span className="eyebrow">
            <span className="dot" aria-hidden="true" />
            {t('hero.eyebrow')}
          </span>

          <h1 className="hero__title">
            {t('hero.titleLead')}
            <span className="accent">{t('hero.titleAccent')}</span>
          </h1>

          <p className="hero__subtitle">{t('hero.subtitle')}</p>

          <div className="hero__actions">
            <a className="btn btn-brand" href="#projects">
              {t('hero.cta.projects')}
              <IconArrowRight size={16} className="ms-2" />
            </a>
            <a className="btn btn-outline-ink" href="#contact">
              <IconMail size={16} className="me-2" />
              {t('hero.cta.contact')}
            </a>
          </div>

          <div className="hero__stats">
            {stats.map((stat) => (
              <div className="stat-chip" key={stat.label}>
                <span className="stat-chip__value">{stat.value}</span>
                <span className="stat-chip__label">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="hero__status">
            <span className="status-pill">
              <span className="status-pill__dot" aria-hidden="true" />
              {t('hero.status')}
            </span>
          </p>
        </div>

        <figure className="hero-visual">
          <div className="hero-visual__frame">
            <div className="hero-visual__bar" aria-hidden="true">
              <span />
              <span />
              <span />
              <em>kareltestspecial.github.io/portfolio</em>
            </div>
            <img
              className="hero-visual__img"
              src={deskImage}
              alt={t('hero.imageAlt')}
              loading="eager"
            />
          </div>

          <figcaption className="hero-badge hero-badge--tl">
            <span className="hero-badge__icon" aria-hidden="true">
              <IconPuzzle size={16} />
            </span>
            {chromeExtensions.length} {t('hero.stat.extensions')}
          </figcaption>

          <figcaption className="hero-badge hero-badge--br">
            <span className="hero-badge__icon" aria-hidden="true">
              <IconGlobe size={16} />
            </span>
            {showcaseSites.length} {t('hero.stat.showcase')}
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
