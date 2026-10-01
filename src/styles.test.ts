import fs from 'fs';
import path from 'path';

/**
 * Layout guards for the header.
 *
 * jsdom cannot compute layout, so these tests check the CSS invariants that keep
 * the controls aligned. They exist because two real bugs slipped through here
 * before: controls with mismatched heights, and Bootstrap's default `ul` margin
 * pushing the navigation links above the centre line of the bar.
 */
const css = fs
  .readFileSync(path.join(__dirname, 'App.css'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '');

/** Bodies of every rule for a selector, including media-query variants. */
const ruleBodies = (selector: string): string[] => {
  const bodies: string[] = [];
  let index = css.indexOf(`${selector} {`);

  while (index !== -1) {
    bodies.push(css.slice(index, css.indexOf('}', index)));
    index = css.indexOf(`${selector} {`, index + 1);
  }

  return bodies;
};

const headerControls = [
  '.brand',
  '.brand__mark',
  '.nav-links .nav-link',
  '.lang-switch',
  '.theme-toggle',
  '.nav-toggle',
];

test('every header control uses the shared control height', () => {
  headerControls.forEach((selector) => {
    const bodies = ruleBodies(selector);
    expect(bodies.length).toBeGreaterThan(0);
    expect(
      bodies.some((body) => /height:\s*var\(--nav-control-h\)/.test(body))
    ).toBe(true);
  });
});

test('the language buttons fill the switcher so the active pill matches', () => {
  const bodies = ruleBodies('.lang-switch button');
  expect(bodies.some((body) => /height:\s*100%/.test(body))).toBe(true);
});

test('the navigation list resets the browser list margin', () => {
  // Bootstrap's reboot adds `margin-bottom: 1rem` to every <ul>. Without a reset
  // the list is taller than the other controls and its links float above the
  // centre line of the header.
  const base = ruleBodies('.nav-links')[0];
  expect(base).toMatch(/margin:\s*0;/);
});

test('the anchor offset follows the real header height', () => {
  expect(css).toMatch(/--header-h:\s*calc\(var\(--nav-control-h\)/);
});

/* --------------------------------------------------------------------------
   GitHub action buttons: they must look active (coloured, not grey) next to
   the gradient brand buttons, and stay readable in both themes.
   -------------------------------------------------------------------------- */

const THEMES = [':root', ":root[data-theme='dark']"];

const token = (name: string, theme: string): string => {
  const body = ruleBodies(theme)[0];
  const match = body.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`--${name} not found in ${theme}`);
  return match[1].trim();
};

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const channelLuminance = (value: number): number => {
  const channel = value / 255;
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4);
};

const relativeLuminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
};

const contrastRatio = (a: string, b: string): number => {
  const first = relativeLuminance(a);
  const second = relativeLuminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
};

const gradientStops = (value: string): string[] =>
  value.match(/#[0-9a-fA-F]{6}/g) ?? [];

test('the GitHub button uses its own gradient tokens', () => {
  const base = ruleBodies('.btn-github')[0];
  expect(base).toMatch(/background:\s*var\(--btn-github-grad\)/);
  expect(css).toMatch(/var\(--btn-github-grad-hover\)/);
  // Before, dark mode rendered it as a flat translucent grey.
  expect(token('btn-github-grad', ":root[data-theme='dark']")).toMatch(/gradient/);
});

test('the GitHub gradient is green, never grey, in both themes', () => {
  THEMES.forEach((theme) => {
    const stops = [
      ...gradientStops(token('btn-github-grad', theme)),
      ...gradientStops(token('btn-github-grad-hover', theme)),
    ];

    expect(stops.length).toBeGreaterThanOrEqual(3);
    stops.forEach((stop) => {
      const [r, g, b] = hexToRgb(stop);
      // A green-dominant hue reads as "active"; grey would have r ≈ g ≈ b.
      expect(g).toBeGreaterThan(r + 30);
      expect(g).toBeGreaterThan(b + 20);
    });
  });
});

test('GitHub button text stays readable on every gradient stop', () => {
  THEMES.forEach((theme) => {
    const foreground = token('btn-github-fg', theme);
    const stops = [
      ...gradientStops(token('btn-github-grad', theme)),
      ...gradientStops(token('btn-github-grad-hover', theme)),
    ];

    stops.forEach((stop) => {
      expect(contrastRatio(stop, foreground)).toBeGreaterThanOrEqual(4.5);
    });
  });
});
