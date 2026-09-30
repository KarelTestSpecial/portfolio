import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

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
