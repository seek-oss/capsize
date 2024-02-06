---
'@capsizecss/core': patch
---

createFontStack: Append original fallback font name to the font stack

The `fontFamily` returned from `createFontStack` now includes the original fallback font name(s). These are appended to the end of the font stack in the case the preferred font and generated fallbacks are not available.

```ts
import lobster from '@capsizecss/metrics/lobster';
import arial from '@capsizecss/metrics/arial';

const { fontFamily } = createFontStack([
  lobster,
  arial,
]);
```

Where `fontFamily` is now:

```diff
- `Lobster, 'Lobster Fallback: Arial'`
+ `Lobster, 'Lobster Fallback: Arial', Arial`
```