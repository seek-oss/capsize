import { FontMetrics } from './types';
import { AtRule } from 'csstype';

const round = (n: number, p: number = 4) => {
  const d = Math.pow(10, p);
  return Math.round((n + Number.EPSILON) * d) / d;
};
const toPercent = (num: number) => `${num}%`;
const formatValue = (value: number) => toPercent(round(value * 100));

// TODO: Should core package take dependency on unpack?
interface UnpackedMetrics extends FontMetrics {
  familyName: string;
}

const calculateOverrideValues = (
  metrics: UnpackedMetrics,
  // TODO: fallbackMetrics: UnpackedMetrics,
): AtRule.FontFace => {
  // Calculate size adjust
  const sizeAdjust = 1; // TODO: metrics.xAvgCharWidth / fallbackMetrics.xAvgCharWidth;
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

type FontFace = { '@font-face': AtRule.FontFace };
const toCSSString = (fontFaces: FontFace[]) => {
  return fontFaces
    .map(
      ({
        '@font-face': {
          fontFamily,
          src,
          ascentOverride,
          descentOverride,
          lineGapOverride,
          sizeAdjust,
        },
      }) => {
        const fontFace = [
          '@font-face {',
          `  font-family: ${fontFamily};`,
          `  src: ${src};`,
        ];

        if (ascentOverride) {
          fontFace.push(`  ascent-override: ${ascentOverride};`);
        }

        if (descentOverride) {
          fontFace.push(`  descent-override: ${descentOverride};`);
        }

        if (lineGapOverride) {
          fontFace.push(`  line-gap-override: ${lineGapOverride};`);
        }

        if (sizeAdjust) {
          fontFace.push(`  size-adjust: ${sizeAdjust};`);
        }

        fontFace.push('}');

        return fontFace.join('\n');
      },
    )
    .join('\n');
};

const quoteIfNeeded = (name: string) =>
  !/^[a-zA-Z][^"'][a-zA-Z\d-]+[a-zA-Z\d]$/.test(name) ? `'${name}'` : name;
// TODO: test cases for later
//   ✅ Goudy Bookletter 1911
//   ✅ Red/Black
//   ✅ "Lucida" Grande
//   ✅ Ahem!
//   ✅ test@foo
//   ✅ #POUND
//   ✅ Hawaii 5-0
//   ❌ sans-serif
//   ❌ asdasdasd
//   ✅ "Lucide Grande"
//   ✅ "Lucide
//   ✅ 'Sasd asdasd'

export function createFontStack([
  fontMetrics,
  ...fallbacks
]: UnpackedMetrics[]) {
  const { familyName } = fontMetrics;

  const fontFamilys: string[] = [quoteIfNeeded(familyName)];
  const fontFaces: FontFace[] = [];

  fallbacks.forEach((fallbackMetrics) => {
    const fontFamily = `'${familyName} Fallback: ${fallbackMetrics.familyName}'`;

    fontFamilys.push(fontFamily);
    fontFaces.push({
      '@font-face': {
        fontFamily,
        src: `local('${fallbackMetrics.familyName}')`,
        ...calculateOverrideValues(
          fontMetrics /* TODO: pass fallbackMetrics as second arg */,
        ),
      },
    });
  });

  return {
    fontFamily: fontFamilys.join(', '),
    fontFaces,
    fontFacesAsCss: toCSSString(fontFaces),
  };
}
