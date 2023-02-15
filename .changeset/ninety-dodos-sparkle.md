---
'@capsizecss/metrics': minor
---

**fontFamilyToCamelCase**: Expose utility to convert family name to import name

A helper function to support tooling that needs to convert the font family name to the correct casing for the relevant metrics import.

```ts
import { fontFamilyToCamelCase } from '@capsizecss/metrics';

const familyName = fontFamilyToCamelCase('--apple-system'); // => `appleSystem`
const metrics = await import(`@capsizecss/metrics/${familyName}`);
```
