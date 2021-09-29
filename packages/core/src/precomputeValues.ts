import { ComputedValues, CapsizeOptions } from './types';
import { precomputeNumericValues } from './precomputeNumericValues';
import { round } from './round';

export function precomputeValues(options: CapsizeOptions): ComputedValues {
  const { fontSize, lineHeight, capHeightTrimEm, baselineTrimEm } =
    precomputeNumericValues(options);

  return {
    fontSize: `${round(fontSize)}px`,
    lineHeight: lineHeight ? `${round(lineHeight)}px` : 'normal',
    capHeightTrim: `${round(capHeightTrimEm)}em`,
    baselineTrim: `${round(baselineTrimEm)}em`,
  };
}
