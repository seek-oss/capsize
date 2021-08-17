import type { CapsizeOptions, ComputedValues } from './types';
import { computeValues } from './computeValues';

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
      marginBottom: capHeightTrim,
      display: 'table',
    },
    '::after': {
      content: "''",
      marginTop: baselineTrim,
      display: 'table',
    },
  };
};

export function createStyleObject(args: CapsizeOptions | ComputedValues) {
  if ('capHeightTrim' in args) {
    return _createStyleObject(args as ComputedValues);
  }

  return _createStyleObject(computeValues(args));
}
