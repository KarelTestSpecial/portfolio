import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useTheme } from './ThemeContext';
import { IconMoon, IconSun } from '../components/Icons';

/**
 * Light/dark switch. The knob slides to the side of the active theme and shows
 * that theme's icon; the two icons in the track hint at what can be chosen.
 */
const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === 'dark';
  const label = isDark ? t('theme.switchToLight') : t('theme.switchToDark');

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
    >
      <span className="theme-toggle__icons" aria-hidden="true">
        <IconSun size={15} />
        <IconMoon size={15} />
      </span>
      <span className="theme-toggle__thumb" aria-hidden="true">
        {isDark ? <IconMoon size={15} /> : <IconSun size={15} />}
      </span>
    </button>
  );
};

export default ThemeToggle;
