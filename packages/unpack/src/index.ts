import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import * as fontkit from 'fontkit';
import type { Font as FontKitFont } from 'fontkit';

import weightings from './weightings.json';

type SupportedSubsets = keyof typeof weightings;
export const supportedSubsets = Object.keys(weightings) as SupportedSubsets[];

const weightingForCharacter = (character: string, subset: SupportedSubsets) => {
  if (!Object.keys(weightings[subset]).includes(character)) {
    throw new Error(`No weighting specified for character: “${character}”`);
  }
  return weightings[subset][
    character as keyof (typeof weightings)[SupportedSubsets]
  ];
};

const avgWidthForSubset = (font: FontKitFont, subset: SupportedSubsets) => {
  const sampleString = Object.keys(weightings[subset]).join('');
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

    return sum + charWidth * weightingForCharacter(character, subset);
  }, 0);

  return Math.round(weightedWidth);
};

interface Options {
  subset?: SupportedSubsets;
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
    xWidthAvg: avgWidthForSubset(font, options.subset),
  };
};

export type Font = ReturnType<typeof unpackMetricsFromFont>;

const resolveOptions = (options?: Options) => {
  let subset: SupportedSubsets = 'latin';

  if (!options) {
    return { subset };
  } else if (options.subset && supportedSubsets.includes(options.subset)) {
    subset = options.subset;
  } else {
    throw new Error(
      `Unsupported subset “${
        options.subset
      }”. Supported subsets are: ${supportedSubsets.join(', ')}`,
    );
  }

  return {
    subset,
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
