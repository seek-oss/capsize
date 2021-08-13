export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}

type NotCSSValues = {
  lineHeight?: never;
  capHeightTrim?: never;
  baselineTrim?: never;
};

type CapHeightWithLeading = {
  capHeight: number;
  leading?: number;
  fontMetrics: FontMetrics;
} & NotCSSValues;

type CapHeightWithLineGap = {
  capHeight: number;
  lineGap: number;
  fontMetrics: FontMetrics;
} & NotCSSValues;

type FontSizeWithLeading = {
  fontSize: number;
  leading?: number;
  fontMetrics: FontMetrics;
} & NotCSSValues;

type FontSizeWithLineGap = {
  fontSize: number;
  lineGap: number;
  fontMetrics: FontMetrics;
} & NotCSSValues;

export type CapsizeOptions =
  | CapHeightWithLineGap
  | CapHeightWithLeading
  | FontSizeWithLineGap
  | FontSizeWithLeading;

export type CapsizeCSSValues = {
  fontSize: string;
  lineHeight: string;
  capHeightTrim: string;
  baselineTrim: string;
};
