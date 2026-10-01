import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { showcaseSites, showcaseUrl } from '../data/showcase';
import { IconExternal } from './Icons';

const AthenaShowcase: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="athena-showcase">
      <div className="container">
        <h2 data-reveal>{t('athena.title')}</h2>

        <p data-reveal>
          {t('athena.description')}{' '}
          <a href={showcaseUrl} target="_blank" rel="noopener noreferrer">
            Athena CMS Factory
          </a>
          {t('athena.descriptionSuffix')}
        </p>

        <div className="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-4">
          {showcaseSites.map((site, index) => (
            <div
              className="col d-flex align-items-stretch"
              key={site.name}
              data-reveal
              data-reveal-delay={`${(index % 4) + 1}`}
            >
              <a
                href={site.url}
                className="showcase-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="showcase-card__preview" aria-hidden="true" />
                <h5 className="showcase-card__name">{site.name}</h5>
                <p className="showcase-card__category">{site.category}</p>
                <span className="showcase-card__foot">
                  {t('athena.visit')}
                  <IconExternal size={15} />
                </span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AthenaShowcase;
