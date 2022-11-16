import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font as FontKitFont } from 'fontkit';

// Ref: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
const weightings = {
  a: 0.08167,
  b: 0.01492,
  c: 0.02782,
  d: 0.04253,
  e: 0.12702,
  f: 0.02228,
  g: 0.02015,
  h: 0.06094,
  i: 0.06966,
  j: 0.00153,
  k: 0.00772,
  l: 0.04025,
  m: 0.02406,
  n: 0.06749,
  o: 0.07507,
  p: 0.01929,
  q: 0.00095,
  r: 0.05987,
  s: 0.06327,
  t: 0.09056,
  u: 0.02758,
  v: 0.00978,
  w: 0.0236,
  x: 0.0015,
  y: 0.01974,
  z: 0.00074,
  // TODO: Add space weighting
  // ' ': 0
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
    // @ts-expect-error Can remove when PR to update types is published: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/63204
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
  // @ts-expect-error Can remove when PR to update types is published: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/63204
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
