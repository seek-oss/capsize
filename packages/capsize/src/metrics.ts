import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font } from 'fontkit';
import { FontMetrics } from '.';

export interface InternalFontMetrics extends FontMetrics {
  familyName: string;
  fullName: string;
  postscriptName: string;
  subfamilyName: string;
  xHeight: number;
}

const unpackMetricsFromFont = (font: Font): InternalFontMetrics => {
  const {
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    familyName,
    fullName,
    postscriptName,
    subfamilyName,
    xHeight,
  } = font;

  return {
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    familyName,
    fullName,
    postscriptName,
    subfamilyName,
    xHeight,
  };
};

export const fromFile = (path: string): Promise<InternalFontMetrics> =>
  new Promise((resolve, reject) =>
    fontkit.open(path, '', (err, font) => {
      if (err) {
        reject(err);
      }
      resolve(unpackMetricsFromFont(font));
    }),
  );

export const fromBlob = async (blob: Blob): Promise<InternalFontMetrics> =>
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

export const fromUrl = async (url: string): Promise<InternalFontMetrics> => {
  const response = await fetch(url);

  if (typeof window === 'undefined') {
    const data = await response.arrayBuffer();

    return unpackMetricsFromFont(fontkit.create(Buffer.from(data)));
  }

  const blob = await response.blob();

  return fromBlob(blob);
};

export const filterInternalMetrics = ({
  capHeight,
  ascent,
  descent,
  lineGap,
  unitsPerEm,
}: FontMetrics | InternalFontMetrics): FontMetrics => ({
  capHeight,
  ascent,
  descent,
  lineGap,
  unitsPerEm,
});
