import sortKeys from 'sort-keys';
import fs from 'fs/promises';
import path from 'path';
import { buildByLanguage } from './buildByLanguage';

(async () => {
  const fontDirectory = process.env.FONT_DIRECTORY;

  if (!fontDirectory) {
    throw new Error(
      'FONT_DIRECTORY not found. To run this script you must have a font directory locally containing all of the required system fonts.',
    );
  }

  const arial = await buildByLanguage({
    fontSource: `${fontDirectory}/Arial.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const appleSystem = await buildByLanguage({
    fontSource: `${fontDirectory}/SF-Pro.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      familyName: '-apple-system',
      descent: -420,
    },
  });
  const blinkMacSystemFont = await buildByLanguage({
    fontSource: `${fontDirectory}/SF-Pro.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      familyName: 'BlinkMacSystemFont',
      descent: -420,
    },
  });
  const roboto = await buildByLanguage({
    fontSource: `${fontDirectory}/Roboto.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const segoeui = await buildByLanguage({
    fontSource: `${fontDirectory}/SegoeUI.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const oxygen = await buildByLanguage({
    fontSource: `${fontDirectory}/Oxygen.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      capHeight: 1479,
      xHeight: 1097,
    },
  });
  const helvetica = await buildByLanguage({
    fontSource: `${fontDirectory}/Helvetica.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const helveticaNeue = await buildByLanguage({
    fontSource: `${fontDirectory}/HelveticaNeue.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const timesNewRoman = await buildByLanguage({
    fontSource: `${fontDirectory}/Times New Roman.ttf`,
    sourceType: 'file',
    category: 'serif',
  });
  const tahoma = await buildByLanguage({
    fontSource: `${fontDirectory}/Tahoma.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const lucidaGrande = await buildByLanguage({
    fontSource: `${fontDirectory}/LucidaGrande.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const verdana = await buildByLanguage({
    fontSource: `${fontDirectory}/Verdana.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
  });
  const trebuchetMS = await buildByLanguage({
    fontSource: `${fontDirectory}/Trebuchet MS.ttf`,
    sourceType: 'file',
    category: 'sans-serif',
    overrides: {
      capHeight: 1465,
      xHeight: 1071,
    },
  });
  const georgia = await buildByLanguage({
    fontSource: `${fontDirectory}/Georgia.ttf`,
    sourceType: 'file',
    category: 'serif',
  });
  const courierNew = await buildByLanguage({
    fontSource: `${fontDirectory}/Courier New.ttf`,
    sourceType: 'file',
    category: 'monospace',
  });
  const brushScript = await buildByLanguage({
    fontSource: `${fontDirectory}/Brush Script.ttf`,
    sourceType: 'file',
    category: 'handwriting',
    overrides: {
      capHeight: 1230,
      xHeight: 709,
    },
  });

  const content: Awaited<ReturnType<typeof buildByLanguage>> = sortKeys({
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
