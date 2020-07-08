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
  capHeight?: number;
  fontSize?: number;
  fontMetrics: FontMetrics;
}

export default function createCss({
  leading,
  gap,
  fontSize,
  capHeight,
  fontMetrics,
}: CapsizeOptions) {
  if (typeof leading !== 'undefined' && typeof gap !== 'undefined') {
    throw new Error(
      'Only a single line height style can be provided. Please pass either `gap` OR `leading`.',
    );
  }

  if (typeof capHeight !== 'undefined' && typeof fontSize !== 'undefined') {
    throw new Error(
      'Only a single calculation basis can be provided. Please pass either `capHeight` OR `fontSize`.',
    );
  }

  const capHeightRatio = fontMetrics.capHeight / fontMetrics.unitsPerEm;

  if (typeof fontSize !== 'undefined') {
    capHeight = fontSize * capHeightRatio;
  }

  if (typeof capHeight !== 'undefined') {
    fontSize = capHeight / capHeightRatio;
  }

  const absoluteDescent = Math.abs(fontMetrics.descent);

  const descentRatio = absoluteDescent / fontMetrics.unitsPerEm;
  const ascentRatio = fontMetrics.ascent / fontMetrics.unitsPerEm;

  const contentArea = fontMetrics.ascent + absoluteDescent;
  const lineHeight = contentArea + fontMetrics.lineGap;
  const lineHeightScale = lineHeight / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * fontSize;

  const hasSpecifiedLineHeight =
    typeof leading !== 'undefined' || typeof gap !== 'undefined';

  const specifiedLineHeight =
    typeof gap !== 'undefined' ? capHeight + gap : leading;

  const offset =
    hasSpecifiedLineHeight && typeof specifiedLineHeight === 'number'
      ? lineHeightNormal - specifiedLineHeight
      : lineHeightNormal;

  // Basekick
  const descenderTransformOffsetForLeading = hasSpecifiedLineHeight
    ? offset / 2 / fontSize
    : 0;
  const descenderTransform = descentRatio - descenderTransformOffsetForLeading;

  // Top Crop
  const distanceTopOffsetForLeading = hasSpecifiedLineHeight
    ? offset / fontSize
    : 0;
  const distanceTop =
    ascentRatio - capHeightRatio + descentRatio - distanceTopOffsetForLeading;

  return {
    fontSize: `${fontSize}px`,
    ...(hasSpecifiedLineHeight && { lineHeight: `${specifiedLineHeight}px` }),
    transform: `translateY(${descenderTransform}em)`,
    paddingTop: '0.05px',
    marginTop: `${-distanceTop}em`,
  };
}
