import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font } from 'fontkit';

export interface FontMetrics {
  familyName: string;
  subfamilyName: string;
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
  xHeight: number;
}

const unpackMetricsFromFont = (font: Font): FontMetrics => {
  const {
    familyName,
    subfamilyName,
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
  } = font;

  return {
    familyName,
    subfamilyName,
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
  };
};

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

interface GoogleFont {
  family: string;
  variants?: string[];
}

export const fontToGoogleFontsUrl = ({ family, variants = [] }: GoogleFont) => {
  const variant =
    variants.length === 0 || variants.indexOf('regular') > -1
      ? ''
      : `:wght@${variants[0]}`;

  return `https://fonts.googleapis.com/css2?family=${family
    .split(' ')
    .join('+')}${variant}`;
};

export const fromGoogleFonts = async (
  font: GoogleFont,
): Promise<FontMetrics> => {
  const fontUrl = await fetch(fontToGoogleFontsUrl(font), {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
    },
  })
    .then((response) => response.text())
    .then(
      (responseText) => (responseText.match(/(?<=url\()([^\)]*)/) || [])[0],
    );

  return fromUrl(fontUrl);
};
