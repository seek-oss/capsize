---
'@capsizecss/core': minor
---

Add `createFontStack` for metrics-based font family fallbacks.

Creates metrics-based `@font-face` declarations to improve the alignment of font family fallbacks, which can dramatically improve the [Cumulative Layout Shift](https://web.dev/cls/) metric for sites that depend on a web font.

### Example usage

```ts
import { createFontStack } from '@capsizecss/core';
import lobster from '@capsizecss/metrics/lobster';
import helveticaNeue from '@capsizecss/metrics/helveticaNeue';
import arial from '@capsizecss/metrics/arial';

const { fontFamily, fontFaces } = createFontStack([
  lobster,
  helveticaNeue,
  arial,
]);

```

The returned values are the computed font family and the generated font face declarations:
```ts
// `fontFamily`
"Lobster, 'Lobster Fallback: Helvetica Neue', 'Lobster Fallback: Arial'"
```

```css
/* `fontFaces` */
@font-face {
  font-family: 'Lobster Fallback: Helvetica Neue';
  src: local('Helvetica Neue');
  ascent-override: 115.1741%;
  descent-override: 28.7935%;
  size-adjust: 86.8251%;
}
@font-face {
  font-family: 'Lobster Fallback: Arial';
  src: local('Arial');
  ascent-override: 113.5679%;
  descent-override: 28.392%;
  size-adjust: 88.053%;
}
```