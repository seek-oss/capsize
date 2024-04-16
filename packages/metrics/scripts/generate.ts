import fs from 'fs/promises';
import path from 'path';
import dedent from 'dedent';
import PQueue from 'p-queue';
import cliProgress from 'cli-progress';
import sortKeys from 'sort-keys';

import systemFonts from './systemFonts.json';
import googleFonts from './googleFonts.json';
import { fontFamilyToCamelCase } from './../src';
import { metricsDir } from './paths';
import { type MetricsFont } from './extract';

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
  fullName,
  postscriptName,
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
  const camelCaseFamilyName = fontFamilyToCamelCase(familyName);
  const data = {
    familyName,
    fullName,
    postscriptName,
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

  const typeName = `${camelCaseFamilyName
    .charAt(0)
    .toUpperCase()}${camelCaseFamilyName.slice(1)}Metrics`;

  allMetrics[camelCaseFamilyName] = data;

  const jsOutput = `${JSON.stringify(data, null, 2)
    .replace(/"(.+)":/g, '$1:')
    .replace(/"/g, `'`)};`;

  const cjsOutput = `module.exports = ${jsOutput}\n`;
  const mjsOutput = `export default ${jsOutput}\n`;

  const typesOutput = dedent`
    declare module '@capsizecss/metrics/${camelCaseFamilyName}' {
      interface ${typeName} {
        familyName: string;
        fullName: string;
        postscriptName: string;
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
        subsets: {
          ${Object.keys(subsets).map(
            (s) => `${s}: {
            xWidthAvg: number;
          }`,
          ).join(`,
          `)}
        }
      }
      export const fontMetrics: ${typeName};
      export default fontMetrics;
    }\n
  `;

  await writeMetricsFile(`${camelCaseFamilyName}.cjs`, cjsOutput);
  await writeMetricsFile(`${camelCaseFamilyName}.mjs`, mjsOutput);
  await writeMetricsFile(`${camelCaseFamilyName}.d.ts`, typesOutput);
};

(async () => {
  const progress = new cliProgress.SingleBar(
    {
      format: '🤓 Generating font metrics {bar} {value}/{total}',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  ).on('SIGINT', () => {
    progress.stop();
    process.exitCode = 1;
  });

  const allFonts = [...systemFonts, ...googleFonts] as MetricsFont[];

  progress.start(allFonts.length, 0);

  const queue = new PQueue({ concurrency: 10 });
  queue.on('next', () => {
    progress.increment();
  });

  await queue.addAll(
    allFonts.map((metrics) => async () => await buildFiles(metrics)),
  );

  await writeFile(
    '../src/entireMetricsCollection.json',
    `${JSON.stringify(sortKeys(allMetrics), null, 2)}\n`,
  );

  progress.stop();

  console.log('✅ Complete');
})();
