/**
 * Color scheme contrast tests
 * Verifies WCAG AA contrast ratios for text/background pairs in both light and dark themes.
 * - Normal text: ratio >= 4.5
 * - Large text (headings, bold >=18.66px): ratio >= 3.0
 * - UI components (icons, borders): ratio >= 3.0
 */

// ---- helpers ----

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function parseRgba(rgba: string): { r: number; g: number; b: number; a: number } {
  const match = rgba.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!match) throw new Error(`Cannot parse color: ${rgba}`);
  return {
    r: parseFloat(match[1]),
    g: parseFloat(match[2]),
    b: parseFloat(match[3]),
    a: match[4] !== undefined ? parseFloat(match[4]) : 1,
  };
}

/** Blend a semi-transparent foreground onto an opaque background */
function blendOnto(fg: { r: number; g: number; b: number; a: number }, bgHex: string): [number, number, number] {
  const [br, bg, bb] = parseHex(bgHex);
  const a = fg.a;
  return [
    Math.round(fg.r * a + br * (1 - a)),
    Math.round(fg.g * a + bg * (1 - a)),
    Math.round(fg.b * a + bb * (1 - a)),
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(color1: [number, number, number], color2: [number, number, number]): number {
  const l1 = relativeLuminance(...color1);
  const l2 = relativeLuminance(...color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveColor(value: string, bgHex?: string): [number, number, number] {
  if (value.startsWith('#')) return parseHex(value);
  if (value.startsWith('rgb')) {
    const parsed = parseRgba(value);
    if (parsed.a < 1 && bgHex) return blendOnto(parsed, bgHex);
    return [Math.round(parsed.r), Math.round(parsed.g), Math.round(parsed.b)];
  }
  throw new Error(`Unsupported color format: ${value}`);
}

// ---- theme definitions (mirror of global.scss) ----

const LIGHT = {
  bg: '#ffffff',
  bgSection: '#f6f7f9',
  bgCard: '#ffffff',
  text: '#19212d',
  textSecondary: '#4d5571',
  border: 'rgba(25, 33, 45, 0.06)',
  glass: 'rgba(255, 255, 255, 0.55)',
  overlayMid: 'rgba(255, 255, 255, 0.25)',
  overlayEnd: 'rgba(255, 255, 255, 0.80)',
  accentFunding: '#007461',
};

const DARK = {
  bg: '#191919',
  bgSection: '#242424',
  bgCard: '#303030',
  text: '#f0f0f0',
  textSecondary: '#909090',
  border: 'rgba(255, 255, 255, 0.1)',
  accentFunding: '#6ea371',
  glass: 'rgba(0, 0, 0, 0.4)',
  overlayMid: 'rgba(25, 25, 25, 0.25)',
  overlayEnd: 'rgba(25, 25, 25, 0.80)',
};

const BRAND = {
  primary: '#007461',
  primaryHover: '#075144',
  tertiary: '#6ea371',
  red: '#e62f44',
};

// ---- tests ----

describe('Light theme contrast', () => {
  const t = LIGHT;

  it('primary text on bg meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.text), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('secondary text on bg meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.textSecondary), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('primary text on bg-section meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.text), resolveColor(t.bgSection));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('secondary text on bg-section meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.textSecondary), resolveColor(t.bgSection));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('primary text on card overlay-end meets large text AA (>= 3.0)', () => {
    const blendedOverlay = resolveColor(t.overlayEnd, t.bg);
    const ratio = contrastRatio(resolveColor(t.text), blendedOverlay);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('secondary text on card overlay-end meets large text AA (>= 3.0)', () => {
    const blendedOverlay = resolveColor(t.overlayEnd, t.bg);
    const ratio = contrastRatio(resolveColor(t.textSecondary), blendedOverlay);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('brand primary on bg meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(BRAND.primary), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('funding accent on bg meets AA for large text (>= 3.0)', () => {
    const ratio = contrastRatio(resolveColor(t.accentFunding), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('white text on brand primary button meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor('#ffffff'), resolveColor(BRAND.primary));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Dark theme contrast', () => {
  const t = DARK;

  it('primary text on bg meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.text), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('secondary text on bg meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.textSecondary), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('primary text on bg-section meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.text), resolveColor(t.bgSection));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('secondary text on bg-section meets AA (>= 4.5)', () => {
    const ratio = contrastRatio(resolveColor(t.textSecondary), resolveColor(t.bgSection));
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('primary text on card overlay-end meets large text AA (>= 3.0)', () => {
    const blendedOverlay = resolveColor(t.overlayEnd, t.bg);
    const ratio = contrastRatio(resolveColor(t.text), blendedOverlay);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('secondary text on card overlay-end meets large text AA (>= 3.0)', () => {
    const blendedOverlay = resolveColor(t.overlayEnd, t.bg);
    const ratio = contrastRatio(resolveColor(t.textSecondary), blendedOverlay);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('brand primary on dark bg is legible (>= 3.0)', () => {
    const ratio = contrastRatio(resolveColor(BRAND.primary), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('funding accent on dark bg is legible (>= 3.0)', () => {
    const ratio = contrastRatio(resolveColor(t.accentFunding), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('brand red on dark bg meets AA for large text (>= 3.0)', () => {
    const ratio = contrastRatio(resolveColor(BRAND.red), resolveColor(t.bg));
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });
});

describe('Glass elements contrast', () => {
  it('light glass blended on mid-gray image has contrast with dark text (>= 3.0)', () => {
    const imageColor = '#808080'; // neutral mid-gray worst-case
    const blendedGlass = resolveColor(LIGHT.glass, imageColor);
    const ratio = contrastRatio(resolveColor(LIGHT.text), blendedGlass);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  it('dark glass blended on mid-gray image has contrast with light text (>= 3.0)', () => {
    const imageColor = '#808080';
    const blendedGlass = resolveColor(DARK.glass, imageColor);
    const ratio = contrastRatio(resolveColor(DARK.text), blendedGlass);
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });
});
