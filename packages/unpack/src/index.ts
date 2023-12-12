import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import fontkit, { Font as FontKitFont } from 'fontkit';

import weightings from './weightings.json';

type SupportedLanguage = keyof typeof weightings;
export const supportedLanguages = Object.keys(
  weightings,
) as SupportedLanguage[];

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

    if (glyph.isMark) {
      return sum;
    }

    return sum + charWidth * weightingForCharacter(character, lang);
  }, 0);

  return Math.round(weightedWidth);
};

interface Options {
  language?: SupportedLanguage;
}

const unpackMetricsFromFont = (
  font: FontKitFont,
  options: Required<Options>,
) => {
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
    xWidthAvg: avgWidthForLang(font, options.language),
  };
};

export type Font = ReturnType<typeof unpackMetricsFromFont>;

const resolveOptions = (options?: Options) => {
  let language: SupportedLanguage = 'en';

  if (!options) {
    return { language };
  } else if (
    options.language &&
    supportedLanguages.includes(options.language)
  ) {
    language = options.language;
  } else {
    throw new Error(
      `Unsupported language “${
        options.language
      }”. Supported languages are: ${supportedLanguages.join(', ')}`,
    );
  }

  return {
    language,
  };
};

export const fromFile = (path: string, options?: Options): Promise<Font> => {
  const resolvedOptions = resolveOptions(options);
  return fontkit
    .open(path)
    .then((font: FontKitFont) => unpackMetricsFromFont(font, resolvedOptions));
};

export const fromBlob = async (
  blob: Blob,
  options?: Options,
): Promise<Font> => {
  const resolvedOptions = resolveOptions(options);
  return new Promise((resolve, reject) => {
    blobToBuffer(blob, (err: Error, buffer: Buffer) => {
      if (err) {
        return reject(err);
      }

      try {
        resolve(unpackMetricsFromFont(fontkit.create(buffer), resolvedOptions));
      } catch (e) {
        reject(e);
      }
    });
  });
};

export const fromUrl = async (
  url: string,
  options?: Options,
): Promise<Font> => {
  const response = await fetch(url);
  const resolvedOptions = resolveOptions(options);

  if (typeof window === 'undefined') {
    const data = await response.arrayBuffer();

    return unpackMetricsFromFont(
      fontkit.create(Buffer.from(data)),
      resolvedOptions,
    );
  }

  const blob = await response.blob();

  return fromBlob(blob, resolvedOptions);
};
