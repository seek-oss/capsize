import fs from 'fs/promises';
import path from 'path';
import cliProgress from 'cli-progress';
import PQueue from 'p-queue';
import sortKeys from 'sort-keys';
import { Font, fromFile, fromUrl } from '@capsizecss/unpack';
import systemFonts from './source-data/systemFontsData';
import googleFonts from './source-data/googleFontsData.json';

type FontCategory =
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'display'
  | 'handwriting';
export interface MetricsFont extends Font {
  category: FontCategory;
}

type SourceType = 'file' | 'url';
const extractor: Record<SourceType, typeof fromFile | typeof fromUrl> = {
  file: fromFile,
  url: fromUrl,
};

export type FontSourceList = Array<{
  family: string;
  variants?: string[];
  files: Record<string, string>;
  category: FontCategory;
  overrides?: Partial<Omit<Font, 'familyName'>>;
}>;

interface Params {
  sourceType: SourceType;
  sourceLabel: string;
  fonts: FontSourceList;
}
export interface MetricsForFamilyByVariant {
  familyName: string;
  variants: Record<string, MetricsFont>;
  defaultVariant: string;
}
const metricsForFamilyByVariant = async ({
  sourceType,
  sourceLabel,
  fonts,
}: Params): Promise<MetricsForFamilyByVariant[]> => {
  const progress = new cliProgress.SingleBar(
    {
      format: `🤓 Extracting ${sourceLabel} font metrics {bar} {value}/{total}`,
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  ).on('SIGINT', () => {
    progress.stop();
    process.exitCode = 1;
  });

  progress.start(fonts.length, 0);

  const queue = new PQueue({ concurrency: 10 });
  queue.on('next', () => {
    progress.increment();
  });

  const result = await queue.addAll(
    fonts.map((font) => async () => {
      const fontFileEntries = Object.entries(font.files);
      let defaultVariant = 'regular';
      // If there is no `regular` variant in the `files` array
      // we need to infer which variant should be considered
      // the default. The Google Fonts API response provides
      // a `variants` array (where the first is the default),
      // otherwise fallback to the first entry in `files`.
      if (!Boolean(font.files.regular)) {
        if (font.variants) {
          defaultVariant = font.variants[0];
        } else if (fontFileEntries.length === 1) {
          defaultVariant = fontFileEntries[0][0];
        }
      }

      const metricsForVariants = await Promise.all(
        fontFileEntries.map(async ([variant, url]) => {
          const extractedMetrics = await extractor[sourceType](url);
          const metrics = {
            ...extractedMetrics,
            ...font.overrides,
            familyName: font.family,
            category: font.category,
          };

          return [variant, metrics];
        }),
      );

      return {
        familyName: font.family,
        defaultVariant,
        variants: sortKeys<MetricsForFamilyByVariant['variants']>(
          Object.fromEntries(metricsForVariants),
        ),
      };
    }),
  );

  progress.stop();

  return result.sort((a, b) => {
    const fontA = a.familyName.toUpperCase();
    const fontB = b.familyName.toUpperCase();

    return fontA < fontB ? -1 : fontA > fontB ? 1 : 0;
  });
};

(async () => {
  const systemFontMetrics = await metricsForFamilyByVariant({
    sourceType: 'file',
    sourceLabel: 'system',
    fonts: systemFonts as FontSourceList,
  });

  await fs.writeFile(
    path.join(__dirname, 'systemFonts.json'),
    `${JSON.stringify(systemFontMetrics, null, 2)}\n`,
    'utf-8',
  );

  const googleFontMetrics = await metricsForFamilyByVariant({
    sourceType: 'url',
    sourceLabel: 'Google',
    fonts: googleFonts.items as FontSourceList,
  });

  await fs.writeFile(
    path.join(__dirname, 'googleFonts.json'),
    `${JSON.stringify(googleFontMetrics, null, 2)}\n`,
    'utf-8',
  );

  console.log('✅ Complete');
})();
