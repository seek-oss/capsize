import fs from 'fs';
import path from 'path';
import googleFontsMetrics from './googleFonts.json';

type FontName = keyof typeof googleFontsMetrics;
type FontMetrics = (typeof googleFontsMetrics)[FontName]['latin'];

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
      run: (font: FontMetrics) => {
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

  for (const font of Object.keys(googleFontsMetrics) as FontName[]) {
    for (const report of reports) {
      if (report.run(googleFontsMetrics[font]['latin'])) {
        if (report.name in results) {
          results[report.name].push(googleFontsMetrics[font]['latin']);
        } else {
          results[report.name] = [googleFontsMetrics[font]['latin']];
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
