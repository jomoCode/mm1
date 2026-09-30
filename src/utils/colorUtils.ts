/**
 * Color helper utilities for calculating hero and footer dark shades dynamically
 */

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const sanitized = hex.replace('#', '').trim();
  if (sanitized.length === 3) {
    return {
      r: parseInt(sanitized[0] + sanitized[0], 16),
      g: parseInt(sanitized[1] + sanitized[1], 16),
      b: parseInt(sanitized[2] + sanitized[2], 16),
    };
  }
  if (sanitized.length === 6) {
    return {
      r: parseInt(sanitized.slice(0, 2), 16),
      g: parseInt(sanitized.slice(2, 4), 16),
      b: parseInt(sanitized.slice(4, 6), 16),
    };
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Mixes a color with black (shade) by a given factor between 0 (original) and 1 (black)
 */
export function shadeColor(hex: string, factor: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const f = Math.max(0, Math.min(1, factor));
  return rgbToHex(rgb.r * (1 - f), rgb.g * (1 - f), rgb.b * (1 - f));
}

/**
 * Derives coordinated hero and footer dark backgrounds from a primary color
 */
export function deriveThemeDarkSurfaces(primaryHex: string) {
  return {
    heroBgFrom: shadeColor(primaryHex, 0.72),
    heroBgVia: shadeColor(primaryHex, 0.55),
    heroBgTo: shadeColor(primaryHex, 0.85),
    footerBg: shadeColor(primaryHex, 0.88),
    footerStripBg: shadeColor(primaryHex, 0.78),
  };
}
