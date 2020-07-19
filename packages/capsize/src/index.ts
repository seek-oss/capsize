export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}

type CapHeightWithLeading = {
  capHeight: number;
  leading?: number;
  fontMetrics: FontMetrics;
};

type CapHeightWithGap = {
  capHeight: number;
  gap: number;
  fontMetrics: FontMetrics;
};

type FontSizeWithLeading = {
  fontSize: number;
  leading?: number;
  fontMetrics: FontMetrics;
};

type FontSizeWithGap = {
  fontSize: number;
  gap: number;
  fontMetrics: FontMetrics;
};

const preventCollapse = 0.05;

export type CapsizeOptions =
  | CapHeightWithGap
  | CapHeightWithLeading
  | FontSizeWithGap
  | FontSizeWithLeading;

export function capsize(
  options: CapHeightWithLeading,
): ReturnType<typeof createCss>;
export function capsize(
  options: CapHeightWithGap,
): ReturnType<typeof createCss>;
export function capsize(options: FontSizeWithGap): ReturnType<typeof createCss>;
export function capsize(
  options: FontSizeWithLeading,
): ReturnType<typeof createCss>;

export function capsize(options: CapsizeOptions) {
  if ('leading' in options && 'gap' in options) {
    throw new Error(
      'Only a single line height style can be provided. Please pass either `gap` OR `leading`.',
    );
  }

  if ('capHeight' in options && 'fontSize' in options) {
    throw new Error('Please pass either `capHeight` OR `fontSize`, not both.');
  }

  const { fontMetrics } = options;
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;

  let specifiedFontSize;
  let specifiedCapHeight;

  if ('capHeight' in options) {
    specifiedFontSize = options.capHeight / capHeightScale;
    specifiedCapHeight = options.capHeight;
  } else if ('fontSize' in options) {
    specifiedFontSize = options.fontSize;
    specifiedCapHeight = options.fontSize * capHeightScale;
  } else {
    throw new Error('Please pass either `capHeight` OR `fontSize`.');
  }

  let specifiedLineHeight;

  if ('gap' in options) {
    specifiedLineHeight = specifiedCapHeight + options.gap;
  } else if ('leading' in options) {
    specifiedLineHeight = options.leading;
  }

  return createCss({
    lineHeight: specifiedLineHeight,
    fontSize: specifiedFontSize,
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
      marginTop: `${
        leadingTrim(ascentScale - capHeightScale + lineGapScale / 2) * -1
      }em`,
      display: 'block',
      height: 0,
    },
    ':after': {
      content: "''",
      marginBottom: `${leadingTrim(descentScale + lineGapScale / 2) * -1}em`,
      display: 'block',
      height: 0,
    },
  };
}

export default capsize;
