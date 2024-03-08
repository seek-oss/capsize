# @capsizecss/unpack

## 2.1.0

### Minor Changes

- [#177](https://github.com/seek-oss/capsize/pull/177) [`879208b`](https://github.com/seek-oss/capsize/commit/879208bd08372be246ecd30a1be42f44883ca650) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - xWidthAvg: Add `subset` support for non-latin character sets

  Previously the `xWidthAvg` metric was calculated based on the character frequency as measured from English text only.
  This resulted in the `xWidthAvg` metric being incorrect for languages that use a different unicode subset range, e.g. Thai.

  Supporting Thai now enables adding support for other unicode ranges in the future.

  ### What's changed?

  #### `@capsizecss/metrics`

  The `subsets` field has been added to the metrics object, providing the `xWidthAvg` metric for each subset — calculated against the relevant character frequency data.

  ```diff
   {
     "familyName": "Abril Fatface",
     ...
  +  "subsets": {
  +    "latin": {
  +      "xWidthAvg": 512
  +    },
  +    "thai": {
  +      "xWidthAvg": 200
  +    }
  +  }
   }
  ```

  There are no changes to any of the other existing metrics.

  #### `@capsizecss/core`

  Fallback font stacks can now be generated per subset, allowing the correct `xWidthAvg` metric to be used for the relevant subset.

  The `createFontStack` API now accepts `subset` as an option:

  ```ts
  const { fontFamily, fontFaces } = createFontStack([lobster, arial], {
    subset: 'thai',
  });
  ```

## 2.0.1

### Patch Changes

- [#181](https://github.com/seek-oss/capsize/pull/181) [`c2091af`](https://github.com/seek-oss/capsize/commit/c2091afae7729c73a7c032a80c829aa88c15a85b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - xWidthAvg: Improve metric by factoring in space to weightings

  Analyzing the `xWidthAvg` metrics for `latin` character sets, we have seen further improvement in the accuracy by factoring in the space character to the weightings.

## 2.0.0

### Major Changes

- [#168](https://github.com/seek-oss/capsize/pull/168) [`8819ff1`](https://github.com/seek-oss/capsize/commit/8819ff1db53b9bb8e8cf1b3f1451a1ec49a32857) Thanks [@mrm007](https://github.com/mrm007)! - Precompile Capsize packages with [Crackle]

  Migrating Capsize packages to be precompiled with [Crackle], with a key change being Crackle now handles entry points instead of [Preconstruct].

  Other benefits include:

  - Modern module entry point syntax using the ["exports" field] with better tooling compatibility.
  - Improved types and better ESM and CJS compatibility
  - Better alignment between compiled code and module entry points

  ### BREAKING CHANGES:

  #### API changes

  While technically a breaking change, consumers of Capsize's public APIs are not affected by this change.
  If you are affected due to reaching into package internals, please get in touch and see if we can find a more maintainable approach.

  #### TypeScript

  TypeScript consumers should ensure they are using a compatible [`moduleResolution` strategy in TSConfig] — either `node16`, `nodenext` or `bundler`. This will ensure types are correctly resolved across the different module specifications.

  [Crackle]: https://github.com/seek-oss/crackle?tab=readme-ov-file#-crackle-
  [Preconstruct]: https://preconstruct.tools/
  ["exports" field]: https://nodejs.org/api/packages.html#exports
  [`moduleResolution` strategy in tsconfig]: https://www.typescriptlang.org/tsconfig#moduleResolution

## 1.0.0

### Major Changes

- [#125](https://github.com/seek-oss/capsize/pull/125) [`5d77f47`](https://github.com/seek-oss/capsize/commit/5d77f4758c32de8703f4869ff7b10cbf0b97af51) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics, unpack: Cut v1 release

  No actual breaking change here, but cutting the v1 release to mark the packages moving out of experimental phase.

### Minor Changes

- [#122](https://github.com/seek-oss/capsize/pull/122) [`8a15c86`](https://github.com/seek-oss/capsize/commit/8a15c8647bb12c85853c6807c1edc9d82a79e6dc) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Calculate and expose `xWidthAvg`, the average width of lowercase characters.

## 0.2.1

### Patch Changes

- [#109](https://github.com/seek-oss/capsize/pull/109) [`aafab43`](https://github.com/seek-oss/capsize/commit/aafab438f7d67705dcad6152bade050f60e492cb) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Upgrade to `fontkit` to v2

## 0.2.0

### Minor Changes

- [#93](https://github.com/seek-oss/capsize/pull/93) [`db8da8e`](https://github.com/seek-oss/capsize/commit/db8da8ecbae20a4f4ba5f98beeb263876d0a5e2c) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Remove `fullName`, `postscriptName` and `subfamilyName` fields

  The `fullName`, `postscriptName` and `subfamilyName` data fields were originally returned solely to support the website. These are no longer required, and looking to simplify this data structure in the lead up to version 1.

  ```diff
  {
    "familyName": "Abril Fatface",
  -  "fullName": "Abril Fatface",
  -  "postscriptName": "AbrilFatface-Regular",
  -  "subfamilyName": "Regular",
    "capHeight": 700,
    "ascent": 1058,
    "descent": -291,
    "lineGap": 0,
    "unitsPerEm": 1000,
    "xHeight": 476
  }
  ```

### Patch Changes

- [#99](https://github.com/seek-oss/capsize/pull/99) [`a108fe6`](https://github.com/seek-oss/capsize/commit/a108fe6346fd5e5238919ecc7d5bf50dcb84dd62) Thanks [@danielroe](https://github.com/danielroe)! - **fromFile**: Resolve unpack metrics error when unable to read the font file.

  Fixes an issue where reading the metrics from a file could fail but still attempt to unpack the metrics.

## 0.1.0

### Minor Changes

- [#48](https://github.com/seek-oss/capsize/pull/48) [`55251eb`](https://github.com/seek-oss/capsize/commit/55251ebe3ee668e8955485ab5474438fc3177b1b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Initial release
