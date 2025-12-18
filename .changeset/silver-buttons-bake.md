---
"@capsizecss/unpack": major
---

Convert to ESM-only package.

### BREAKING CHANGES

As a result of migrating to a lighter weight package for extracting font file metrics, this package is now ESM-only.

#### MIGRATION GUIDE

In most projects you can continue to use the package as before.
CommonJS (CJS) projects using Node.js <20, should update to use a dynamic import:

```js
// For CJS projects before Node 20
const { fromBuffer } = await import('@capsizecss/unpack');

// For all other projects
import { fromBuffer } from '@capsizecss/unpack';
```
