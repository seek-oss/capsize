---
'@capsizecss/core': patch
---

createFontStack: Apply metric overrides conditionally

Addresses an issue where metric overrides would be applied for fonts with the same metric values.
The `ascent-override`, `descent-override` and `line-gap-override` properties are now all conditional, only returned when the metrics differ between the preferred font and its fallback(s).