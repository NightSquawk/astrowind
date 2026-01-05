/**
 * Color Contrast Utility
 *
 * Calculates color contrast ratios and checks WCAG compliance.
 * Based on WCAG 2.1 guidelines: https://www.w3.org/TR/WCAG21/
 */

/**
 * Calculate relative luminance of a color
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Parse color string to RGB values
 * Supports hex, rgb(), rgba() formats
 */
export function parseColor(color: string): { r: number; g: number; b: number } | null {
  // Remove whitespace
  color = color.trim();

  // Hex format
  if (color.startsWith('#')) {
    const hex = color.substring(1);
    let r, g, b;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16);
      g = parseInt(hex.substring(2, 4), 16);
      b = parseInt(hex.substring(4, 6), 16);
    } else {
      return null;
    }

    return { r, g, b };
  }

  // RGB/RGBA format
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
    };
  }

  return null;
}

/**
 * Calculate contrast ratio between two colors
 * @see https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number | null {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  if (!rgb1 || !rgb2) return null;

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG compliance levels
 */
export type WCAGLevel = 'AA' | 'AAA';
export type TextSize = 'normal' | 'large';

/**
 * Check if contrast ratio meets WCAG standards
 * Normal text: 14pt or smaller (or 18.5px or smaller)
 * Large text: 14pt bold or larger, or 18pt or larger (or 18.5px bold or larger, or 24px or larger)
 */
export function meetsWCAG(ratio: number, level: WCAGLevel = 'AA', textSize: TextSize = 'normal'): boolean {
  if (level === 'AAA') {
    return textSize === 'large' ? ratio >= 4.5 : ratio >= 7;
  } else {
    // AA
    return textSize === 'large' ? ratio >= 3 : ratio >= 4.5;
  }
}

/**
 * Get WCAG compliance status for a contrast ratio
 */
export function getWCAGCompliance(
  ratio: number,
  textSize: TextSize = 'normal'
): {
  aa: boolean;
  aaa: boolean;
  level: 'AAA' | 'AA' | 'fail';
  message: string;
} {
  const aa = meetsWCAG(ratio, 'AA', textSize);
  const aaa = meetsWCAG(ratio, 'AAA', textSize);

  let level: 'AAA' | 'AA' | 'fail';
  let message: string;

  if (aaa) {
    level = 'AAA';
    message = 'Excellent contrast - meets WCAG AAA standards';
  } else if (aa) {
    level = 'AA';
    message = 'Good contrast - meets WCAG AA standards';
  } else {
    level = 'fail';
    message = 'Poor contrast - fails WCAG standards';
  }

  return { aa, aaa, level, message };
}

/**
 * Check contrast for an element's text against its background
 */
export function checkElementContrast(element: HTMLElement): {
  ratio: number | null;
  foreground: string;
  background: string;
  compliance: ReturnType<typeof getWCAGCompliance> | null;
} {
  const computedStyle = window.getComputedStyle(element);
  const foreground = computedStyle.color;
  const background = computedStyle.backgroundColor;

  // Determine text size
  const fontSize = parseFloat(computedStyle.fontSize);
  const fontWeight = computedStyle.fontWeight;
  const isBold = parseInt(fontWeight) >= 700 || fontWeight === 'bold';

  let textSize: TextSize = 'normal';
  if ((fontSize >= 18.5 && isBold) || fontSize >= 24) {
    textSize = 'large';
  }

  const ratio = getContrastRatio(foreground, background);

  return {
    ratio,
    foreground,
    background,
    compliance: ratio ? getWCAGCompliance(ratio, textSize) : null,
  };
}
