---
'@capsizecss/core': patch
---

Add additional properties to `FontMetrics` type definition.

Previously the `FontMetrics` type captured only the metrics required by the options for the `createStyleObject` and `createStyleString` APIs.
With additional APIs coming that require a different subset of metrics, the type now reflects the structure of the data from the `metrics` package.

The additional properties are: `familyName`, `category`, `xHeight` and `xWidthAvg`.
See documentation for more details.