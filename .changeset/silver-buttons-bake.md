---
"@capsizecss/unpack": major
---

This package is now ESM-only.

In most projects you can continue to use the package as before. CommonJS (CJS) projects using Node.js <20, should update to use a dynamic import:

```js
// For CJS projects before Node 20
const { fromBuffer } = await import('@capsizecss/unpack');

// For all other projects
import { fromBuffer } from '@capsizecss/unpack';
```
