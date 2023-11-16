import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font as FontKitFont } from 'fontkit';

import weightings from './weightings.json';

type SupportedLanguage = keyof typeof weightings;

const weightingForCharacter = (character: string, lang: SupportedLanguage) => {
  if (!Object.keys(weightings[lang]).includes(character)) {
    throw new Error(`No weighting specified for character: “${character}”`);
  }
  return weightings[lang][
    character as keyof typeof weightings[SupportedLanguage]
  ];
};

const avgWidthForLang = (font: FontKitFont, lang: SupportedLanguage) => {
  const sampleString = Object.keys(weightings[lang]).join('');
  const glyphs = font.glyphsForString(sampleString);
  const weightedWidth = glyphs.reduce((sum, glyph, index) => {
    const character = sampleString.charAt(index);

    let charWidth = font['OS/2'].xAvgCharWidth;
    try {
      charWidth = glyph.advanceWidth;
    } catch (e) {
      console.warn(
        `Couldn’t read 'advanceWidth' for character “${
          character === ' ' ? '<space>' : character
        }” from “${font.familyName}”. Falling back to “xAvgCharWidth”.`,
      );
    }

    return sum + charWidth * weightingForCharacter(character, lang);
  }, 0);

  return Math.round(weightedWidth);
};

const avgWidthByLang = (font: FontKitFont) => {
  const xWidthAvgByLang: Partial<Record<SupportedLanguage, number>> = {};

  (Object.keys(weightings) as SupportedLanguage[]).forEach((lang) => {
    xWidthAvgByLang[lang] = avgWidthForLang(
      font,
      lang as keyof typeof weightings,
    );
  });

  return xWidthAvgByLang as Record<SupportedLanguage, number>;
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

  return {
    familyName,
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
    xWidthAvg: avgWidthForLang(font, 'en'),
    xWidthAvgByLang: avgWidthByLang(font),
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
