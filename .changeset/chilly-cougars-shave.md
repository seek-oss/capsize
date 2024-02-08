---
'@capsizecss/vanilla-extract': major
'@capsizecss/metrics': major
'@capsizecss/unpack': major
'@capsizecss/core': major
---

Precompile Capsize packages with [Crackle]

Capsize packages are now precompiled with [Crackle], meaning that it is no longer possible to import private APIs or types from source code.
As a result of "crackling" Capsize, all packages should have better types and ESM compatibility too.

### BREAKING CHANGES:

While technically a breaking change, consumers of Capsize's public APIs are not affected by this change.
If you are affected due to reaching into package internals, please get in touch and see if we can find a more maintainable approach.

[Crackle]: https://github.com/seek-oss/crackle?tab=readme-ov-file#-crackle-