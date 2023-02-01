import fs from 'fs/promises';
import path from 'path';
import { fromFile } from '@capsizecss/unpack';

(async () => {
  const fontDirectory = process.env.FONT_DIRECTORY;

  if (!fontDirectory) {
    throw new Error(
      'FONT_DIRECTORY not found. To run this script you must have a font directory locally containing all of the required system fonts.',
    );
  }

  const arial = await fromFile(`${fontDirectory}/Arial.ttf`);
  const sfPro = await fromFile(`${fontDirectory}/SF-Pro.ttf`);
  const roboto = await fromFile(`${fontDirectory}/Roboto.ttf`);
  const segoeui = await fromFile(`${fontDirectory}/SegoeUI.ttf`);
  const oxygen = await fromFile(`${fontDirectory}/Oxygen.ttf`);
  const helvetica = await fromFile(`${fontDirectory}/Helvetica.ttf`);
  const helveticaNeue = await fromFile(`${fontDirectory}/HelveticaNeue.ttf`);
  const timesNewRoman = await fromFile(`${fontDirectory}/Times New Roman.ttf`);
  const tahoma = await fromFile(`${fontDirectory}/Tahoma.ttf`);
  const lucidaGrande = await fromFile(`${fontDirectory}/LucidaGrande.ttf`);
  const verdana = await fromFile(`${fontDirectory}/Verdana.ttf`);
  const trebuchetMS = await fromFile(`${fontDirectory}/Trebuchet MS.ttf`);
  const georgia = await fromFile(`${fontDirectory}/Georgia.ttf`);
  const courierNew = await fromFile(`${fontDirectory}/Courier New.ttf`);
  const brushScript = await fromFile(`${fontDirectory}/Brush Script.ttf`);

  const content = JSON.stringify(
    [
      { ...arial, category: 'sans-serif' },
      {
        ...sfPro,
        familyName: '-apple-system',
        descent: -420,
        category: 'sans-serif',
      },
      {
        ...sfPro,
        familyName: 'BlinkMacSystemFont',
        descent: -420,
        category: 'sans-serif',
      },
      { ...roboto, category: 'sans-serif' },
      { ...segoeui, category: 'sans-serif' },
      { ...oxygen, capHeight: 1479, xHeight: 1097, category: 'sans-serif' },
      { ...helvetica, category: 'sans-serif' },
      { ...helveticaNeue, category: 'sans-serif' },
      { ...timesNewRoman, category: 'serif' },
      { ...tahoma, category: 'sans-serif' },
      { ...lucidaGrande, category: 'sans-serif' },
      { ...verdana, category: 'sans-serif' },
      {
        ...trebuchetMS,
        capHeight: 1465,
        xHeight: 1071,
        category: 'sans-serif',
      },
      { ...georgia, category: 'serif' },
      { ...courierNew, category: 'monospace' },
      {
        ...brushScript,
        capHeight: 1230,
        xHeight: 709,
        category: 'handwriting',
      },
    ].sort((a, b) => {
      const fontA = a.familyName.toUpperCase();
      const fontB = b.familyName.toUpperCase();

      return fontA < fontB ? -1 : fontA > fontB ? 1 : 0;
    }),
    null,
    2,
  );

  await fs.writeFile(
    path.join(__dirname, 'systemFonts.json'),
    `${content}\n`,
    'utf-8',
  );
})();
