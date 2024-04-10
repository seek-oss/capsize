import fs from 'fs/promises';
import path from 'path';
import cliProgress from 'cli-progress';
import PQueue from 'p-queue';
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
  variants?: string[];
  files: Record<string, string>;
  category: FontCategory;
  overrides?: Partial<Font>;
}>;

interface Params {
  sourceType: SourceType;
  sourceLabel: string;
  fonts: FontSourceList;
}
const metricsForFamily = async ({
  sourceType,
  sourceLabel,
  fonts,
}: Params): Promise<MetricsFont[]> => {
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
    fonts.map(({ files, variants = [], overrides, category }) => async () => {
      const variant = files.regular ? 'regular' : variants[0];
      const url = files[variant];
      const metrics = await extractor[sourceType](url);

      return {
        ...metrics,
        ...overrides,
        category,
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
  const systemFontMetrics = await metricsForFamily({
    sourceType: 'file',
    sourceLabel: 'system',
    fonts: systemFonts as FontSourceList,
  });

  await fs.writeFile(
    path.join(__dirname, 'systemFonts.json'),
    `${JSON.stringify(systemFontMetrics, null, 2)}\n`,
    'utf-8',
  );

  const googleFontMetrics = await metricsForFamily({
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
