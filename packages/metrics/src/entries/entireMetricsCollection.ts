import metrics from '../entireMetricsCollection.json';
import type { MetricsFont } from '../../scripts/extract';
/**
 * Provides the entire metrics collection as a JSON object, keyed by font family name.
 *
 * ## ⚠️ CAUTION: Importing this will result in a **large JSON structure** being pulled into your project! It is not recommended to use this client side.
 *
 * ---
 * Example usage:
 *
 * ```ts
 * import { entireMetricsCollection } from '@capsizecss/metrics/entireMetricsCollection';
 *
 * const metrics = entireMetricsCollection['arial'];
 * ```
 *
 * or for a specific variant:
 *
 * ```ts
 * import { entireMetricsCollection } from '@capsizecss/metrics/entireMetricsCollection';
 *
 * const arialBoldItalic = entireMetricsCollection['arial'].variants['700italic'];
 * ```
 * ---
 */

// ***************************************************************
// DONT PR THIS JUST YET, LOSING TYPE SAFETY BUT NEED A WORKAROUND
// ***************************************************************
type EntireMetricCollection = Record<
  keyof typeof metrics,
  Partial<MetricsFont> & {
    variants?: Record<
      keyof (typeof metrics)[keyof typeof metrics]['variants'],
      Partial<MetricsFont>
    >;
  }
>;

export const entireMetricsCollection = metrics as EntireMetricCollection;
