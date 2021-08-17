import { createThemeContract, style } from '@vanilla-extract/css';
import { createStyleObject } from '@capsizecss/core';
import { ComputedValues } from './types';

export const capsizeVars = createThemeContract({
  fontSize: null,
  lineHeight: null,
  capHeightTrim: null,
  baselineTrim: null,
});

export const baseStyle = style(
  createStyleObject({
    fontSize: capsizeVars.fontSize,
    lineHeight: capsizeVars.lineHeight,
    capHeightTrim: capsizeVars.capHeightTrim,
    baselineTrim: capsizeVars.baselineTrim,
  } as ComputedValues),
);
