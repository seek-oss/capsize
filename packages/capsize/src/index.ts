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
  capHeight: number;
  fontMetrics: FontMetrics;
}

export default function createCss({
  leading,
  capHeight,
  fontMetrics,
}: CapsizeOptions) {
  const preventCollapse = 1;
  const capHeightRatio = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  const capSize = capHeight / capHeightRatio;

  const absoluteDescent = Math.abs(fontMetrics.descent);

  const descentRatio = absoluteDescent / fontMetrics.unitsPerEm;
  const ascentRatio = fontMetrics.ascent / fontMetrics.unitsPerEm;

  const contentArea = fontMetrics.ascent + absoluteDescent;
  const lineHeight = contentArea + fontMetrics.lineGap;
  const lineHeightScale = lineHeight / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * capSize;

  const hasSpecifiedLeading = typeof leading !== 'undefined';
  const offset =
    hasSpecifiedLeading && typeof leading === 'number'
      ? lineHeightNormal - leading
      : lineHeightNormal;

  // Basekick
  const descenderTransformOffsetForLeading = hasSpecifiedLeading
    ? offset / 2 / capSize
    : 0;
  const descenderTransform = descentRatio - descenderTransformOffsetForLeading;

  // Top Crop
  const distanceTopOffsetForLeading = hasSpecifiedLeading
    ? offset / capSize
    : 0;
  const distanceTop =
    ascentRatio -
    capHeightRatio +
    descentRatio -
    distanceTopOffsetForLeading +
    preventCollapse / capSize;

  return {
    fontSize: `${capSize}px`,
    ...(leading && { lineHeight: `${leading}px` }),
    transform: `translateY(${descenderTransform}em)`,
    paddingTop: `${preventCollapse}px`,
    ':before': {
      content: "''",
      marginTop: `${-distanceTop}em`,
      display: 'block',
      height: 0,
    },
  };
}
