/* eslint-disable no-console */
import { fromGoogleFonts, FontMetrics } from '../metrics';
import fs from 'fs';

import allFonts from './allFonts.json';
import allMetrics from './allMetrics.json';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

(async () => {
  interface FontError {
    name: string;
    error: string;
  }
  const errors: FontError[] = [];
  process.on('SIGINT', () => {
    console.error(JSON.stringify(errors, null, 2));
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });
  const metrics: FontMetrics[] = [];
  let counter = allFonts.items.length;

  const fn = async (step = 0) =>
    Promise.all(
      allFonts.items.slice(step * 100, step * 100 + 100).map(async (font) => {
        try {
          if (!font.files.regular) {
            const m = await fromGoogleFonts({
              family: `${font.family}:wght@${font.variants[0]}`,
            });
            metrics.push(m);
            counter = counter - 1;
            console.log(counter);
            return m;
          }
          const m = await fromGoogleFonts({ family: font.family });
          metrics.push(m);
          counter = counter - 1;
          console.log(counter);
          return m;
        } catch (e) {
          counter = counter - 1;
          console.log(counter);
          errors.push({ name: font.family, error: e });
        }
      }),
    );

  await fn();
  await fn(1);
  await fn(2);
  await fn(3);
  await fn(4);
  await fn(5);
  await fn(6);
  await fn(7);
  await fn(8);
  await fn(9);

  if (errors.length > 0) {
    console.log('Errors', errors);
    return;
  }
  // eslint-disable-next-line no-sync
  // fs.writeFileSync(
  //   'allMetrics.json',
  //   JSON.stringify(metrics, null, 2),
  //   'utf-8',
  // );
  // console.log('written');
})();

(async () => {
  const valid = allMetrics
    .filter((font) => 'capHeight' in font && 'xHeight' in font)
    .filter((font) => {
      const { capHeight, ascent } = font;
      if (capHeight && ascent) {
        return capHeight < ascent / 2;
      }
    });

  // eslint-disable-next-line no-sync
  fs.writeFileSync(
    `analysis-${new Date().getTime()}.json`,
    JSON.stringify(
      {
        capBelowHalfAscent: { count: valid.length, data: valid },
      },
      null,
      2,
    ),
    'utf-8',
  );
})();
