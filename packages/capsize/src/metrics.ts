import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font } from 'fontkit';

import { FontMetrics } from './types';

const unpackMetricsFromFont = ({
  capHeight,
  ascent,
  descent,
  lineGap,
  unitsPerEm,
}: Font) => ({
  capHeight,
  ascent,
  descent,
  lineGap,
  unitsPerEm,
});

export const fromFilePath = (path: string): Promise<FontMetrics> =>
  new Promise((resolve, reject) =>
    fontkit.open(path, '', (err, font) => {
      if (err) {
        reject(err);
      }
      resolve(unpackMetricsFromFont(font));
    }),
  );

export const fromBlob = async (blob: Blob): Promise<FontMetrics> =>
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

export const fromUrl = async (url: string): Promise<FontMetrics> => {
  const response = await fetch(url);

  if (typeof window === 'undefined') {
    const data = await response.arrayBuffer();

    return unpackMetricsFromFont(fontkit.create(Buffer.from(data)));
  }

  const blob = await response.blob();

  return fromBlob(blob);
};

export const fromGoogleFonts = async (name: string): Promise<FontMetrics> => {
  const fontUrl = await fetch(
    `https://fonts.googleapis.com/css?family=${name.split(' ').join('+')}`,
    {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36',
      },
    },
  )
    .then((response) => response.text())
    .then(
      (responseText) => (responseText.match(/(?<=url\()([^\)]*)/) || [])[0],
    );

  return fromUrl(fontUrl);
};

export { FontMetrics };
