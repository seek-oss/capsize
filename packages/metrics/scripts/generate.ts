import fs from 'fs/promises';
import path from 'path';
import PQueue from 'p-queue';
import cliProgress from 'cli-progress';
import sortKeys from 'sort-keys';

import systemFonts from './systemFonts.json';
import googleFonts from './googleFonts.json';
import { fontFamilyToCamelCase } from './../src';
import { metricsDir } from './paths';
import { type MetricsFont, type MetricsForFamilyByVariant } from './extract';

const writeFile = async (fileName: string, content: string) => {
  const targetOutput = path.isAbsolute(fileName)
    ? fileName
    : path.join(__dirname, fileName);
  await fs.mkdir(path.dirname(targetOutput), { recursive: true });

  return await fs.writeFile(targetOutput, content, 'utf-8');
};

const writeMetricsFile = async (
  folderName: string,
  variant: string,
  content: string,
) => await writeFile(path.join(metricsDir, folderName, variant), content);

const allMetrics: Record<
  string,
  MetricsFont & { variants?: MetricsForFamilyByVariant['variants'] }
> = {};

let entireMetricsDeclaration = ``;
const entireCollectionEntries: { name: string; type: string }[] = [];

const buildMetricsTypeInterface = (
  metrics: MetricsFont,
  indent: number = 2,
) => {
  const {
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
    xWidthAvg,
    subsets,
  } = metrics;
  const indentStr = new Array(indent).fill(' ').join('');

  return [
    `${indentStr}familyName: string;`,
    'fullName: string;',
    'postscriptName: string;',
    'category: string;',
    typeof capHeight === 'number' && capHeight > 0 ? 'capHeight: number;' : '',
    typeof ascent === 'number' && ascent > 0 ? 'ascent: number;' : '',
    typeof descent === 'number' && descent < 0 ? 'descent: number;' : '',
    typeof lineGap === 'number' ? 'lineGap: number;' : '',
    typeof unitsPerEm === 'number' && unitsPerEm > 0
      ? 'unitsPerEm: number;'
      : '',
    typeof xHeight === 'number' && xHeight > 0 ? 'xHeight: number;' : '',
    typeof xWidthAvg === 'number' && xWidthAvg > 0 ? 'xWidthAvg: number;' : '',
    'subsets: Record<',
    `  '${Object.keys(subsets).join("' | '")}',`,
    `  {`,
    `    xWidthAvg: number;`,
    `  }`,
    `>;`,
  ]
    .filter(Boolean)
    .join(`\n${indentStr}`);
};

const getTypeName = (familyName: string) => {
  const camelCaseFamilyName = fontFamilyToCamelCase(familyName);
  const formattedName = `${camelCaseFamilyName
    .charAt(0)
    .toUpperCase()}${camelCaseFamilyName.slice(1)}Metrics`;

  // Ensure type does not start with a number
  return /^[0-9]/.test(formattedName) ? `_${formattedName}` : formattedName;
};

interface Options {
  metrics: MetricsFont;
  variant: string;
  isDefaultImport: boolean;
}
const buildFiles = async ({ metrics, variant, isDefaultImport }: Options) => {
  const {
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
  } = metrics;
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

  const typeName = getTypeName(familyName);

  allMetrics[camelCaseFamilyName] = sortKeys(
    {
      ...allMetrics[camelCaseFamilyName],
      ...(isDefaultImport ? data : {}),
      variants: sortKeys(
        {
          ...allMetrics[camelCaseFamilyName]?.variants,
          [variant]: data,
        },
        { compare: () => (isDefaultImport ? -1 : 0) },
      ),
    },
    // Ensure that the `variants` key is always last
    { compare: (_, b) => (b === 'variants' ? -1 : 0) },
  );

  const jsOutput = `${JSON.stringify(data, null, 2)
    .replace(/"(.+)":/g, '$1:')
    .replace(/"/g, `'`)};`;
  const cjsOutput = `module.exports = ${jsOutput}\n`;
  const mjsOutput = `export default ${jsOutput}\n`;

  const typesOutput = (modulePath: string) =>
    [
      `declare module '@capsizecss/metrics/${modulePath}' {`,
      `  interface ${typeName} {`,
      buildMetricsTypeInterface(data, 4),
      `  }`,
      `  export const fontMetrics: ${typeName};`,
      `  export default fontMetrics;`,
      `}\n`,
    ].join('\n');

  const variantPath = `${camelCaseFamilyName}/${variant}`;
  await writeMetricsFile(variantPath, `index.cjs`, cjsOutput);
  await writeMetricsFile(variantPath, `index.mjs`, mjsOutput);
  await writeMetricsFile(variantPath, `index.d.ts`, typesOutput(variantPath));

  if (isDefaultImport) {
    await writeMetricsFile(camelCaseFamilyName, 'index.cjs', cjsOutput);
    await writeMetricsFile(camelCaseFamilyName, 'index.mjs', mjsOutput);
    await writeMetricsFile(
      camelCaseFamilyName,
      'index.d.ts',
      typesOutput(camelCaseFamilyName),
    );
  }
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

  const allFonts = [
    ...systemFonts.filter(
      // Filter out system metrics that are duplicated in Google Fonts
      ({ familyName }) => familyName !== 'Roboto' && familyName !== 'Oxygen',
    ),
    ...googleFonts,
  ] as MetricsForFamilyByVariant[];

  progress.start(allFonts.length, 0);

  const queue = new PQueue({ concurrency: 10 });
  queue.on('next', () => {
    progress.increment();
  });

  await queue.addAll(
    allFonts.map(({ familyName, variants, defaultVariant }) => {
      return async () => {
        const fontFileEntries = Object.entries(variants);
        const data = { ...variants[defaultVariant], familyName };
        const typeName = getTypeName(data.familyName);

        entireMetricsDeclaration += [
          `interface ${typeName} {`,
          buildMetricsTypeInterface(data),
          `  variants: {`,
          ...Object.keys(variants).map((v, i) =>
            [
              `    '${v}': {`,
              buildMetricsTypeInterface(variants[v], 6),
              `    }${i !== Object.keys(variants).length - 1 ? ',' : ''}`,
            ].join('\n'),
          ),
          '  };',
          '};\n\n',
        ].join('\n');

        // Ensure key is quoted if starts with a number
        const formattedName = fontFamilyToCamelCase(data.familyName);
        entireCollectionEntries.push({
          name: /^[0-9]/.test(formattedName)
            ? `"${formattedName}"`
            : formattedName,
          type: typeName,
        });

        await Promise.all(
          fontFileEntries.map(async ([variant, metrics]) => {
            await buildFiles({
              metrics: { ...metrics, familyName },
              variant,
              isDefaultImport: variant === defaultVariant,
            });
          }),
        );
      };
    }),
  );

  entireMetricsDeclaration += [
    `export type EntireMetricsCollection = {`,
    ...entireCollectionEntries.map(({ name, type }) => `  ${name}: ${type};`),
    `};`,
  ].join('\n');

  await writeFile('../src/types.ts', entireMetricsDeclaration);

  await writeFile(
    '../src/entireMetricsCollection.json',
    `${JSON.stringify(sortKeys(allMetrics), null, 2)}\n`,
  );

  progress.stop();

  console.log('✅ Complete');
})();
