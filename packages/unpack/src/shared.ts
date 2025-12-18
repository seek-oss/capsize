import {
  create,
  type Font as FontKitFont,
  type FontCollection,
} from 'fontkitten';

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

function handleCollectionErrors(
  font: FontKitFont | FontCollection | null,
  {
    postscriptName,
    apiName,
    apiParamName,
  }: { postscriptName?: string; apiName: string; apiParamName: string },
): asserts font is FontKitFont {
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

  if (font !== null && font.isCollection) {
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
}

export interface Options {
  postscriptName?: string;
}

export const _fromBuffer = async (
  buffer: Buffer<ArrayBufferLike> | Uint8Array<ArrayBufferLike>,
  apiName: string,
  apiParamName: string,
  options?: Options,
): Promise<Font> => {
  const { postscriptName } = options || {};

  const resolvedBuffer =
    buffer instanceof Buffer ? buffer : Buffer.from(buffer);

  const fontkitFont = create(resolvedBuffer, postscriptName);

  handleCollectionErrors(fontkitFont, {
    postscriptName,
    apiName,
    apiParamName,
  });

  return unpackMetricsFromFont(fontkitFont);
};

export const fromBuffer = async (buffer: Buffer, options?: Options) => {
  return _fromBuffer(buffer, 'fromBuffer', 'buffer', options);
};

export const fromBlob = async (blob: Blob, options?: Options) => {
  const arrayBuffer = await blob.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  return _fromBuffer(buffer, 'fromBlob', 'blob', options);
};

export const fromUrl = async (url: string, options?: Options) => {
  const response = await fetch(url);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  return _fromBuffer(buffer, 'fromUrl', 'url', options);
};
