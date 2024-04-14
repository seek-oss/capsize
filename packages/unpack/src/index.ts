import 'cross-fetch/polyfill';

import blobToBuffer from 'blob-to-buffer';
import * as fontkit from 'fontkit';
import type { Font as FontKitFont } from 'fontkit';

import weightings from './weightings';

export type SupportedSubsets = keyof typeof weightings;
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

const unpackMetricsFromFont = (font: FontKitFont) => {
  const {
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    familyName,
    fullName,
    postscriptName,
    xHeight,
  } = font;

  type SubsetLookup = Record<SupportedSubsets, { xWidthAvg: number }>;
  const subsets: SubsetLookup = supportedSubsets.reduce(
    (acc, subset) => ({
      ...acc,
      [subset]: {
        xWidthAvg: avgWidthForSubset(font, subset),
      },
    }),
    {} as SubsetLookup,
  );

  return {
    familyName,
    fullName,
    postscriptName,
    capHeight,
    ascent,
    descent,
    lineGap,
    unitsPerEm,
    xHeight,
    xWidthAvg: subsets.latin.xWidthAvg,
    subsets,
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
