import type { CapsizeOptions, CapsizeCSSValues } from './types';
import { buildCSSValues } from './buildCSSValues';

const _createStyleObject = ({
  lineHeight,
  fontSize,
  capHeightTrim,
  baselineTrim,
}: CapsizeCSSValues) => {
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

export function createStyleObject(args: CapsizeOptions | CapsizeCSSValues) {
  if ('capHeightTrim' in args) {
    return _createStyleObject(args as CapsizeCSSValues);
  }

  return _createStyleObject(buildCSSValues(args));
}
