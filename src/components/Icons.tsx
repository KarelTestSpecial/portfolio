import React from 'react';

/**
 * Small inline icon set (stroke based, inherits currentColor).
 * Kept dependency-free so the bundle stays light.
 */

type IconProps = {
  size?: number;
  className?: string;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
});

export const IconMail: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m3.5 7.5 7.4 5.2a2 2 0 0 0 2.2 0l7.4-5.2" />
  </svg>
);

export const IconLinkedin: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M7.5 10.5V17M7.5 7.6v.1M11.5 17v-3.6a2.2 2.2 0 0 1 4.4 0V17" />
  </svg>
);

export const IconGithub: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M15.5 21v-3.2c0-1 .1-1.7-.5-2.3 2.3-.3 4.5-1.2 4.5-5.1a4 4 0 0 0-1.1-2.8 3.7 3.7 0 0 0-.1-2.8s-.9-.3-3 .9a10.4 10.4 0 0 0-5.6 0c-2.1-1.2-3-.9-3-.9a3.7 3.7 0 0 0-.1 2.8 4 4 0 0 0-1.1 2.8c0 3.9 2.2 4.8 4.5 5.1-.5.5-.5 1.1-.5 2.3V21" />
    <path d="M9.6 18.4c-1.9.6-3.3.4-4.2-1.4" />
  </svg>
);

export const IconUser: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="8.5" r="3.6" />
    <path d="M4.8 20a7.4 7.4 0 0 1 14.4 0" />
  </svg>
);

export const IconSpark: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3.5 13.7 9l5.5 1.7-5.5 1.7L12 18l-1.7-5.6L4.8 10.7 10.3 9z" />
    <path d="M18.5 16.5l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6z" />
  </svg>
);

export const IconGlobe: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.4 2.4 14.6 0 17-2.4-2.4-2.4-14.6 0-17z" />
  </svg>
);

export const IconPuzzle: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M10 4.5h2.2a1.3 1.3 0 0 1 0 2.6H10V9H7.6a1.4 1.4 0 0 0-1.4 1.4V13h2.7a1.3 1.3 0 0 1 0 2.6H6.2v1.6c0 .8.6 1.4 1.4 1.4h1.7v-2.7a1.3 1.3 0 0 1 2.6 0v2.7h3.4c.8 0 1.4-.6 1.4-1.4v-3.3h2.7a1.3 1.3 0 0 1 0-2.6h-2.7V8.4c0-.8-.6-1.4-1.4-1.4H13V4.5z" />
  </svg>
);

export const IconCode: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m9 8-4.5 4L9 16M15 8l4.5 4L15 16" />
  </svg>
);

export const IconLayers: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <path d="m12 3.5 8 4.2-8 4.2-8-4.2z" />
    <path d="m4.5 12.3 7.5 3.9 7.5-3.9M4.5 16.1l7.5 3.9 7.5-3.9" />
  </svg>
);

export const IconInfo: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.2M12 8.1v.1" />
  </svg>
);

export const IconExternal: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M14 5h5v5M19 5l-7.5 7.5" />
    <path d="M18 14v3.5A1.5 1.5 0 0 1 16.5 19h-10A1.5 1.5 0 0 1 5 17.5v-10A1.5 1.5 0 0 1 6.5 6H10" />
  </svg>
);

export const IconArrowRight: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconArrowUp: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);

export const IconCar: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M4.5 15.5h15M6 15.5 7.4 9a2 2 0 0 1 1.9-1.5h5.4A2 2 0 0 1 16.6 9l1.4 6.5" />
    <path d="M5.5 15.5v2.2M18.5 15.5v2.2M8 12.5h8" />
  </svg>
);

export const IconChat: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12.5a7.5 7.5 0 0 1-10.9 6.7L4.5 20l1-3.6A7.5 7.5 0 1 1 20 12.5z" />
  </svg>
);
