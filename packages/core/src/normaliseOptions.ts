import { CapsizeOptions } from './types';

export function normaliseOptions(options: CapsizeOptions) {
  if ('leading' in options && 'lineGap' in options) {
    throw new Error(
      'Only a single line height style can be provided. Please pass either `lineGap` OR `leading`.',
    );
  }

  if ('capHeight' in options && 'fontSize' in options) {
    throw new Error('Please pass either `capHeight` OR `fontSize`, not both.');
  }

  const { fontMetrics } = options;
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;

  let specifiedFontSize: number;
  let specifiedCapHeight: number;

  if ('capHeight' in options) {
    specifiedFontSize = options.capHeight / capHeightScale;
    specifiedCapHeight = options.capHeight;
  } else if ('fontSize' in options) {
    specifiedFontSize = options.fontSize;
    specifiedCapHeight = options.fontSize * capHeightScale;
  } else {
    throw new Error('Please pass either `capHeight` OR `fontSize`.');
  }

  let specifiedLineHeight: number | undefined;

  if ('lineGap' in options) {
    specifiedLineHeight = specifiedCapHeight + options.lineGap;
  } else if ('leading' in options) {
    specifiedLineHeight = options.leading;
  }

  return {
    fontSize: specifiedFontSize,
    lineHeight: specifiedLineHeight,
    fontMetrics,
  };
}
