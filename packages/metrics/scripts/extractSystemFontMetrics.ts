import fs from 'fs/promises';
import path from 'path';
import { buildMetrics } from './buildMetrics';

(async () => {
  const fontDirectory = process.env.FONT_DIRECTORY;

  if (!fontDirectory) {
    throw new Error(
      'FONT_DIRECTORY not found. To run this script you must have a font directory locally containing all of the required system fonts.',
    );
  }

  const arial = await buildMetrics({
    fontSource: `${fontDirectory}/Arial.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const appleSystem = await buildMetrics({
    fontSource: `${fontDirectory}/SF-Pro.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      familyName: '-apple-system',
      descent: -420,
    },
  });
  const blinkMacSystemFont = await buildMetrics({
    fontSource: `${fontDirectory}/SF-Pro.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      familyName: 'BlinkMacSystemFont',
      descent: -420,
    },
  });
  const roboto = await buildMetrics({
    fontSource: `${fontDirectory}/Roboto.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const segoeui = await buildMetrics({
    fontSource: `${fontDirectory}/SegoeUI.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const oxygen = await buildMetrics({
    fontSource: `${fontDirectory}/Oxygen.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      capHeight: 1479,
      xHeight: 1097,
    },
  });
  const helvetica = await buildMetrics({
    fontSource: `${fontDirectory}/Helvetica.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const helveticaNeue = await buildMetrics({
    fontSource: `${fontDirectory}/HelveticaNeue.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const timesNewRoman = await buildMetrics({
    fontSource: `${fontDirectory}/Times New Roman.ttf`,
    sourceType: 'file',
    category: 'serif',
  });
  const tahoma = await buildMetrics({
    fontSource: `${fontDirectory}/Tahoma.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const lucidaGrande = await buildMetrics({
    fontSource: `${fontDirectory}/LucidaGrande.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const verdana = await buildMetrics({
    fontSource: `${fontDirectory}/Verdana.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const trebuchetMS = await buildMetrics({
    fontSource: `${fontDirectory}/Trebuchet MS.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      capHeight: 1465,
      xHeight: 1071,
    },
  });
  const georgia = await buildMetrics({
    fontSource: `${fontDirectory}/Georgia.ttf`,
    sourceType: 'file',
    category: 'serif',
  });
  const courierNew = await buildMetrics({
    fontSource: `${fontDirectory}/Courier New.ttf`,
    sourceType: 'file',
    category: 'monospace',
  });
  const brushScript = await buildMetrics({
    fontSource: `${fontDirectory}/Brush Script.ttf`,
    sourceType: 'file',
    category: 'handwriting',
    overrides: {
      capHeight: 1230,
      xHeight: 709,
    },
  });

  const content = [
    arial,
    appleSystem,
    blinkMacSystemFont,
    roboto,
    segoeui,
    oxygen,
    helvetica,
    helveticaNeue,
    timesNewRoman,
    tahoma,
    lucidaGrande,
    verdana,
    trebuchetMS,
    georgia,
    courierNew,
    brushScript,
  ].sort((a, b) => {
    const fontA = a.familyName.toUpperCase();
    const fontB = b.familyName.toUpperCase();

    return fontA < fontB ? -1 : fontA > fontB ? 1 : 0;
  });

  await fs.writeFile(
    path.join(__dirname, 'systemFonts.json'),
    `${JSON.stringify(content, null, 2)}\n`,
    'utf-8',
  );
})();
