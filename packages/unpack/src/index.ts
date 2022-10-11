import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font as FontKitFont } from 'fontkit';

const sampleString = 'abcdefghijklmnopqrstuvwxyz';
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

  // sampleGlyphs.forEach((glyph, index) => {
  //   console.log(sampleString.charAt(index), glyph.advanceWidth);
  // });

  const total = sampleGlyphs.reduce(
    (sum, glyph) => sum + glyph.advanceWidth,
    0,
  );

  const xAvgLowercase = Math.round(total / sampleGlyphs.length);

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
