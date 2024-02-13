---
'@capsizecss/vanilla-extract': major
'@capsizecss/metrics': major
'@capsizecss/unpack': major
'@capsizecss/core': major
---

Precompile Capsize packages with [Crackle]

Migrating Capsize packages to be precompiled with [Crackle], with a key change being Crackle now handles entry points instead of [Preconstruct].

Other benefits include:
- Modern module entry point syntax using the [“exports” field] with better tooling compatibility.
- Improved types and better ESM and CJS compatibility
- Better alignment between compiled code and module entry points

### BREAKING CHANGES:

#### API changes

While technically a breaking change, consumers of Capsize's public APIs are not affected by this change.
If you are affected due to reaching into package internals, please get in touch and see if we can find a more maintainable approach.

#### TypeScript

TypeScript consumers should ensure they are using a compatible [`moduleResolution` strategy in tsconfig] — either `node16`, `nodenext` or `bundler`. This will ensure types are correctly resolved across the different module specifications.


[Crackle]: https://github.com/seek-oss/crackle?tab=readme-ov-file#-crackle-
[Preconstruct]: https://preconstruct.tools/
[“exports” field]: https://nodejs.org/api/packages.html#exports
[`moduleResolution` strategy in tsconfig]: https://www.typescriptlang.org/tsconfig#moduleResolution