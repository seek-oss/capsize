import { FontMetrics } from './types';
import { AtRule } from 'csstype';

const round = (n: number, p: number = 4) => {
  const d = Math.pow(10, p);
  return Math.round((n + Number.EPSILON) * d) / d;
};
const toPercent = (num: number) => `${num}%`;
const formatValue = (value: number) => toPercent(round(value * 100));

type SizeAdjustStrategy =
  | 'xAvgCharWidth'
  | 'xAvgLowercase'
  | 'xAvgWeightedOs2'
  | 'xAvgWeightedWiki'
  | 'xAvgLetterFrequency';
// TODO: Should core package take dependency on unpack?
interface UnpackedMetrics extends FontMetrics {
  familyName: string;
}

interface OverrideValuesParams {
  metrics: UnpackedMetrics;
  fallbackMetrics?: UnpackedMetrics;
  sizeAdjustStrategy?: SizeAdjustStrategy;
}
const calculateOverrideValues = ({
  metrics,
  fallbackMetrics,
  sizeAdjustStrategy,
}: OverrideValuesParams): AtRule.FontFace => {
  // Calculate size adjust
  let sizeAdjust = 1;
  if (sizeAdjustStrategy) {
    // @ts-expect-error TODO Don't ignore when final metric naming is released
    const preferredFontAvgWidth = metrics[sizeAdjustStrategy];
    // @ts-expect-error TODO Don't ignore when final metric naming is released
    const fallbackFontAvgWidth = fallbackMetrics[sizeAdjustStrategy];

    if (preferredFontAvgWidth && fallbackFontAvgWidth) {
      sizeAdjust = preferredFontAvgWidth / fallbackFontAvgWidth;
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

interface CreateFontStackOptions {
  sizeAdjust?: SizeAdjustStrategy;
}

export function createFontStack(
  [metrics, ...fallbacks]: UnpackedMetrics[],
  options: CreateFontStackOptions = {},
) {
  const { familyName } = metrics;

  const fontFamilys: string[] = [quoteIfNeeded(familyName)];
  const fontFaces: FontFace[] = [];

  if (options.sizeAdjust) {
    fallbacks.forEach((fallbackMetrics) => {
      const fontFamily = `'${familyName} Fallback: ${fallbackMetrics.familyName}'`;

      fontFamilys.push(fontFamily);
      fontFaces.push({
        '@font-face': {
          fontFamily,
          src: `local('${fallbackMetrics.familyName}')`,
          ...calculateOverrideValues({
            metrics,
            fallbackMetrics,
            sizeAdjustStrategy: options.sizeAdjust,
          }),
        },
      });
    });
  } else {
    const fontFamily = `'${familyName} Fallback'`;

    fontFamilys.push(fontFamily);
    fontFaces.push({
      '@font-face': {
        fontFamily,
        src: fallbacks
          .map(({ familyName: fallbackName }) => `local('${fallbackName}')`)
          .join(', '),
        ...calculateOverrideValues({ metrics }),
      },
    });
  }

  return {
    fontFamily: fontFamilys.join(', '),
    fontFaces,
    fontFacesAsCss: toCSSString(fontFaces),
  };
}
