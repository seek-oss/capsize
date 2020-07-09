interface FontMetrics {
  familyName: string;
  subfamilyName: string;
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}
interface CapsizeOptions {
  leading?: number;
  gap?: number;
  capHeight: number;
  fontMetrics: FontMetrics;
}
const preventCollapse = 1;

export default function createCss({
  leading,
  gap,
  capHeight,
  fontMetrics,
}: CapsizeOptions) {
  if (typeof leading !== 'undefined' && typeof gap !== 'undefined') {
    throw new Error(
      'Only a single line height style can be provided. Please pass either `gap` OR `leading`.',
    );
  }

  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  const capSize = capHeight / capHeightScale;

  const toScale = (value: number) => value / capSize;

  const absoluteDescent = Math.abs(fontMetrics.descent);
  const descentScale = absoluteDescent / fontMetrics.unitsPerEm;
  const ascentScale = fontMetrics.ascent / fontMetrics.unitsPerEm;
  const contentArea = fontMetrics.ascent + absoluteDescent;
  const lineHeight = contentArea + fontMetrics.lineGap;
  const lineHeightScale = lineHeight / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * capSize;

  const hasSpecifiedLineHeight =
    typeof leading !== 'undefined' || typeof gap !== 'undefined';

  const specifiedLineHeight =
    typeof gap !== 'undefined' ? capHeight + gap : leading;

  const specifiedLineHeightOffset =
    hasSpecifiedLineHeight && typeof specifiedLineHeight === 'number'
      ? (lineHeightNormal - specifiedLineHeight) / 2
      : 0;

  const leadingTrim = (value: number) =>
    value - toScale(specifiedLineHeightOffset) + toScale(preventCollapse);

  return {
    fontSize: `${capSize}px`,
    ...(hasSpecifiedLineHeight && { lineHeight: `${specifiedLineHeight}px` }),
    paddingTop: `${preventCollapse}px`,
    paddingBottom: `${preventCollapse}px`,
    ':before': {
      content: "''",
      marginTop: `-${leadingTrim(ascentScale - capHeightScale)}em`,
      display: 'block',
      height: 0,
    },
    ':after': {
      content: "''",
      marginBottom: `-${leadingTrim(descentScale)}em`,
      display: 'block',
      height: 0,
    },
  };
}
