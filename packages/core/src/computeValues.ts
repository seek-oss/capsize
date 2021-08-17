import { ComputedValues, CapsizeOptions } from './types';
import { normaliseOptions } from './normaliseOptions';
import { round } from './round';

export function computeValues(options: CapsizeOptions): ComputedValues {
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

  const capHeightTrim =
    allowForLineHeight(ascentScale - capHeightScale + lineGapScale / 2) * -1;
  const baselineTrim = allowForLineHeight(descentScale + lineGapScale / 2) * -1;

  return {
    fontSize: `${round(fontSize)}px`,
    lineHeight: lineHeight ? `${round(lineHeight)}px` : 'normal',
    capHeightTrim: `${round(capHeightTrim)}em`,
    baselineTrim: `${round(baselineTrim)}em`,
  };
}
