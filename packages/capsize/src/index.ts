export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}

export interface CapsizeOptions {
  leading?: number;
  gap?: number;
  capHeight: number;
  fontMetrics: FontMetrics;
}
const preventCollapse = 0.05;

export default function capsize({
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

  let specifiedLineHeight;

  if (typeof gap !== 'undefined') {
    specifiedLineHeight = capHeight + gap;
  } else if (typeof leading !== 'undefined') {
    specifiedLineHeight = leading;
  }

  return createCss({
    lineHeight: specifiedLineHeight,
    fontSize: capHeight / capHeightScale,
    fontMetrics,
  });
}

interface CapsizeInternal {
  lineHeight?: number;
  fontSize: number;
  fontMetrics: FontMetrics;
}
function createCss({ lineHeight, fontSize, fontMetrics }: CapsizeInternal) {
  const toScale = (value: number) => value / fontSize;

  const absoluteDescent = Math.abs(fontMetrics.descent);
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  const descentScale = absoluteDescent / fontMetrics.unitsPerEm;
  const ascentScale = fontMetrics.ascent / fontMetrics.unitsPerEm;
  const lineGapScale = fontMetrics.lineGap / fontMetrics.unitsPerEm;

  const contentArea =
    fontMetrics.ascent + fontMetrics.lineGap + absoluteDescent;
  const lineHeightScale = contentArea / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * fontSize;

  const specifiedLineHeightOffset = lineHeight
    ? (lineHeightNormal - lineHeight) / 2
    : 0;

  const leadingTrim = (value: number) =>
    value - toScale(specifiedLineHeightOffset) + toScale(preventCollapse);

  return {
    fontSize: `${fontSize}px`,
    ...(lineHeight && { lineHeight: `${lineHeight}px` }),
    padding: `${preventCollapse}px 0`,
    ':before': {
      content: "''",
      marginTop: `-${leadingTrim(
        ascentScale - capHeightScale + lineGapScale / 2,
      )}em`,
      display: 'block',
      height: 0,
    },
    ':after': {
      content: "''",
      marginBottom: `-${leadingTrim(descentScale + lineGapScale / 2)}em`,
      display: 'block',
      height: 0,
    },
  };
}
