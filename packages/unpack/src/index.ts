import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font as FontKitFont } from 'fontkit';

// Ref: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
const weightings = {
  a: 0.0668,
  b: 0.0122,
  c: 0.0228,
  d: 0.0348,
  e: 0.1039,
  f: 0.0182,
  g: 0.0165,
  h: 0.0499,
  i: 0.057,
  j: 0.0013,
  k: 0.0063,
  l: 0.0329,
  m: 0.0197,
  n: 0.0552,
  o: 0.0614,
  p: 0.0158,
  q: 0.0008,
  r: 0.049,
  s: 0.0518,
  t: 0.0741,
  u: 0.0226,
  v: 0.008,
  w: 0.0193,
  x: 0.0012,
  y: 0.0162,
  z: 0.0006,
  ' ': 0.1818,
};
const sampleString = Object.keys(weightings).join('');
const weightingForCharacter = (character: string) => {
  if (!Object.keys(weightings).includes(character)) {
    throw new Error(`No weighting specified for character: "${character}"`);
  }
  return weightings[character as keyof typeof weightings];
};

const unpackMetricsFromFont = (font: FontKitFont) => {
  const {
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    familyName,
    xHeight,
  } = font;

  const glyphs = font.glyphsForString(sampleString);
  const weightedWidth = glyphs.reduce((sum, glyph, index) => {
    const character = sampleString.charAt(index);

    // TODO: Should we fall back to `xAvgCharWidth` or throw error?
    let charWidth = font['OS/2'].xAvgCharWidth;
    try {
      charWidth = glyph.advanceWidth;
    } catch (e) {
      console.warn(
        `Couldn’t read 'advancedWidth' for character "${
          character === ' ' ? '<space>' : character
        }" from "${familyName}"`,
      );
    }

    return sum + charWidth * weightingForCharacter(character);
  }, 0);

  return {
    familyName,
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
    xWidthAvg: Math.round(weightedWidth),
  };
};

export type Font = ReturnType<typeof unpackMetricsFromFont>;

export const fromFile = (path: string): Promise<Font> =>
  fontkit.open(path).then(unpackMetricsFromFont);

export const fromBlob = async (blob: Blob): Promise<Font> =>
  new Promise((resolve, reject) => {
    blobToBuffer(blob, (err: Error, buffer: Buffer) => {
      if (err) {
        return reject(err);
      }

      try {
        resolve(unpackMetricsFromFont(fontkit.create(buffer)));
      } catch (e) {
        reject(e);
      }
    });
  });

export const fromUrl = async (url: string): Promise<Font> => {
  const response = await fetch(url);

  if (typeof window === 'undefined') {
    const data = await response.arrayBuffer();

    return unpackMetricsFromFont(fontkit.create(Buffer.from(data)));
  }

  const blob = await response.blob();

  return fromBlob(blob);
};
