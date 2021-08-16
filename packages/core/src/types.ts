export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}

export type CapsizeCSSValues = {
  fontSize: string;
  lineHeight: string;
  capHeightTrim: string;
  baselineTrim: string;
};

type NotCapsizeCSSValues = {
  [V in keyof CapsizeCSSValues]?: never;
};

type CapHeightWithLeading = {
  capHeight: number;
  leading?: number;
  fontMetrics: FontMetrics;
} & NotCapsizeCSSValues;

type CapHeightWithLineGap = {
  capHeight: number;
  lineGap: number;
  fontMetrics: FontMetrics;
} & NotCapsizeCSSValues;

type FontSizeWithLeading = {
  fontSize: number;
  leading?: number;
  fontMetrics: FontMetrics;
} & Omit<NotCapsizeCSSValues, 'fontSize'>;

type FontSizeWithLineGap = {
  fontSize: number;
  lineGap: number;
  fontMetrics: FontMetrics;
} & Omit<NotCapsizeCSSValues, 'fontSize'>;

export type CapsizeOptions =
  | CapHeightWithLineGap
  | CapHeightWithLeading
  | FontSizeWithLineGap
  | FontSizeWithLeading;
