import metrics from '../entireMetricsCollection.json';

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
 * ---
 */
export const entireMetricsCollection = metrics;
