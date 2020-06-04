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
  leading: number;
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

  const descentRatio = fontMetrics.descent / fontMetrics.unitsPerEm;
  const ascentRatio = fontMetrics.ascent / fontMetrics.unitsPerEm;

  const contentArea = fontMetrics.ascent + fontMetrics.descent;
  const lineHeight = contentArea + fontMetrics.lineGap;
  const lineHeightScale = lineHeight / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * capSize;

  const offset = lineHeightNormal - leading;

  const distanceTop = ascentRatio - capHeightRatio + descentRatio;

  return {
    fontSize: capSize,
    lineHeight: `${leading}px`,
    transform: `translateY(calc(${descentRatio}em - ${offset / 2}px))`,
    paddingTop: preventCollapse,
    ':before': {
      content: "''",
      marginTop: `calc(${
        distanceTop * -1
      }em - ${preventCollapse}px + ${offset}px)`,
      display: 'block',
      height: 0,
    },
  };
}
