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

const handleCollectionErrors = ({
  font,
  postscriptName,
  apiName,
  apiParamName,
}: {
  font: FontKitFont | null;
  postscriptName?: string;
  apiName: string;
  apiParamName: string;
}) => {
  if (postscriptName && font === null) {
    throw new Error(
      [
        `The provided \`postscriptName\` of “${postscriptName}” cannot be found in the provided font collection.\n`,
        'Run the same command without specifying a `postscriptName` in the options to see the available names in the collection.',
        'For example:',
        '------------------------------------------',
        `const metrics = await ${apiName}('<${apiParamName}>');`,
        '------------------------------------------\n',
        '',
      ].join('\n'),
    );
  }

  if (font !== null && 'fonts' in font && Array.isArray(font.fonts)) {
    const availableNames = font.fonts.map((f) => f.postscriptName);
    throw new Error(
      [
        'Metrics cannot be unpacked from a font collection.\n',
        'Provide either a single font or specify a `postscriptName` to extract from the collection via the options.',
        'For example:',
        '------------------------------------------',
        `const metrics = await ${apiName}('<${apiParamName}>', {`,
        `  postscriptName: '${availableNames[0]}'`,
        '});',
        '------------------------------------------\n',
        'Available `postscriptNames` in this font collection are:',
        ...availableNames.map((fontName) => `  - ${fontName}`),
        '',
      ].join('\n'),
    );
  }
};

interface Options {
  postscriptName?: string;
}

export const fromFile = (path: string, options?: Options): Promise<Font> => {
  const { postscriptName } = options || {};

  return fontkit.open(path, postscriptName).then((font) => {
    handleCollectionErrors({
      font,
      postscriptName,
      apiName: 'fromFile',
      apiParamName: 'path',
    });

    return unpackMetricsFromFont(font);
  });
};

const _fromBuffer = async (
  buffer: Buffer,
  apiName: string,
  apiParamName: string,
  options?: Options,
) => {
  const { postscriptName } = options || {};

  const fontkitFont = fontkit.create(buffer, postscriptName);

  handleCollectionErrors({
    font: fontkitFont,
    postscriptName,
    apiName,
    apiParamName,
  });

  return unpackMetricsFromFont(fontkitFont);
};

export const fromBuffer = async (
  buffer: Buffer,
  options?: Options,
): Promise<Font> => {
  return _fromBuffer(buffer, 'fromBuffer', 'buffer', options);
};

export const fromBlob = async (
  blob: Blob,
  options?: Options,
): Promise<Font> => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return _fromBuffer(buffer, 'fromBlob', 'blob', options);
};

export const fromUrl = async (
  url: string,
  options?: Options,
): Promise<Font> => {
  const response = await fetch(url);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return _fromBuffer(buffer, 'fromUrl', 'url', options);
};
