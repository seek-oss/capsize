import fs from 'fs/promises';
import path from 'path';
import dedent from 'dedent';
import PQueue from 'p-queue';
import cliProgress from 'cli-progress';
import { Font, fromUrl } from '@capsizecss/unpack';

import googleFonts from './googleFontsApi.json';
import systemMetrics from './systemFonts.json';

const toCamelCase = (str: string) =>
  str
    .split(/[\s|-]/)
    .filter(Boolean)
    .map(
      (s, i) =>
        `${s.charAt(0)[i > 0 ? 'toUpperCase' : 'toLowerCase']()}${s.slice(1)}`,
    )
    .join('');

const writeFile = async (fileName: string, content: string) =>
  await fs.writeFile(path.join(__dirname, '..', fileName), content, 'utf-8');

const buildFiles = async ({
  familyName,
  capHeight,
  ascent,
  descent,
  lineGap,
  unitsPerEm,
  xHeight,
}: Pick<Font, keyof typeof systemMetrics[0]>) => {
  const fileName = toCamelCase(familyName);

  await writeFile(
    `${fileName}.js`,
    `module.exports = ${JSON.stringify(
      { familyName, capHeight, ascent, descent, lineGap, unitsPerEm, xHeight },
      null,
      2,
    )
      .replace(/"(.+)":/g, '$1:')
      .replace(/"/g, `'`)};\n`,
  );

  const typeName = `${fileName.charAt(0).toUpperCase()}${fileName.slice(
    1,
  )}Metrics`;

  await writeFile(
    `${fileName}.d.ts`,
    dedent`
      declare module '@capsizecss/metrics/${fileName}' {
        interface ${typeName} {
          familyName: string;${
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
  progress.update(systemMetrics.length);

  const queue = new PQueue({ concurrency: 10 });
  queue.on('next', () => {
    progress.increment();
  });

  await queue.addAll(systemMetrics.map((m) => async () => await buildFiles(m)));
  await queue.addAll(
    googleFonts.items.map((font: typeof googleFonts.items[number]) => {
      const fontUrl =
        'regular' in font.files && font.files.regular
          ? font.files.regular
          : font.files[font.variants[0] as keyof typeof font.files];

      return async () => {
        const m = await fromUrl(fontUrl as string);
        await buildFiles(m);
      };
    }),
  );

  progress.stop();

  console.log('✅ Complete');
})();
