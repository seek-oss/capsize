import { createThemeContract, style } from '@vanilla-extract/css';
import { CapsizeCSSValues, createStyleObject } from '@capsizecss/core';

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
  } as CapsizeCSSValues),
);
