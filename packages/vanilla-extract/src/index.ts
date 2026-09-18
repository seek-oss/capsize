import { style, assignVars, StyleRule } from '@vanilla-extract/css';
import { precomputeValues } from '@capsizecss/core';

import { ComputedValues, CreateStyleObjectParameters } from './types';
import { capsizeStyle, capsizeVars } from './capsize.css';

interface ConditionalQueries {
  '@media'?: Record<string, CreateStyleObjectParameters>;
  '@container'?: Record<string, CreateStyleObjectParameters>;
}

const generateQueryVars = ({
  queryType,
  queries,
}: {
  queryType: '@media' | '@container';
  queries: Record<string, any>;
}) => {
  const queryVars: StyleRule[typeof queryType] = {};

  Object.entries(queries).forEach(([query, value]) => {
    const builtValues =
      'capHeightTrim' in value
        ? (value as ComputedValues)
        : precomputeValues(value);

    queryVars[query] = { vars: assignVars(capsizeVars, builtValues) };
  });

  return queryVars;
};

const createVanillaStyle = ({
  values,
  conditionalQueries,
  debugId,
}: {
  values: ComputedValues;
  conditionalQueries?: ConditionalQueries;
  debugId?: string;
}) => {
  const vars: StyleRule = {
    vars: assignVars(capsizeVars, values),
  };

  if (typeof conditionalQueries !== 'undefined') {
    if (conditionalQueries['@media']) {
      vars['@media'] = generateQueryVars({
        queryType: '@media',
        queries: conditionalQueries['@media'],
      });
    }

    if (conditionalQueries['@container']) {
      vars['@container'] = generateQueryVars({
        queryType: '@container',
        queries: conditionalQueries['@container'],
      });
    }
  }

  return style([capsizeStyle, vars], debugId);
};

function createTextStyle(
  args: CreateStyleObjectParameters,
  debugId?: string,
): string;
function createTextStyle(
  args: CreateStyleObjectParameters,
  conditionalQueries?: ConditionalQueries,
  debugId?: string,
): string;
function createTextStyle(...args: any[]) {
  const hasConditionalQueries =
    typeof args[1] !== 'undefined' && typeof args[1] !== 'string';

  const debugId = hasConditionalQueries ? args[2] : args[1];
  const conditionalQueries = hasConditionalQueries ? args[1] : undefined;

  if ('capHeightTrim' in args[0]) {
    return createVanillaStyle({
      values: args[0],
      conditionalQueries,
      debugId,
    });
  }

  return createVanillaStyle({
    values: precomputeValues(args[0]),
    conditionalQueries,
    debugId,
  });
}

export { createTextStyle, precomputeValues };
