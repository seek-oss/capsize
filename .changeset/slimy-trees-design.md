---
'@capsizecss/core': patch
---

createFontStack: Apply `line-gap-override` with no `lineGap` in preferred font

Ensure that the `line-gap-override` property is applied correctly when overriding a fallback font with a web font that has no `lineGap`.
Previously if the override was zero it would be omitted from the declaration, rather than the correct behaviour of overriding the fallback metric to zero.