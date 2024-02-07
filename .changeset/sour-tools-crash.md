---
'@capsizecss/core': patch
---

createFontStack: Quote `font-family` in `@font-face` declaration if needed

Previously, when using `fontFaceFormat: 'styleObject'`, the generated fallback name was not quoted as necessary within the `@font-face` declaration.
This could cause issues if the font family name contained spaces or other characters that required quoting.
