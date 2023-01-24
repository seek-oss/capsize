export interface FontMetrics {
  /** The font family name as authored by font creator */
  familyName: string;
  /**
   * The style of the font: serif, sans-serif, monospace, display, or handwriting.
   *
   * (Optional as only availble for metrics from the `@capsizecss/metrics` package. Value not extractable from font data tables.)
   */
  category?: string;
  /** The height of the ascenders above baseline */
  ascent: number;
  /** The descent of the descenders below baseline */
  descent: number;
  /** The amount of space included between lines */
  lineGap: number;
  /** The size of the font’s internal coordinate grid */
  unitsPerEm: number;
  /** The height of capital letters above the baseline */
  capHeight: number;
  /** The height of the main body of lower case letters above baseline */
  xHeight: number;
  /** The average width of lowercase characters (currently calculated based on latin character letter frequencies) */
  xWidthAvg: number;
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

type FontMetricsForTrim = Pick<
  FontMetrics,
  'ascent' | 'descent' | 'capHeight' | 'lineGap' | 'unitsPerEm'
>;

type CapHeightWithLeading = {
  capHeight: number;
  leading?: number;
  fontMetrics: FontMetricsForTrim;
} & NotComputedValues;

type CapHeightWithLineGap = {
  capHeight: number;
  lineGap: number;
  fontMetrics: FontMetricsForTrim;
} & NotComputedValues;

type FontSizeWithLeading = {
  fontSize: number;
  leading?: number;
  fontMetrics: FontMetricsForTrim;
} & Omit<NotComputedValues, 'fontSize'>;

type FontSizeWithLineGap = {
  fontSize: number;
  lineGap: number;
  fontMetrics: FontMetricsForTrim;
} & Omit<NotComputedValues, 'fontSize'>;

export type CapsizeOptions =
  | CapHeightWithLineGap
  | CapHeightWithLeading
  | FontSizeWithLineGap
  | FontSizeWithLeading;
