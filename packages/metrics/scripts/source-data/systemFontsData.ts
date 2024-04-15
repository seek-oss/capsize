import type { FontSourceList } from '../extract';

const fontDirectory = process.env.FONT_DIRECTORY;

if (!fontDirectory) {
  throw new Error(
    'FONT_DIRECTORY not found. To run this script you must have a font directory locally containing all of the required system fonts.',
  );
}

const sfProBase: Omit<FontSourceList[number], 'family'> = {
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
    family: '-apple-system',
  },
  {
    ...sfProBase,
    family: 'BlinkMacSystemFont',
  },
  {
    family: 'Arial',
    files: {
      regular: `${fontDirectory}/Arial.ttf`,
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
    },
    category: 'monospace',
  },
  {
    family: 'Georgia',
    files: {
      regular: `${fontDirectory}/Georgia.ttf`,
    },
    category: 'serif',
  },
  {
    family: 'Helvetica',
    files: {
      regular: `${fontDirectory}/Helvetica.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Helvetica Neue',
    files: {
      regular: `${fontDirectory}/Helvetica Neue.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Segoe UI',
    files: {
      regular: `${fontDirectory}/Segoe UI.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Lucida Grande',
    files: {
      regular: `${fontDirectory}/Lucida Grande.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Oxygen',
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
    family: 'Roboto',
    files: {
      regular: `${fontDirectory}/Roboto.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Tahoma',
    files: {
      regular: `${fontDirectory}/Tahoma.ttf`,
    },
    category: 'sans-serif',
  },
  {
    family: 'Times New Roman',
    files: {
      regular: `${fontDirectory}/Times New Roman.ttf`,
    },
    category: 'serif',
  },
  {
    family: 'Trebuchet MS',
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
    family: 'Verdana',
    files: {
      regular: `${fontDirectory}/Verdana.ttf`,
    },
    category: 'sans-serif',
  },
];

export default systemFonts;
