---
"@capsizecss/unpack": major
---

Create `server` entry point to isolate usage of node APIs without needing to polyfill.

### BREAKING CHANGES

Move `fromFile` to `server` entry point.

#### MIGRATION GUIDE

```diff
-import { fromFile } from '@capsizecss/unpack';
+import { fromFile } from '@capsizecss/unpack/server';
```