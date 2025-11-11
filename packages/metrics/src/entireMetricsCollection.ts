import metrics from './entireMetricsCollection.json';
import type { EntireMetricsCollection } from './types';

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

export const entireMetricsCollection: EntireMetricsCollection = metrics;
