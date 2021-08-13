import fs from 'fs';
import path from 'path';
import { Font, fromUrl } from '../src';
import cliProgress from 'cli-progress';

import googleFonts from './data/googleFonts.json';

type GoogleFont = typeof googleFonts.items[number];
interface FontError {
  name: string;
  error: string;
}

(async () => {
  const progress = new cliProgress.SingleBar(
    {
      format: 'Reading metrics {bar} {value}/{total}',
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
  const metrics: Font[] = [];
  const stepSize = 100;

  progress.start(googleFonts.items.length, 0);

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

  if (errors.length > 0) {
    console.error('Errors', errors);
    return;
  }

  const filePath = path.join(__dirname, 'data', 'googleFontsMetrics.json');
  fs.writeFileSync(filePath, JSON.stringify(metrics, null, 2), 'utf-8');
  console.log('Complete ✅');
  console.log(`👉 ${filePath}`);
})();
