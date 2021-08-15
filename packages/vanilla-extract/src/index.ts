import {
  style,
  assignVars,
  composeStyles,
  StyleRule,
} from '@vanilla-extract/css';
import {
  buildCSSValues,
  CapsizeOptions,
  CapsizeCSSValues,
} from '@capsizecss/core';

import { baseStyle, capsizeVars } from './capsize.css';

interface MediaQueries {
  '@media': Record<string, CapsizeOptions | CapsizeCSSValues>;
}

const createVanillaStyle = ({
  values,
  mediaQueries,
  debugId,
}: {
  values: CapsizeCSSValues;
  mediaQueries?: MediaQueries;
  debugId?: string;
}) => {
  const vars: StyleRule = {
    vars: assignVars(capsizeVars, values),
  };

  if (typeof mediaQueries !== 'undefined') {
    const mqs: StyleRule['@media'] = {};
    Object.entries(mediaQueries['@media']).forEach(([mq, val]) => {
      const builtValues =
        'capHeightTrim' in val
          ? (val as CapsizeCSSValues)
          : buildCSSValues(val);

      mqs[mq] = { vars: assignVars(capsizeVars, builtValues) };
    });
    vars['@media'] = mqs;
  }

  return composeStyles(baseStyle, style(vars, debugId));
};

function createTextStyle(
  args: CapsizeOptions | CapsizeCSSValues,
  debugId?: string,
): string;
function createTextStyle(
  args: CapsizeOptions | CapsizeCSSValues,
  mediaQueries?: MediaQueries,
  debugId?: string,
): string;
function createTextStyle(...args: any[]) {
  const hasMediaQueries =
    typeof args[1] !== 'undefined' && typeof args[1] !== 'string';
  const debugId = hasMediaQueries ? args[2] : args[1];
  const mediaQueries = hasMediaQueries ? args[1] : undefined;

  if ('capHeightTrim' in args[0]) {
    return createVanillaStyle({
      values: args[0],
      mediaQueries,
      debugId,
    });
  }

  return createVanillaStyle({
    values: buildCSSValues(args[0]),
    mediaQueries,
    debugId,
  });
}

export { createTextStyle, capsizeVars };
export const computeValues = buildCSSValues;
export const capsizeStyle = baseStyle;
