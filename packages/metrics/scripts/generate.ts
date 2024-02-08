import fs from 'fs/promises';
import path from 'path';
import dedent from 'dedent';
import PQueue from 'p-queue';
import cliProgress from 'cli-progress';
import sortKeys from 'sort-keys';
import { Font, fromUrl } from '@capsizecss/unpack';

import googleFonts from './googleFontsApi.json';
import systemMetrics from './systemFonts.json';
import { fontFamilyToCamelCase } from './../src';
import { metricsDir } from './paths';

const writeFile = async (fileName: string, content: string) =>
  await fs.writeFile(
    path.isAbsolute(fileName) ? fileName : path.join(__dirname, fileName),
    content,
    'utf-8',
  );

const writeMetricsFile = async (fileName: string, content: string) =>
  await writeFile(path.join(metricsDir, fileName), content);

interface MetricsFont extends Font {
  category: string;
}

const allMetrics: Record<string, MetricsFont> = {};

const buildFiles = async ({
  familyName,
  category,
  capHeight,
  ascent,
  descent,
  lineGap,
  unitsPerEm,
  xHeight,
  xWidthAvg,
}: MetricsFont) => {
  const fileName = fontFamilyToCamelCase(familyName);
  const data = {
    familyName,
    category,
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
    xWidthAvg,
  };

  allMetrics[fileName] = data;

  await writeMetricsFile(
    `${fileName}.js`,
    `module.exports = ${JSON.stringify(data, null, 2)
      .replace(/"(.+)":/g, '$1:')
      .replace(/"/g, `'`)};\n`,
  );

  const typeName = `${fileName.charAt(0).toUpperCase()}${fileName.slice(
    1,
  )}Metrics`;

  await writeMetricsFile(
    `${fileName}.d.ts`,
    dedent`
      declare module '@capsizecss/metrics/${fileName}' {
        interface ${typeName} {
          familyName: string;
          category: string;${
            typeof capHeight === 'number' && capHeight > 0
              ? `
          capHeight: number;`
              : ''
          }${
      typeof ascent === 'number' && ascent > 0
        ? `
          ascent: number;`
        : ''
    }${
      typeof descent === 'number' && descent < 0
        ? `
          descent: number;`
        : ''
    }${
      typeof lineGap === 'number'
        ? `
          lineGap: number;`
        : ''
    }${
      typeof unitsPerEm === 'number' && unitsPerEm > 0
        ? `
          unitsPerEm: number;`
        : ''
    }${
      typeof xHeight === 'number' && xHeight > 0
        ? `
          xHeight: number;`
        : ''
    }${
      typeof xWidthAvg === 'number' && xWidthAvg > 0
        ? `
          xWidthAvg: number;`
        : ''
    }
        }
        export const fontMetrics: ${typeName};
        export default fontMetrics;
      }\n`,
  );
};

(async () => {
  const progress = new cliProgress.SingleBar(
    {
      format: '🤓 Reading font metrics {bar} {value}/{total}',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  ).on('SIGINT', () => {
    progress.stop();
    process.exitCode = 1;
  });

  progress.start(googleFonts.items.length + systemMetrics.length, 0);

  const queue = new PQueue({ concurrency: 10 });
  queue.on('next', () => {
    progress.increment();
  });

  const metricsForAnalysis: MetricsFont[] = [];

  await queue.addAll(systemMetrics.map((m) => async () => await buildFiles(m)));
  await queue.addAll(
    googleFonts.items.map((font: (typeof googleFonts.items)[number]) => {
      const fontUrl =
        'regular' in font.files && font.files.regular
          ? font.files.regular
          : font.files[font.variants[0] as keyof typeof font.files];

      return async () => {
        const m = await fromUrl(fontUrl as string);
        const categorisedMetrics = { ...m, category: font.category };
        metricsForAnalysis.push(categorisedMetrics);
        await buildFiles(categorisedMetrics);
      };
    }),
  );

  await writeFile(
    'googleFonts.json',
    `${JSON.stringify(
      metricsForAnalysis.sort((a, b) => {
        const fontA = a.familyName.toUpperCase();
        const fontB = b.familyName.toUpperCase();

        return fontA < fontB ? -1 : fontA > fontB ? 1 : 0;
      }),
      null,
      2,
    )}\n`,
  );

  await writeFile(
    '../src/entireMetricsCollection.json',
    `${JSON.stringify(sortKeys(allMetrics), null, 2)}\n`,
  );

  progress.stop();

  console.log('✅ Complete');
})();
