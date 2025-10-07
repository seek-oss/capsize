import type { CapsizeOptions, ComputedValues } from './types';
import { precomputeValues } from './precomputeValues';

const _createStyleObject = ({
  lineHeight,
  fontSize,
  capHeightTrim,
  baselineTrim,
}: ComputedValues) => {
  return {
    fontSize,
    lineHeight,
    '::before': {
      content: "''",
      marginBlockEnd: capHeightTrim,
      display: 'table',
    },
    '::after': {
      content: "''",
      marginBlockStart: baselineTrim,
      display: 'table',
    },
  };
};

export function createStyleObject(args: CapsizeOptions | ComputedValues) {
  if ('capHeightTrim' in args) {
    return _createStyleObject(args as ComputedValues);
  }

  return _createStyleObject(precomputeValues(args));
}
