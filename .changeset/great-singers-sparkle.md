---
'capsize': minor
---

Add getCapHeight utility and round decimal precision to 4 places

**Add `getCapHeight({ fontSize: number, fontMetrics: FontMetrics }): number`**
Utility to get the actual rendered cap height for a specific font size given the provided font metrics.

**CSS property precision**
Based on discovering that browser implementations of layout units fall between 1/60th and 1/64th of a pixel, rounding all property values to 4 decimal precision.

Reference: https://trac.webkit.org/wiki/LayoutUnit
(also mentions Mozilla - https://trac.webkit.org/wiki/LayoutUnit#Notes)
