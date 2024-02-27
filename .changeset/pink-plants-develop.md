---
'@capsizecss/metrics': minor
'@capsizecss/unpack': minor
---

xWidthAvg: Add `subset` support for non-latin character sets

Previously the `xWidthAvg` metric was calculated based on the character frequency as measured from English text only — meaning languages that use a different unicode subset range, e.g. Thai, the `xWidthAvg` metric would be incorrect.

Supporting Thai now enables adding support for other unicode ranges in the future.

### Whats changed?

#### `@capsizecss/metrics/...`

Individual metrics can be imported as named exports from each font's entry point.
The default export will continue to be `latin`.

```ts
// Default export provides `latin` subset
import arial from '@capsizecss/metrics/arial';

// Named exports available for all supported subsets:
import { latin as arialLatin } from '@capsizecss/metrics/arial'; // same as default above
import { thai as arialThai } from '@capsizecss/metrics/arial';
```

#### `@capsizecss/metrics/entireMetricsCollection`

Same goes for the `entireMetricCollection`, with named exports for each subset.
The default export will continue to be `latin`.

```ts
// Default export provides `latin` subset
import arial from '@capsizecss/metrics/entireMetricsCollection';

// Named exports available for all supported subsets:
import { latin as metricsLatin } from '@capsizecss/metrics/entireMetricsCollection'; // same as default above
import { thai as metricsThai } from '@capsizecss/metrics/entireMetricsCollection';
```

#### `@capsizecss/unpack`

All APIs now accept a second argument, an options object to specify the `subset`.
This will ensure the returned `xWidthAvg` metric returned is accurate for the specified subset.

```ts
const metrics = await fromUrl(url, {
  subset: 'thai',
});
```
