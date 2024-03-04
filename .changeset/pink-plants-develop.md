---
'@capsizecss/metrics': minor
'@capsizecss/core': minor
---

xWidthAvg: Add `subset` support for non-latin character sets

Previously the `xWidthAvg` metric was calculated based on the character frequency as measured from English text only.
This resulted in the `xWidthAvg` metric being incorrect for languages that use a different unicode subset range, e.g. Thai.

Supporting Thai now enables adding support for other unicode ranges in the future.

### What's changed?

#### `@capsizecss/metrics`

The `subsets` field has been added to the metrics object, providing the `xWidthAvg` metric for each subset — calculated against the relevant character frequency data.

```diff
 {
   "familyName": "Abril Fatface",
   ...
+  "subsets": {
+    "latin": {
+      "xWidthAvg": 512
+    },
+    "thai": {
+      "xWidthAvg": 200
+    }
+  }
 }
```

There are no changes to any of the other existing metrics.


#### `@capsizecss/core`

Fallback font stacks can now be generated per subset, allowing the correct `xWidthAvg` metric to be used for the relevant subset.

The `createFontStack` API now accepts `subset` as an option:

```ts
const { fontFamily, fontFaces } = createFontStack(
  [lobster, arial],
  {
    subset: 'thai',
  },
);
```