---
'@capsizecss/core': minor
---

Add `createFontStack` for metrics-based fallback fonts

Creates metrics-based [font aliases](https://www.zachleat.com/web/rename-font/) for improved alignment of font family fallbacks.

Generates a `@font-face` definition per fallback font, using font metric overrides that better align the fallback to the preferred font.

Also returns the generated `fontFamily` with the appropriately ordered font aliases.

### Example Usage

Pass the metrics for your font stack in the same order as you would to `font-family`.

Returns the computed `font-family` as well as the generated font-face rules.
If using a CSS-in-JS library, use the `fontFaces` array that is returned.
If building a stylesheet or style tag, use the `fontFacesAsCss` string that is returned.

```ts
import { createFontStack } from '@capsizecss/core';
import lobster from '@capsizecss/metrics/lobster';
import arial from '@capsizecss/metrics/arial';
import helvetica from '@capsizecss/metrics/helvetica';

const fontStack = createFontStack([lobster, helvetica, arial]);

// => {
//   fontFamily: 'Lobster, "Lobster Fallback: Helvetica", "Lobster Fallback: Arial"',
//   fontFaces: [
//     {
//       '@font-face': {
//          fontFamily: '"Lobster Fallback: Helvetica"',
//          src: 'local("Helvetica")',
//          'ascentOverride': '...%',
//          'descentOverride': '...%',
//          'lineGapOverride': '...%',
//       },
//     }
//     ...
//   ],
//   fontFacesAsCss: `
//      @font-face {
//        font-family: 'Lobster Fallback: Helvetica';
//        src: local('Helvetica');
//        ascent-override: ...%;
//        descent-override: ...%;
//        line-gap-override: ...%;
//      }
//      ...
//   `
// }
```
