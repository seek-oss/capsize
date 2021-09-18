import fs from 'fs/promises';
import path from 'path';
import { Font, fromUrl } from '@capsizecss/unpack';
import cliProgress from 'cli-progress';

import googleFonts from './googleFontsApi.json';
import systemMetrics from './systemFonts.json';

type GoogleFont = typeof googleFonts.items[number];
interface FontError {
  name: string;
  error: string;
}

(async () => {
  const folderPath = path.join(__dirname, '..');
  const progress = new cliProgress.SingleBar(
    {
      format: '🤓 Reading font metrics {bar} {value}/{total}',
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic,
  );
  const errors: FontError[] = [];
  process.on('SIGINT', () => {
    progress.stop();

    if (errors.length > 0) {
      console.error(JSON.stringify(errors, null, 2));
    }
    process.exit(1);
  });

  type Metrics = Pick<Font, keyof typeof systemMetrics[0]>;
  const metrics: Array<Metrics> = systemMetrics;
  const stepSize = 10;

  progress.start(googleFonts.items.length + systemMetrics.length, 0);
  progress.update(systemMetrics.length);
  const fetchBatch = async (step = 0) =>
    Promise.all(
      googleFonts.items
        .slice(step * stepSize, step * stepSize + stepSize)
        .map(async (font: GoogleFont) => {
          try {
            type FontVariant = keyof typeof font.files;
            const fontUrl =
              'regular' in font.files && font.files.regular
                ? font.files.regular
                : font.files[font.variants[0] as FontVariant];

            const m = await fromUrl(fontUrl as string);
            metrics.push(m);

            progress.increment();
            return m;
          } catch (e) {
            progress.increment();
            errors.push({ name: font.family, error: e });
          }
        }),
    );

  let batch = 0;
  while (batch < Math.ceil(googleFonts.items.length / stepSize)) {
    await fetchBatch(batch);
    batch++;
  }

  progress.stop();

  await Promise.all(
    metrics.map(
      async ({
        familyName,
        capHeight,
        ascent,
        descent,
        lineGap,
        unitsPerEm,
      }) => {
        const fileName = familyName
          .split(' ')
          .map(
            (s, i) =>
              `${s.charAt(0)[i > 0 ? 'toUpperCase' : 'toLowerCase']()}${s.slice(
                1,
              )}`,
          )
          .join('')
          .replace(/-(.)/g, (_, s) => s.toUpperCase());

        const fileContents = `module.exports = ${JSON.stringify(
          { familyName, capHeight, ascent, descent, lineGap, unitsPerEm },
          null,
          2,
        )
          .replace(/"(.+)":/g, '$1:')
          .replace(/"/g, `'`)};
        `;

        await fs.writeFile(
          path.join(folderPath, `${fileName}.js`),
          fileContents,
          'utf-8',
        );

        const typeDef = `declare module '@capsizecss/metrics/${fileName}' {
  interface FontMetrics {
    familyName: string;
    capHeight: number;
    ascent: number;
    descent: number;
    lineGap: number;
    unitsPerEm: number;
  }
  export const fontMetrics: FontMetrics;
  export default fontMetrics;
}
`;
        await fs.writeFile(
          path.join(folderPath, `${fileName}.d.ts`),
          typeDef,
          'utf-8',
        );
      },
    ),
  );

  console.log('✅ Complete');
})();
