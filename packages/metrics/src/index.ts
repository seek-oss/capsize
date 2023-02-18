/**
 * Converts the font family name to the correct casing for the relevant metrics import.
 *
 * ---
 * Example usage:
 *
 * ```ts
 * import { fontFamilyToCamelCase } from '@capsizecss/metrics';
 *
 * const familyName = fontFamilyToCamelCase('--apple-system'); // => `appleSystem`
 * const metrics = await import(`@capsizecss/metrics/${familyName}`);
 * ```
 * ---
 */

export function fontFamilyToCamelCase(str: string) {
  return str
    .split(/[\s|-]/)
    .filter(Boolean)
    .map(
      (s, i) =>
        `${s.charAt(0)[i > 0 ? 'toUpperCase' : 'toLowerCase']()}${s.slice(1)}`,
    )
    .join('');
}
