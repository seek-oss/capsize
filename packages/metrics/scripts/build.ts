import fs from 'fs/promises';
import path from 'path';
import dedent from 'dedent';
import PQueue from 'p-queue';
import cliProgress from 'cli-progress';
import sortKeys from 'sort-keys';

import googleFonts from './googleFontsApi.json';
import systemMetrics from './systemFonts.json';
import { fontFamilyToCamelCase } from './../src';
import { buildByLanguage } from './buildByLanguage';

const writeFile = async (fileName: string, content: string) =>
  await fs.writeFile(path.join(__dirname, fileName), content, 'utf-8');

type FontByLanguage = Awaited<ReturnType<typeof buildByLanguage>>;
type MetricsByLanguage = FontByLanguage[string];

const allMetrics: Record<string, MetricsByLanguage['en']> = {};

const buildFiles = async (metricsByLanguage: MetricsByLanguage) => {
  const fileName = fontFamilyToCamelCase(metricsByLanguage.en.familyName);
  let jsOutput = '';
  let typesOutput = '';

  Object.keys(metricsByLanguage).forEach(async (language, index) => {
    const {
      familyName,
      category,
      capHeight,
      ascent,
      descent,
      lineGap,
      unitsPerEm,
      xHeight,
      xWidthAvg,
    } = metricsByLanguage[language as keyof typeof metricsByLanguage];

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

    const typeName = `${fileName.charAt(0).toUpperCase()}${fileName.slice(
      1,
    )}Metrics`;

    if (language === 'en') {
      // ADD LANGUAGE SUPPORT TO `entireMetricsCollection`
      allMetrics[fileName] = data;

      jsOutput =
        `module.exports = ${JSON.stringify(data, null, 2)
          .replace(/"(.+)":/g, '$1:')
          .replace(/"/g, `'`)};\n` + jsOutput;

      typesOutput = dedent`
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
        ${typesOutput}\n
        `;
    }

    jsOutput += `\nexports.${language} = ${JSON.stringify(data, null, 2)
      .replace(/"(.+)":/g, '$1:')
      .replace(/"/g, `'`)};\n`;

    typesOutput += `  export const ${language} = fontMetrics;${
      index === 0 && language !== 'en' ? '' : '\n'
    }`;
  });

  await writeFile(path.join('..', `${fileName}.js`), jsOutput);
  await writeFile(path.join('..', `${fileName}.d.ts`), `${typesOutput}}\n`);
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

  progress.start(
    googleFonts.items.length + Object.keys(systemMetrics).length,
    0,
  );

  const queue = new PQueue({ concurrency: 10 });
  queue.on('next', () => {
    progress.increment();
  });

  const metricsForAnalysis: FontByLanguage = {};

  await queue.addAll(
    Object.keys(systemMetrics).map(
      (m) => async () => await buildFiles((systemMetrics as FontByLanguage)[m]),
    ),
  );

  await queue.addAll(
    googleFonts.items.map((font: typeof googleFonts.items[number]) => {
      const fontUrl =
        'regular' in font.files && font.files.regular
          ? font.files.regular
          : font.files[font.variants[0] as keyof typeof font.files];

      return async () => {
        const metricsByLanguage = await buildByLanguage({
          fontSource: fontUrl as string,
          sourceType: 'url',
          category: font.category as Parameters<
            typeof buildByLanguage
          >[0]['category'],
        });

        const fontFamilyName = Object.keys(metricsByLanguage)[0];

        metricsForAnalysis[fontFamilyName] = metricsByLanguage[fontFamilyName];

        await buildFiles(metricsByLanguage[fontFamilyName]);
      };
    }),
  );

  await writeFile(
    'googleFonts.json',
    `${JSON.stringify(sortKeys(metricsForAnalysis), null, 2)}\n`,
  );

  await writeFile(
    '../src/entireMetricsCollection.json',
    `${JSON.stringify(sortKeys(allMetrics), null, 2)}\n`,
  );

  progress.stop();

  console.log('✅ Complete');
})();
