import { supportedSubsets, type SupportedSubsets } from '@capsizecss/unpack';
import fs from 'fs/promises';
import path from 'path';
import dedent from 'dedent';
import PQueue from 'p-queue';
import cliProgress from 'cli-progress';
import sortKeys from 'sort-keys';

import googleFonts from './googleFontsApi.json';
import systemMetrics from './systemFonts.json';
import { fontFamilyToCamelCase } from './../src';
import {
  buildMetrics,
  type MetricsFont,
  type MetricsByFamilyBySubset,
} from './buildMetrics';
import { metricsDir } from './paths';

const writeFile = async (fileName: string, content: string) =>
  await fs.writeFile(
    path.isAbsolute(fileName) ? fileName : path.join(__dirname, fileName),
    content,
    'utf-8',
  );

const writeMetricsFile = async (fileName: string, content: string) =>
  await writeFile(path.join(metricsDir, fileName), content);

type MetricsBySubset = MetricsByFamilyBySubset[string];

type AllMetrics = Record<SupportedSubsets, Record<string, MetricsFont>>;
const allMetrics: AllMetrics = supportedSubsets.reduce(
  (acc, subset: (typeof supportedSubsets)[number]) => {
    return {
      ...acc,
      [subset]: {},
    };
  },
  {} as AllMetrics,
);

const buildFiles = async (metricsBySubset: MetricsBySubset) => {
  const fileName = fontFamilyToCamelCase(metricsBySubset.latin.familyName);
  let cjsOutput = '';
  let mjsOutput = '';
  let typesOutput = '';

  (Object.keys(metricsBySubset) as (keyof typeof metricsBySubset)[]).forEach(
    async (subset, index) => {
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
      } = metricsBySubset[subset];

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

      allMetrics[subset][fileName] = data;

      const jsOutput = `${JSON.stringify(data, null, 2)
        .replace(/"(.+)":/g, '$1:')
        .replace(/"/g, `'`)};`;

      if (subset === 'latin') {
        cjsOutput = `module.exports = ${jsOutput}\n${cjsOutput}`;
        mjsOutput = `export default ${jsOutput}\n${mjsOutput}`;

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

      cjsOutput += `\nmodule.exports.${subset} = ${jsOutput}\n`;
      mjsOutput += `\nexport const ${subset} = ${jsOutput}\n`;

      typesOutput += `  export const ${subset}: ${typeName};${
        index === 0 && subset !== 'latin' ? '' : '\n'
      }`;
    },
  );

  await writeMetricsFile(`${fileName}.cjs`, cjsOutput);
  await writeMetricsFile(`${fileName}.mjs`, mjsOutput);
  await writeMetricsFile(`${fileName}.d.ts`, `${typesOutput}}\n`);
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
  const systemMetricFamilyNames = Object.keys(systemMetrics);

  progress.start(googleFonts.items.length + systemMetricFamilyNames.length, 0);

  const queue = new PQueue({ concurrency: 10 });
  queue.on('next', () => {
    progress.increment();
  });

  const metricsForAnalysis: MetricsByFamilyBySubset = {};

  await queue.addAll(
    systemMetricFamilyNames.map(
      (m) => async () =>
        await buildFiles((systemMetrics as MetricsByFamilyBySubset)[m]),
    ),
  );

  await queue.addAll(
    googleFonts.items.map((font: (typeof googleFonts.items)[number]) => {
      const fontUrl =
        'regular' in font.files && font.files.regular
          ? font.files.regular
          : font.files[font.variants[0] as keyof typeof font.files];

      return async () => {
        const metricsBySubset = await buildMetrics({
          fontSource: fontUrl as string,
          sourceType: 'url',
          category: font.category as MetricsFont['category'],
        });

        const fontFamilyName = Object.keys(metricsBySubset)[0];

        metricsForAnalysis[fontFamilyName] = metricsBySubset[fontFamilyName];

        await buildFiles(metricsBySubset[fontFamilyName]);
      };
    }),
  );

  await writeFile(
    'googleFonts.json',
    `${JSON.stringify(sortKeys(metricsForAnalysis), null, 2)}\n`,
  );

  Object.entries(allMetrics).forEach(async ([subset, metricsForSubset]) => {
    await writeFile(
      `../src/entireMetricsCollection-${subset}.json`,
      `${JSON.stringify(sortKeys(metricsForSubset), null, 2)}\n`,
    );
  });

  progress.stop();

  console.log('✅ Complete');
})();
