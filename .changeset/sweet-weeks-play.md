---
'@capsizecss/vanilla-extract': patch
---

Fix ESM compatibility of generated CSS module

When consumed via ESM, the generated CSS module had a bug which could result in missing Vanilla Extract file scopes.

[Crackle]: https://github.com/seek-oss/crackle?tab=readme-ov-file#-crackle-
