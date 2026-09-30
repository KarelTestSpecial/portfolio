/**
 * Single source of truth for the Athena CMS Factory showcase.
 * Used by the showcase grid and by the hero statistics.
 */
export interface ShowcaseSite {
  name: string;
  category: string;
  url: string;
}

export const showcaseSites: ShowcaseSite[] = [
  { name: 'Urban Brew & Bite', category: 'Hospitality', url: 'https://athena-cms-factory.github.io/urban-brew-bite' },
  { name: 'Urban Soles', category: 'E-commerce', url: 'https://athena-cms-factory.github.io/urban-soles' },
  { name: 'Belgian Chocolate Shop', category: 'E-commerce', url: 'https://athena-cms-factory.github.io/chocolade-shop' },
  { name: 'Academy-1', category: 'Education', url: 'https://athena-cms-factory.github.io/academy-1' },
  { name: 'De Schaar', category: 'Beauty & Wellness', url: 'https://athena-cms-factory.github.io/de-schaar' },
  { name: 'Athena Pro', category: 'B2B / SaaS', url: 'https://athena-cms-factory.github.io/athena-pro' },
  { name: 'Gentse Dakwerken', category: 'Construction', url: 'https://athena-cms-factory.github.io/gentse-dakwerken-v10' },
  { name: 'Lex & Justitia Advocaten', category: 'Legal Services', url: 'https://athena-cms-factory.github.io/lex-justitia' },
];

export const showcaseUrl = 'https://athena-cms-factory.github.io/athena-hub/';
