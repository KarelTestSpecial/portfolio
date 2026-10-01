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
