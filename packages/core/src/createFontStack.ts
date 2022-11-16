import { Font } from '@capsizecss/unpack';
import { AtRule } from 'csstype';
import { round } from './round';

const toPercent = (num: number) => `${num}%`;
const formatValue = (value: number) => toPercent(round(value * 100));
export const toCssProperty = (property: string) =>
  property.replace(/([A-Z])/g, (property) => `-${property.toLowerCase()}`);

interface OverrideValuesParams {
  metrics: Font;
  fallbackMetrics: Font;
}
const calculateOverrideValues = ({
  metrics,
  fallbackMetrics,
}: OverrideValuesParams): AtRule.FontFace => {
  // Calculate size adjust
  let sizeAdjust = 1;
  if ('xWidthAvg' in metrics && 'xWidthAvg' in fallbackMetrics) {
    const preferredFontXAvgRatio =
      // @ts-expect-error `xWidthAvg` not yet available in metrics package
      metrics.xWidthAvg / metrics.unitsPerEm;
    const fallbackFontXAvgRatio =
      // @ts-expect-error `xWidthAvg` not yet available in metrics package
      fallbackMetrics.xWidthAvg / fallbackMetrics.unitsPerEm;

    if (preferredFontXAvgRatio && fallbackFontXAvgRatio) {
      sizeAdjust = preferredFontXAvgRatio / fallbackFontXAvgRatio;
    }
  }
  const adjustedEmSquare = metrics.unitsPerEm * sizeAdjust;

  // Calculate metric overrides for preferred font
  const ascentOverride = metrics.ascent / adjustedEmSquare;
  const descentOverride = Math.abs(metrics.descent) / adjustedEmSquare;
  const lineGapOverride = metrics.lineGap / adjustedEmSquare;

  // Conditionally populate font face properties and format to percent
  const fontFace: AtRule.FontFace = {};
  if (ascentOverride) {
    fontFace['ascentOverride'] = formatValue(ascentOverride);
  }
  if (descentOverride) {
    fontFace['descentOverride'] = formatValue(descentOverride);
  }
  if (lineGapOverride) {
    fontFace['lineGapOverride'] = formatValue(lineGapOverride);
  }
  if (sizeAdjust !== 1) {
    fontFace['sizeAdjust'] = formatValue(sizeAdjust);
  }

  return fontFace;
};

type FontFace = {
  '@font-face': Omit<AtRule.FontFace, 'src' | 'fontFamily'> &
    Required<Pick<AtRule.FontFace, 'src' | 'fontFamily'>>;
};
const toCssString = (fontFaces: FontFace[]) => {
  return fontFaces
    .map(({ '@font-face': { fontFamily, src, ...restFontFaceProperties } }) => {
      const fontFace = [
        '@font-face {',
        `  font-family: ${fontFamily};`,
        `  src: ${src};`,
      ];

      Object.keys(restFontFaceProperties).forEach((property) => {
        fontFace.push(
          `  ${toCssProperty(property)}: ${
            restFontFaceProperties[
              property as keyof typeof restFontFaceProperties
            ]
          };`,
        );
      });

      fontFace.push('}');

      return fontFace.join('\n');
    })
    .join('\n');
};

export const quoteIfNeeded = (name: string) =>
  !/^[a-zA-Z][^"'][a-zA-Z\d-]+[a-zA-Z\d]$/.test(name) ? `'${name}'` : name;

type CreateFontStackOptions = {
  fontFaceProperties?: Omit<
    AtRule.FontFace,
    | 'src'
    | 'fontFamily'
    | 'ascentOverride'
    | 'descentOverride'
    | 'lineGapOverride'
    | 'sizeAdjust'
  >;
};
type FontFaceOptionString = {
  fontFaceFormat?: 'styleString';
};
type FontFaceOptionObject = {
  fontFaceFormat?: 'styleObject';
};

export function createFontStack(
  font: Font[],
  options?: CreateFontStackOptions & FontFaceOptionString,
): { fontFamily: string; fontFaces: string };
export function createFontStack(
  font: Font[],
  options?: CreateFontStackOptions & FontFaceOptionObject,
): { fontFamily: string; fontFaces: FontFace[] };
export function createFontStack(
  [metrics, ...fallbacks]: Font[],
  optionsArg: CreateFontStackOptions = {},
) {
  const { fontFaceFormat, fontFaceProperties } = {
    fontFaceFormat: 'styleString',
    ...optionsArg,
  };
  const { familyName } = metrics;

  const fontFamilys: string[] = [quoteIfNeeded(familyName)];
  const fontFaces: FontFace[] = [];

  fallbacks.forEach((fallbackMetrics) => {
    const fontFamily = `'${familyName} Fallback${
      fallbacks.length > 1 ? `: ${fallbackMetrics.familyName}` : ''
    }'`;

    fontFamilys.push(fontFamily);
    fontFaces.push({
      '@font-face': {
        ...fontFaceProperties,
        fontFamily,
        src: `local('${fallbackMetrics.familyName}')`,
        ...calculateOverrideValues({
          metrics,
          fallbackMetrics,
        }),
      },
    });
  });

  return {
    fontFamily: fontFamilys.join(', '),
    fontFaces: {
      styleString: toCssString(fontFaces),
      styleObject: fontFaces,
    }[fontFaceFormat],
  };
}
