---
"@capsizecss/unpack": major
---

Create `fs` entry point to isolate usage of file system APIs without needing to polyfill.

### BREAKING CHANGES

Move `fromFile` to `fs` entry point.

#### MIGRATION GUIDE

```diff
-import { fromFile } from '@capsizecss/unpack';
+import { fromFile } from '@capsizecss/unpack/fs';
```