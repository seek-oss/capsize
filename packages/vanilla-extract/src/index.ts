import {
  style,
  assignVars,
  composeStyles,
  StyleRule,
} from '@vanilla-extract/css';
import { precomputeValues } from '@capsizecss/core';

import { ComputedValues, CreateStyleObjectParameters } from './types';
import { capsizeStyle, capsizeVars } from './capsize.css';

interface MediaQueries {
  '@media': Record<string, CreateStyleObjectParameters>;
}

const createVanillaStyle = ({
  values,
  mediaQueries,
  debugId,
}: {
  values: ComputedValues;
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
          ? (val as ComputedValues)
          : precomputeValues(val);

      mqs[mq] = { vars: assignVars(capsizeVars, builtValues) };
    });
    vars['@media'] = mqs;
  }

  return composeStyles(capsizeStyle, style(vars, debugId));
};

function createTextStyle(
  args: CreateStyleObjectParameters,
  debugId?: string,
): string;
function createTextStyle(
  args: CreateStyleObjectParameters,
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
    values: precomputeValues(args[0]),
    mediaQueries,
    debugId,
  });
}

export { createTextStyle, precomputeValues };
