export interface FontMetrics {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
}

export type ComputedValues = {
  fontSize: string;
  lineHeight: string;
  capHeightTrim: string;
  baselineTrim: string;
};

type NotComputedValues = {
  [V in keyof ComputedValues]?: never;
};

type CapHeightWithLeading = {
  capHeight: number;
  leading?: number;
  fontMetrics: FontMetrics;
} & NotComputedValues;

type CapHeightWithLineGap = {
  capHeight: number;
  lineGap: number;
  fontMetrics: FontMetrics;
} & NotComputedValues;

type FontSizeWithLeading = {
  fontSize: number;
  leading?: number;
  fontMetrics: FontMetrics;
} & Omit<NotComputedValues, 'fontSize'>;

type FontSizeWithLineGap = {
  fontSize: number;
  lineGap: number;
  fontMetrics: FontMetrics;
} & Omit<NotComputedValues, 'fontSize'>;

export type CapsizeOptions =
  | CapHeightWithLineGap
  | CapHeightWithLeading
  | FontSizeWithLineGap
  | FontSizeWithLeading;
