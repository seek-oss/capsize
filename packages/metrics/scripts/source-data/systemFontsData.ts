import type { FontSourceList } from '../extract';

const fontDirectory = process.env.FONT_DIRECTORY;

if (!fontDirectory) {
  throw new Error(
    'FONT_DIRECTORY not found. To run this script you must have a font directory locally containing all of the required system fonts.',
  );
}

const sfProBase = {
  category: 'sans-serif',
  files: {
    regular: `${fontDirectory}/SF Pro.ttf`,
  },
  overrides: {
    descent: -420,
  },
} as const;

const systemFonts: FontSourceList = [
  {
    ...sfProBase,
    overrides: {
      ...sfProBase.overrides,
      familyName: '-apple-system',
    },
  },
  {
    ...sfProBase,
    overrides: {
      ...sfProBase.overrides,
      familyName: 'BlinkMacSystemFont',
    },
  },
  {
    files: {
      regular: `${fontDirectory}/Arial.ttf`,
    },
    category: 'sans-serif',
  },
  {
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
    files: {
      regular: `${fontDirectory}/Courier New.ttf`,
    },
    category: 'monospace',
  },
  {
    files: {
      regular: `${fontDirectory}/Georgia.ttf`,
    },
    category: 'serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Helvetica.ttf`,
    },
    category: 'sans-serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Helvetica Neue.ttf`,
    },
    category: 'sans-serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Segoe UI.ttf`,
    },
    category: 'sans-serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Lucida Grande.ttf`,
    },
    category: 'sans-serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Oxygen.ttf`,
    },
    category: 'sans-serif',
    overrides: {
      capHeight: 1479,
      xHeight: 1097,
    },
  },
  {
    files: {
      regular: `${fontDirectory}/Roboto.ttf`,
    },
    category: 'sans-serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Tahoma.ttf`,
    },
    category: 'sans-serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Times New Roman.ttf`,
    },
    category: 'serif',
  },
  {
    files: {
      regular: `${fontDirectory}/Trebuchet MS.ttf`,
    },
    category: 'sans-serif',
    overrides: {
      capHeight: 1465,
      xHeight: 1071,
    },
  },
  {
    files: {
      regular: `${fontDirectory}/Verdana.ttf`,
    },
    category: 'sans-serif',
  },
];

export default systemFonts;
