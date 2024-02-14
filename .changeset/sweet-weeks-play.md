---
'@capsizecss/vanilla-extract': patch
---

Fix ESM compatibility of generated CSS module

Pre-compiling the integration with [Crackle] ensures the package is set up correctly to be consumed across both CJS and ESM, as well as having more correct types.

When consumed via ESM, the generated CSS module had a bug which could result in missing Vanilla Extract file scopes.

[Crackle]: https://github.com/seek-oss/crackle?tab=readme-ov-file#-crackle-
