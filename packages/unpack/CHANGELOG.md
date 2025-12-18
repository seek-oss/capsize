# @capsizecss/unpack

## 4.0.0

### Major Changes

- [#250](https://github.com/seek-oss/capsize/pull/250) [`31dc6fa`](https://github.com/seek-oss/capsize/commit/31dc6fa83f232e958a94cb50a1909f1884327330) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Create `fs` entry point to isolate usage of file system APIs without needing to polyfill.

  ### BREAKING CHANGES

  Move `fromFile` to `fs` entry point.

  #### MIGRATION GUIDE

  ```diff
  -import { fromFile } from '@capsizecss/unpack';
  +import { fromFile } from '@capsizecss/unpack/fs';
  ```

- [#238](https://github.com/seek-oss/capsize/pull/238) [`61f51f3`](https://github.com/seek-oss/capsize/commit/61f51f303d377210fd14184786ac37aea9764fa2) Thanks [@delucis](https://github.com/delucis)! - Convert to ESM-only package.

  ### BREAKING CHANGES

  As a result of migrating to a lighter weight package for extracting font file metrics, this package is now ESM-only.

  #### MIGRATION GUIDE

  In most projects you can continue to use the package as before.
  CommonJS (CJS) projects using Node.js <20, should update to use a dynamic import:

  ```js
  // For CJS projects before Node 20
  const { fromBuffer } = await import("@capsizecss/unpack");

  // For all other projects
  import { fromBuffer } from "@capsizecss/unpack";
  ```

### Patch Changes

- [#238](https://github.com/seek-oss/capsize/pull/238) [`61f51f3`](https://github.com/seek-oss/capsize/commit/61f51f303d377210fd14184786ac37aea9764fa2) Thanks [@delucis](https://github.com/delucis)! - Reduce install size by using a lighter weight package for extracting font file metrics

## 3.0.1

### Patch Changes

- [#239](https://github.com/seek-oss/capsize/pull/239) [`41ef5b0`](https://github.com/seek-oss/capsize/commit/41ef5b0663f468575369485152b800ea48c53812) Thanks [@delucis](https://github.com/delucis)! - Bundle Capsize packages with [tsdown](https://tsdown.dev/) instead of Crackle. This is an internal change only and does not affect the public API.

## 3.0.0

### Major Changes

- [#226](https://github.com/seek-oss/capsize/pull/226) [`39b49a9`](https://github.com/seek-oss/capsize/commit/39b49a9151832db37b5afac1cf962b65a41faeab) Thanks [@chyzwar](https://github.com/chyzwar)! - **unpack:** Remove polyfill libraries

  Remove `node-fetch` and `blob-to-buffer` polyfills in favour of built-in `fetch` and `arrayBuffer` APIs in node.

  ### BREAKING CHANGES:

  Requires node >= 18

## 2.4.0

### Minor Changes

- [#223](https://github.com/seek-oss/capsize/pull/223) [`b0db2ef`](https://github.com/seek-oss/capsize/commit/b0db2ef94200a3597f9050e00b82a270a962ab2d) Thanks [@florian-lefebvre](https://github.com/florian-lefebvre)! - Adds support for extracting font metrics from a buffer

  Extract font metrics from a buffer directly by calling the newly exposed `fromBuffer` function:

  ```ts
  import { fromBuffer } from "@capsizecss/unpack";

  const metrics = await fromBuffer(buffer);
  ```

## 2.3.0

### Minor Changes

- [#208](https://github.com/seek-oss/capsize/pull/208) [`e3f73ea`](https://github.com/seek-oss/capsize/commit/e3f73eac30f36b4482a361bf860c1eb3c597cedd) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add support for extracting from TrueType Collection by PostScript name

  Enable the extraction of font metrics for a specific font from TrueType Collection (TTC) file by providing the `postscriptName` option.

  For example:

  ```ts
  import { fromFile } from "@capsizecss/unpack";

  const metrics = await fromFile("AvenirNext.ttc", {
    postscriptName: "AvenirNext-Bold",
  });
  ```

## 2.2.0

### Minor Changes

- [#195](https://github.com/seek-oss/capsize/pull/195) [`aa77cb2`](https://github.com/seek-oss/capsize/commit/aa77cb2b58f1fa9de9bd01e6933b6ad838ba325c) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Extract and expose `postscriptName` and `fullName` from font metrics

  The font metrics returned now include the `postscriptName` and `fullName` properties as authored by the font creator.

  For example:

  ```ts
  // Arial Regular metrics
  {
    "familyName": "Arial",
    "fullName": "Arial",
    "postscriptName": "ArialMT",
    ...
  }

  // Arial Bold metrics
  {
    "familyName": "Arial",
    "fullName": "Arial Bold",
    "postscriptName": "Arial-BoldMT",
    ...
  }
  ```

  These values are particularly useful when constructing CSS `@font-face` declarations, as they can be used to specify [local(\<font-face-name\>)] sources.
  MDN recommends using both “to assure proper matching across platforms”.

  ```css
  @font-face {
    font-family: "Web Font Fallback";
    src: local("Arial Bold"), local("Arial-BoldMT");
    font-weight: 700;
    ascent-override: 89.3502%;
    descent-override: 23.1683%;
    size-adjust: 108.3377%;
  }
  ```

  [local(\<font-face-name\>)]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src#localfont-face-name

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
    subset: "thai",
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
