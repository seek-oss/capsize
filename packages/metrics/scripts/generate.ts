import fs from 'fs/promises';
import path from 'path';
import dedent from 'dedent';
import PQueue from 'p-queue';
import cliProgress from 'cli-progress';
import sortKeys from 'sort-keys';

import googleFonts from './googleFontsApi.json';
import systemMetrics from './systemFonts.json';
import { fontFamilyToCamelCase } from './../src';
import { metricsDir } from './paths';
import { buildMetrics, type MetricsFont } from './buildMetrics';

const writeFile = async (fileName: string, content: string) =>
  await fs.writeFile(
    path.isAbsolute(fileName) ? fileName : path.join(__dirname, fileName),
    content,
    'utf-8',
  );

const writeMetricsFile = async (fileName: string, content: string) =>
  await writeFile(path.join(metricsDir, fileName), content);

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
  subsets,
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
    subsets,
  };

  const typeName = `${fileName.charAt(0).toUpperCase()}${fileName.slice(
    1,
  )}Metrics`;

  allMetrics[fileName] = data;

  const jsOutput = `${JSON.stringify(data, null, 2)
    .replace(/"(.+)":/g, '$1:')
    .replace(/"/g, `'`)};`;

  const cjsOutput = `module.exports = ${jsOutput}\n`;
  const mjsOutput = `export default ${jsOutput}\n`;

  const typesOutput = dedent`
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
    `;

  await writeMetricsFile(`${fileName}.cjs`, cjsOutput);
  await writeMetricsFile(`${fileName}.mjs`, mjsOutput);
  await writeMetricsFile(`${fileName}.d.ts`, `${typesOutput}\n}\n`);
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

  await queue.addAll(
    systemMetrics.map((m) => async () => await buildFiles(m as MetricsFont)),
  );

  await queue.addAll(
    googleFonts.items.map((font: (typeof googleFonts.items)[number]) => {
      const fontUrl =
        'regular' in font.files && font.files.regular
          ? font.files.regular
          : font.files[font.variants[0] as keyof typeof font.files];

      return async () => {
        const m = await buildMetrics({
          fontSource: fontUrl as string,
          sourceType: 'url',
          category: font.category as MetricsFont['category'],
        });

        metricsForAnalysis.push(m);
        await buildFiles(m);
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
