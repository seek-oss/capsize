import fs from 'fs';
import path from 'path';
import googleFontsMetrics from './googleFonts.json';

type FontMetrics = typeof googleFontsMetrics[number];
interface Report {
  name: string;
  run: (fontMetrics: FontMetrics) => boolean;
}

(async () => {
  const reports: Array<Report> = [
    {
      name: 'noCapHeight',
      run: (font) => !('capHeight' in font) || !font.capHeight,
    },
    {
      name: 'noXHeight',
      run: (font) => !('xHeight' in font) || !font.xHeight,
    },
    {
      name: 'capHeightLessThanXHeight',
      run: (font) => {
        if (
          'capHeight' in font &&
          font.capHeight &&
          'xHeight' in font &&
          font.xHeight
        ) {
          return font.capHeight < font.xHeight;
        }
        return false;
      },
    },
    {
      name: 'capHeightLessThanHalfAscent',
      run: (font) => {
        if (
          'capHeight' in font &&
          font.capHeight &&
          'ascent' in font &&
          font.ascent
        ) {
          return font.capHeight < font.ascent / 2;
        }
        return false;
      },
    },
  ];

  const results: Record<string, Array<FontMetrics>> = {};

  for (const font of googleFontsMetrics) {
    for (const report of reports) {
      if (report.run(font)) {
        if (report.name in results) {
          results[report.name].push(font);
        } else {
          results[report.name] = [font];
        }
      }
    }
  }

  interface ReportResult {
    count: number;
    data: Array<FontMetrics>;
  }
  const output: Record<string, ReportResult> = {};
  Object.keys(results).map((result) => {
    output[result] = {
      count: results[result].length,
      data: results[result],
    };
  });

  fs.writeFileSync(
    path.join(__dirname, 'output', `output-${new Date().getTime()}.json`),
    JSON.stringify(output, null, 2),
    'utf-8',
  );
})();
