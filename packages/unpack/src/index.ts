import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font as FontKitFont } from 'fontkit';

// Ref: https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6OS2.html
// Table 2: Weight Factors
const weightings = {
  a: 64,
  b: 14,
  c: 27,
  d: 35,
  e: 100,
  f: 2,
  g: 14,
  h: 42,
  i: 63,
  j: 3,
  k: 6,
  l: 35,
  m: 2,
  n: 56,
  o: 56,
  p: 17,
  q: 4,
  r: 49,
  s: 56,
  t: 71,
  u: 31,
  v: 1,
  w: 18,
  x: 3,
  y: 18,
  z: 2,
  // ' ': 166,
};

// Ref: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
const wikipediaWeightings = {
  a: 8.167,
  b: 1.492,
  c: 2.782,
  d: 4.253,
  e: 12.702,
  f: 2.228,
  g: 2.015,
  h: 6.094,
  i: 6.966,
  j: 0.153,
  k: 0.772,
  l: 4.025,
  m: 2.406,
  n: 6.749,
  o: 7.507,
  p: 1.929,
  q: 0.095,
  r: 5.987,
  s: 6.327,
  t: 9.056,
  u: 2.758,
  v: 0.978,
  w: 2.36,
  x: 0.15,
  y: 1.974,
  z: 0.074,
};

const sampleString = Object.keys(weightings).join('');
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

  const sampleGlyphs = font.glyphsForString(sampleString);

  // xAvgLowercase
  const total = sampleGlyphs.reduce(
    (sum, glyph) => sum + glyph.advanceWidth,
    0,
  );
  const xAvgLowercase = Math.round(total / sampleGlyphs.length);

  // xAvgWeightedOs2
  const weightedOs2Total = sampleGlyphs.reduce((sum, glyph, index) => {
    return (
      sum +
      glyph.advanceWidth *
        weightings[sampleString.charAt(index) as keyof typeof weightings]
    );
  }, 0);
  const xAvgWeightedOs2 = Math.round(weightedOs2Total / 1000);

  // xAvgWeightedWiki
  const weightedWikiTotal = sampleGlyphs.reduce((sum, glyph, index) => {
    return (
      sum +
      glyph.advanceWidth *
        (wikipediaWeightings[
          sampleString.charAt(index) as keyof typeof weightings
        ] /
          100)
    );
  }, 0);
  const xAvgWeightedWiki = Math.round(weightedWikiTotal);

  // @ts-expect-error
  const xAvgCharWidth = font['OS/2'].xAvgCharWidth;

  return {
    familyName,
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
    xAvgCharWidth,
    xAvgLowercase,
    xAvgWeightedOs2,
    xAvgWeightedWiki,
  };
};

export type Font = ReturnType<typeof unpackMetricsFromFont>;

export const fromFile = (path: string): Promise<Font> =>
  new Promise((resolve, reject) =>
    fontkit.open(path, '', (err, font) => {
      if (err) {
        reject(err);
      }
      resolve(unpackMetricsFromFont(font));
    }),
  );

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
