import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

const NAV_ITEMS = [
  { id: 'about', key: 'header.about' },
  { id: 'projects', key: 'header.projects' },
  { id: 'contact', key: 'header.contact' },
];

const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { t } = useLanguage();

  // Highlight the section that is currently in view.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const targets = NAV_ITEMS
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.6, 1] }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label={t('header.brand')}>
        <div className="container site-nav__inner">
          <a className="brand" href="#top" onClick={() => setIsNavOpen(false)}>
            <span className="brand__mark" aria-hidden="true">KD</span>
            <span className="brand__text">{t('header.brand')}</span>
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
            onClick={() => setIsNavOpen((open) => !open)}
          >
            <span className="nav-toggle__bars" />
          </button>

          <div className={`site-nav__collapse ${isNavOpen ? 'is-open' : ''}`} id="navbarNav">
            <ul className="nav-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    className={`nav-link ${activeSection === item.id ? 'is-active' : ''}`}
                    href={`#${item.id}`}
                    aria-current={activeSection === item.id ? 'true' : undefined}
                    onClick={() => setIsNavOpen(false)}
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
