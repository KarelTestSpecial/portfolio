import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSwitcher from '../i18n/LanguageSwitcher';

const Header: React.FC = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const { t } = useLanguage();

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'rgba(204, 197, 184, 1)' }}>
        <div className="container">
          <button className="navbar-brand" style={{ border: 'none', background: 'none', cursor: 'default' }}>{t('header.brand')}</button>
          <button className="navbar-toggler" type="button" aria-controls="navbarNav" aria-expanded={!isNavCollapsed} aria-label="Toggle navigation" onClick={handleNavCollapse}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#about">{t('header.about')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#projects">{t('header.projects')}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contact">{t('header.contact')}</a>
              </li>
            </ul>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
