---
'@capsizecss/metrics': minor
---

metrics: Add weight and italic support

Add support for importing metrics for specific weights and italics.
While internal font metrics do not differ between variants, the `xWidthAvg` metric is calculated based on the average character width, and this will differ between variants.

Available variants will differ by font, and follow the same variant naming as Google Fonts:
```ts
import arial from '@capsizecss/metrics/arial'; 
import arialItalic from '@capsizecss/metrics/arial/italic'; 
import arialBold from '@capsizecss/metrics/arial/700'; 
import arialBoldItalic from '@capsizecss/metrics/arial/700italic'; 
```

Having metrics for different variants improves visual alignment of fallback fonts when using the `createFontStack` API from the `@capsizecss/core` package.

Example usage:
```ts
import { createFontStack } from '@capsizecss/core';
import montserrat from '@capsizecss/metrics/montserrat';
import montserrat600 from '@capsizecss/metrics/montserrat/600';
import arial from '@capsizeecss/metrics/arial';
import arialBold from '@capsizecss/metrics/arial/700'; 

const regular = createFontStack([
  montserrat,
  arial,
]);

// => {
//   "fontFamily": "Montserrat, \"Montserrat Fallback\", Arial",
//   "fontFaces": [
//     {
//       "@font-face": {
//         "fontFamily": "\"Montserrat Fallback\"",
//         "src": "local('Arial')",
//         "ascentOverride": "85.7923%",
//         "descentOverride": "22.2457%",
//         "sizeAdjust": "112.8307%"
//       }
//     }
//   ]
// }

const bold = createFontStack(
  [
    montserrat600,
    arialBold,
  ],
  {
    fontFaceProperties: {
      fontWeight: 700
    },
  },
);

// => {
//   "fontFamily": "Montserrat, \"Montserrat Fallback\", Arial",
//   "fontFaces": [
//     {
//       "@font-face": {
//         "fontWeight": 700,
//         "fontFamily": "\"Montserrat Fallback\"",
//         "src": "local('Arial')",
//         "ascentOverride": "89.3502%",
//         "descentOverride": "23.1683%",
//         "sizeAdjust": "108.3377%"
//       }
//     }
//   ]
// }
```
