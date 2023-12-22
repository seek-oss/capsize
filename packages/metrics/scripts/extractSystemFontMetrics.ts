import sortKeys from 'sort-keys';
import fs from 'fs/promises';
import path from 'path';
import { buildBySubset } from './buildBySubset';

(async () => {
  const fontDirectory = process.env.FONT_DIRECTORY;

  if (!fontDirectory) {
    throw new Error(
      'FONT_DIRECTORY not found. To run this script you must have a font directory locally containing all of the required system fonts.',
    );
  }

  const arial = await buildBySubset({
    fontSource: `${fontDirectory}/Arial.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const appleSystem = await buildBySubset({
    fontSource: `${fontDirectory}/SF-Pro.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      familyName: '-apple-system',
      descent: -420,
    },
  });
  const blinkMacSystemFont = await buildBySubset({
    fontSource: `${fontDirectory}/SF-Pro.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      familyName: 'BlinkMacSystemFont',
      descent: -420,
    },
  });
  const roboto = await buildBySubset({
    fontSource: `${fontDirectory}/Roboto.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const segoeui = await buildBySubset({
    fontSource: `${fontDirectory}/SegoeUI.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const oxygen = await buildBySubset({
    fontSource: `${fontDirectory}/Oxygen.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      capHeight: 1479,
      xHeight: 1097,
    },
  });
  const helvetica = await buildBySubset({
    fontSource: `${fontDirectory}/Helvetica.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const helveticaNeue = await buildBySubset({
    fontSource: `${fontDirectory}/HelveticaNeue.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const timesNewRoman = await buildBySubset({
    fontSource: `${fontDirectory}/Times New Roman.ttf`,
    sourceType: 'file',
    category: 'serif',
  });
  const tahoma = await buildBySubset({
    fontSource: `${fontDirectory}/Tahoma.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const lucidaGrande = await buildBySubset({
    fontSource: `${fontDirectory}/LucidaGrande.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const verdana = await buildBySubset({
    fontSource: `${fontDirectory}/Verdana.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const trebuchetMS = await buildBySubset({
    fontSource: `${fontDirectory}/Trebuchet MS.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      capHeight: 1465,
      xHeight: 1071,
    },
  });
  const georgia = await buildBySubset({
    fontSource: `${fontDirectory}/Georgia.ttf`,
    sourceType: 'file',
    category: 'serif',
  });
  const courierNew = await buildBySubset({
    fontSource: `${fontDirectory}/Courier New.ttf`,
    sourceType: 'file',
    category: 'monospace',
  });
  const brushScript = await buildBySubset({
    fontSource: `${fontDirectory}/Brush Script.ttf`,
    sourceType: 'file',
    category: 'handwriting',
    overrides: {
      capHeight: 1230,
      xHeight: 709,
    },
  });

  const content: Awaited<ReturnType<typeof buildBySubset>> = sortKeys({
    ...arial,
    ...appleSystem,
    ...blinkMacSystemFont,
    ...roboto,
    ...segoeui,
    ...oxygen,
    ...helvetica,
    ...helveticaNeue,
    ...timesNewRoman,
    ...tahoma,
    ...lucidaGrande,
    ...verdana,
    ...trebuchetMS,
    ...georgia,
    ...courierNew,
    ...brushScript,
  });

  await fs.writeFile(
    path.join(__dirname, 'systemFonts.json'),
    `${JSON.stringify(content, null, 2)}\n`,
    'utf-8',
  );
})();
