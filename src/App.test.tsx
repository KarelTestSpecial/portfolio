import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

// The language choice is persisted in localStorage; clear it so tests do not
// influence each other. Without this, a test that switches to Dutch would make
// the next test render in Dutch instead of the default (browser) language.
beforeEach(() => {
  window.localStorage.clear();
});

test('renders the projects heading', async () => {
  render(<App />);
  // Language defaults to the browser language: accept both translations.
  const headingElement = await screen.findByRole('heading', {
    name: /My Projects|Recente Projecten/i,
  });
  expect(headingElement).toBeInTheDocument();
});

test('brand links back to the top of the page', () => {
  render(<App />);
  const banner = screen.getByRole('banner');
  const brandLink = within(banner).getByRole('link', {
    name: /My Portfolio|Mijn Portfolio/i,
  });
  expect(brandLink).toHaveAttribute('href', '#top');
});

test('the language switcher translates the page', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'NL' }));

  const headingElement = await screen.findByRole('heading', {
    name: /Recente Projecten/i,
  });
  expect(headingElement).toBeInTheDocument();
});

test('no scroll-reveal element stays hidden after re-rendering', () => {
  // Regression test: the revealed state used to live in a CSS class, which React
  // wiped on re-render, leaving whole sections invisible. It now lives in the
  // `data-reveal-state` attribute.
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'NL' }));
  fireEvent.click(screen.getByRole('button', { name: 'EN' }));

  const targets = Array.from(container.querySelectorAll('[data-reveal]'));
  expect(targets.length).toBeGreaterThan(20);

  const hidden = targets.filter(
    (element) => element.getAttribute('data-reveal-state') !== 'shown'
  );
  expect(hidden).toHaveLength(0);
});

test('the Athena showcase explains the Google Sheet CMS in both languages', () => {
  const { container } = render(<App />);
  const showcaseText = () => container.querySelector('#athena-showcase')?.textContent || '';

  expect(showcaseText()).toMatch(/Google Sheet/i);
  expect(showcaseText()).toContain('clients edit their own texts');

  fireEvent.click(screen.getByRole('button', { name: 'NL' }));

  expect(showcaseText()).toMatch(/Google Sheet/i);
  expect(showcaseText()).toContain('klanten passen zelf hun teksten');
});

const cardByTitle = (container: HTMLElement, name: string) =>
  Array.from(container.querySelectorAll('.project-card')).find((element) =>
    element.textContent?.includes(name)
  ) as HTMLElement;

test('project descriptions follow the selected language', () => {
  const { container } = render(<App />);

  // The default in jsdom is English.
  expect(cardByTitle(container, 'Zeer Praktische Klok').textContent).toContain(
    'A customisable digital clock'
  );

  fireEvent.click(screen.getByRole('button', { name: 'NL' }));

  expect(cardByTitle(container, 'Zeer Praktische Klok').textContent).toContain(
    'Een aanpasbare digitale klok'
  );
});

test('every project has a Dutch description and English is optional', () => {
  const projects = require('./data/projects.json');
  const all = [
    ...projects.websites,
    ...projects.chromeExtensions,
    ...projects.githubProjects,
  ] as Array<{ name: string; description: string; descriptionEn?: string }>;

  expect(all.length).toBeGreaterThan(20);
  all.forEach((project) => {
    expect(project.description.length).toBeGreaterThan(10);
    if (project.descriptionEn) {
      expect(project.descriptionEn.length).toBeGreaterThan(10);
    }
  });
});
