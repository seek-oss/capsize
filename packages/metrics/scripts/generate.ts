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

const sharedTypes = `
interface Metrics<Subsets extends string> {
  familyName: string;
  fullName: string;
  postscriptName: string;
  category: string;
  capHeight: number;
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  xHeight: number;
  xWidthAvg: number;
  subsets: Record<
    Subsets,
    {
      xWidthAvg: number;
    }
  >;
}
`.trimStart();

let entireMetricsDeclaration = `${sharedTypes}\n`;
const entireCollectionEntries: { name: string; type: string }[] = [];

const buildMetricsTypeInterface = (metrics: MetricsFont) => {
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

  const missingProps = [
    typeof capHeight === 'number' && capHeight > 0 ? '' : 'capHeight',
    typeof ascent === 'number' && ascent > 0 ? '' : 'ascent',
    typeof descent === 'number' && descent < 0 ? '' : 'descent',
    typeof lineGap === 'number' ? '' : 'lineGap',
    typeof unitsPerEm === 'number' && unitsPerEm > 0 ? '' : 'unitsPerEm',
    typeof xHeight === 'number' && xHeight > 0 ? '' : 'xHeight',
    typeof xWidthAvg === 'number' && xWidthAvg > 0 ? '' : 'xWidthAvg',
  ].filter(Boolean);

  const type = `Metrics<'${Object.keys(subsets).join("' | '")}'>`;
  return missingProps.length
    ? `Omit<${type}, '${missingProps.join(`' | '`)}'>`
    : type;
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
      `import { Metrics } from '${Array.from(
        modulePath.split('/'),
        () => '../',
      ).join('')}types';`,
      ``,
      `declare module '@capsizecss/metrics/${modulePath}' {`,
      `  interface ${typeName} extends ${buildMetricsTypeInterface(data)} {}`,
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
          `interface ${typeName} extends ${buildMetricsTypeInterface(data)} {`,
          `  variants: {`,
          ...Object.keys(variants).map((v, i) =>
            [
              `    '${v}': ${buildMetricsTypeInterface(variants[v])}${
                i !== Object.keys(variants).length - 1 ? ',' : ''
              }`,
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

  await writeFile(
    '../entireMetricsCollection/types.d.ts',
    `export ${sharedTypes}`,
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
