import type { FontSourceList } from '../extract';

const fontDirectory = process.env.FONT_DIRECTORY;

if (!fontDirectory) {
  throw new Error(
    'FONT_DIRECTORY not found. To run this script you must have a font directory locally containing all of the required system fonts.',
  );
}

const sfNSBase: Omit<FontSourceList[number], 'family'> = {
  category: 'sans-serif',
  files: {
    regular: `${fontDirectory}/SFNS.ttf`,
    italic: `${fontDirectory}/SFNS Italic.ttf`,
  },
} as const;

const systemFonts: FontSourceList = [
  {
    ...sfNSBase,
    family: '-apple-system',
  },
  {
    ...sfNSBase,
    family: 'BlinkMacSystemFont',
  },
  {
    family: 'Arial',
    files: {
      regular: `${fontDirectory}/Arial.ttf`,
      italic: `${fontDirectory}/Arial Italic.ttf`,
      '700': `${fontDirectory}/Arial Bold.ttf`,
      '700italic': `${fontDirectory}/Arial Bold Italic.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Brush Script',
    files: {
      regular: `${fontDirectory}/Brush Script.ttf`,
    },
    category: 'handwriting',
    overrides: {
      capHeight: 1230,
      xHeight: 709,
    },
  },
  {
    family: 'Courier New',
    files: {
      regular: `${fontDirectory}/Courier New.ttf`,
      italic: `${fontDirectory}/Courier New Italic.ttf`,
      '700': `${fontDirectory}/Courier New Bold.ttf`,
      '700italic': `${fontDirectory}/Courier New Bold Italic.ttf`,
    },
    category: 'monospace',
  },
  {
    family: 'Georgia',
    files: {
      regular: `${fontDirectory}/Georgia.ttf`,
      italic: `${fontDirectory}/Georgia Italic.ttf`,
      '700': `${fontDirectory}/Georgia Bold.ttf`,
      '700italic': `${fontDirectory}/Georgia Bold Italic.ttf`,
    },
    category: 'serif',
  },
  {
    family: 'Helvetica',
    files: {
      regular: `${fontDirectory}/Helvetica.ttf`,
      italic: `${fontDirectory}/Helvetica Italic.ttf`,
      '300': `${fontDirectory}/Helvetica Light.ttf`,
      '300italic': `${fontDirectory}/Helvetica Light Italic.ttf`,
      '700': `${fontDirectory}/Helvetica Bold.ttf`,
      '700italic': `${fontDirectory}/Helvetica Bold Italic.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Helvetica Neue',
    files: {
      regular: `${fontDirectory}/Helvetica Neue.ttf`,
      italic: `${fontDirectory}/Helvetica Neue Italic.ttf`,
      '100': `${fontDirectory}/Helvetica Neue Thin.ttf`,
      '100italic': `${fontDirectory}/Helvetica Neue Thin Italic.ttf`,
      '200': `${fontDirectory}/Helvetica Neue Ultra Light.ttf`,
      '200italic': `${fontDirectory}/Helvetica Neue Ultra Light Italic.ttf`,
      '300': `${fontDirectory}/Helvetica Neue Light.ttf`,
      '300italic': `${fontDirectory}/Helvetica Neue Light Italic.ttf`,
      '500': `${fontDirectory}/Helvetica Neue Medium.ttf`,
      '500italic': `${fontDirectory}/Helvetica Neue Medium Italic.ttf`,
      '700': `${fontDirectory}/Helvetica Neue Bold.ttf`,
      '700italic': `${fontDirectory}/Helvetica Neue Bold Italic.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Segoe UI',
    files: {
      regular: `${fontDirectory}/Segoe UI.ttf`,
      italic: `${fontDirectory}/Segoe UI Italic.ttf`,
      '300': `${fontDirectory}/Segoe UI Light.ttf`,
      '300italic': `${fontDirectory}/Segoe UI Light Italic.ttf`,
      '350': `${fontDirectory}/Segoe UI Semi Light.ttf`,
      '350italic': `${fontDirectory}/Segoe UI Semi Light Italic.ttf`,
      '600': `${fontDirectory}/Segoe UI Semi Bold.ttf`,
      '600italic': `${fontDirectory}/Segoe UI Semi Bold Italic.ttf`,
      '700': `${fontDirectory}/Segoe UI Bold.ttf`,
      '700italic': `${fontDirectory}/Segoe UI Bold Italic.ttf`,
      '900': `${fontDirectory}/Segoe UI Black.ttf`,
      '900italic': `${fontDirectory}/Segoe UI Black Italic.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Lucida Grande',
    files: {
      regular: `${fontDirectory}/Lucida Grande.ttf`,
      '700': `${fontDirectory}/Lucida Grande Bold.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Oxygen',
    files: {
      regular: `${fontDirectory}/Oxygen.ttf`,
      '300': `${fontDirectory}/Oxygen Light.ttf`,
      '700': `${fontDirectory}/Oxygen Bold.ttf`,
    },
    category: 'sans-serif',
    overrides: {
      capHeight: 1479,
      xHeight: 1097,
    },
  },
  {
    family: 'Roboto',
    files: {
      regular: `${fontDirectory}/Roboto.ttf`,
      italic: `${fontDirectory}/Roboto Italic.ttf`,
      '100': `${fontDirectory}/Roboto Thin.ttf`,
      '100italic': `${fontDirectory}/Roboto Thin Italic.ttf`,
      '300': `${fontDirectory}/Roboto Light.ttf`,
      '300italic': `${fontDirectory}/Roboto Light Italic.ttf`,
      '500': `${fontDirectory}/Roboto Medium.ttf`,
      '500italic': `${fontDirectory}/Roboto Medium Italic.ttf`,
      '700': `${fontDirectory}/Roboto Bold.ttf`,
      '700italic': `${fontDirectory}/Roboto Bold Italic.ttf`,
      '900': `${fontDirectory}/Roboto Black.ttf`,
      '900italic': `${fontDirectory}/Roboto Black Italic.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Tahoma',
    files: {
      regular: `${fontDirectory}/Tahoma.ttf`,
      '700': `${fontDirectory}/Tahoma Bold.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Times New Roman',
    files: {
      regular: `${fontDirectory}/Times New Roman.ttf`,
      italic: `${fontDirectory}/Times New Roman Italic.ttf`,
      '700': `${fontDirectory}/Times New Roman Bold.ttf`,
      '700italic': `${fontDirectory}/Times New Roman Bold Italic.ttf`,
    },
    category: 'serif',
  },
  {
    family: 'Trebuchet MS',
    files: {
      regular: `${fontDirectory}/Trebuchet MS.ttf`,
      italic: `${fontDirectory}/Trebuchet MS Italic.ttf`,
      '700': `${fontDirectory}/Trebuchet MS Bold.ttf`,
      '700italic': `${fontDirectory}/Trebuchet MS Bold Italic.ttf`,
    },
    category: 'sans-serif',
    overrides: {
      capHeight: 1465,
      xHeight: 1071,
    },
  },
  {
    family: 'Verdana',
    files: {
      regular: `${fontDirectory}/Verdana.ttf`,
      italic: `${fontDirectory}/Verdana Italic.ttf`,
      '700': `${fontDirectory}/Verdana Bold.ttf`,
      '700italic': `${fontDirectory}/Verdana Bold Italic.ttf`,
    },
    category: 'sans-serif',
  },
];

export default systemFonts;
