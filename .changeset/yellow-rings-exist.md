---
'@capsizecss/metrics': minor
---

**entireMetricsCollection**: Expose all metrics indexed by family name

Provides the entire metrics collection as a JSON object, keyed by font family name.

---

**⚠️ CAUTION: Importing this will result in a _large JSON structure_ being pulled into your project!**

**It is not recommended to use this client side.**

---

```ts
import { entireMetricsCollection } from '@capsizecss/metrics/entireMetricsCollection';

const metrics = entireMetricsCollection['arial'];
```
