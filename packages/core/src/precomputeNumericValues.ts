import { CapsizeOptions } from './types';
import { normaliseOptions } from './normaliseOptions';

export function precomputeNumericValues(options: CapsizeOptions) {
  const { fontSize, lineHeight, fontMetrics } = normaliseOptions(options);

  const absoluteDescent = Math.abs(fontMetrics.descent);
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  const descentScale = absoluteDescent / fontMetrics.unitsPerEm;
  const ascentScale = fontMetrics.ascent / fontMetrics.unitsPerEm;
  const lineGapScale = fontMetrics.lineGap / fontMetrics.unitsPerEm;

  const contentArea =
    fontMetrics.ascent + fontMetrics.lineGap + absoluteDescent;
  const lineHeightScale = contentArea / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * fontSize;

  const allowForLineHeight = (trim: number) => {
    if (lineHeight) {
      const specifiedLineHeightOffset = (lineHeightNormal - lineHeight) / 2;
      return trim - specifiedLineHeightOffset / fontSize;
    }

    return trim;
  };

  const capHeightTrimEm =
    allowForLineHeight(ascentScale - capHeightScale + lineGapScale / 2) * -1;
  const baselineTrimEm =
    allowForLineHeight(descentScale + lineGapScale / 2) * -1;

  return {
    fontSize,
    lineHeight,
    capHeightTrimEm,
    baselineTrimEm,
  } as const;
}
