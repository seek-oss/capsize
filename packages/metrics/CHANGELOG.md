# @capsizecss/metrics

## 3.2.0

### Minor Changes

- [#202](https://github.com/seek-oss/capsize/pull/202) [`452f2a3`](https://github.com/seek-oss/capsize/commit/452f2a3a167b2a9a49205a5842596aaf2ed34df9) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics: Add weight and italic support

  Add support for importing metrics for specific weights and italics.
  While internal font metrics typically do not differ between variants, the `xWidthAvg` metric is calculated based on the average character width, and this will differ between variants.

  Available variants will differ by font, and follow the same variant naming as Google Fonts:

  ```ts
  import arial from '@capsizecss/metrics/arial';
  import arialItalic from '@capsizecss/metrics/arial/italic';
  import arialBold from '@capsizecss/metrics/arial/700';
  import arialBoldItalic from '@capsizecss/metrics/arial/700italic';
  ```

  Having metrics for different variants improves visual alignment of fallback fonts when using the `createFontStack` API from the `@capsizecss/core` package.

  Example usage:

  ```ts
  import { createFontStack } from '@capsizecss/core';
  import montserrat from '@capsizecss/metrics/montserrat';
  import montserrat600 from '@capsizecss/metrics/montserrat/600';
  import arial from '@capsizecss/metrics/arial';
  import arialBold from '@capsizecss/metrics/arial/700';

  const regular = createFontStack([montserrat, arial]);

  // => {
  //   "fontFamily": "Montserrat, \"Montserrat Fallback\", Arial",
  //   "fontFaces": [
  //     {
  //       "@font-face": {
  //         "fontFamily": "\"Montserrat Fallback\"",
  //         "src": "local('Arial'), local('ArialMT')",
  //         "ascentOverride": "85.7923%",
  //         "descentOverride": "22.2457%",
  //         "lineGapOverride": "0%",
  //         "sizeAdjust": "112.8307%"
  //       }
  //     }
  //   ]
  // }

  const bold = createFontStack([montserrat600, arialBold], {
    fontFaceProperties: {
      fontWeight: 700,
    },
  });

  // => {
  //   "fontFamily": "Montserrat, \"Montserrat Fallback\", Arial",
  //   "fontFaces": [
  //     {
  //       "@font-face": {
  //         "fontWeight": 700,
  //         "fontFamily": "\"Montserrat Fallback\"",
  //         "src": "local('Arial Bold'), local('Arial-BoldMT')",
  //         "ascentOverride": "89.3502%",
  //         "descentOverride": "23.1683%",
  //         "lineGapOverride": "0%",
  //         "sizeAdjust": "108.3377%"
  //       }
  //     }
  //   ]
  // }
  ```

## 3.1.0

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
    font-family: 'Web Font Fallback';
    src: local('Arial Bold'), local('Arial-BoldMT');
    font-weight: 700;
    ascent-override: 89.3502%;
    descent-override: 23.1683%;
    size-adjust: 108.3377%;
  }
  ```

  [local(\<font-face-name\>)]: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src#localfont-face-name

## 3.0.0

### Major Changes

- [#191](https://github.com/seek-oss/capsize/pull/191) [`d0086a6`](https://github.com/seek-oss/capsize/commit/d0086a6006272f7b7f1e488883d1cf7863642300) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics: Prefer public family name to internal `familyName` metrics

  Ensure metrics are available using the public family name as seen on Google Fonts as opposed to the internal family name metric.
  This makes sense as consumers are looking to import the metrics relevant to a specific system font or from Google Fonts (also aligns with the names Google use in their font declarations generated in the hosted stylesheets).

  ### BREAKING CHANGES:

  #### Google Fonts

  Previously, the metrics were imported with a path that used the internal family name, now they align with the font as seen on Google Fonts.

  ```diff
  -import metrics from '@capsizecss/metrics/roundedMplus1c';
  +import metrics from '@capsizecss/metrics/mPLUSRounded1c';
  ```

  With only a small number of Google Fonts affected, this is only a break for the following fonts:

  - Ballet
  - Bodoni Moda
  - Buda
  - Bungee Spice
  - Fjord One
  - Geologica
  - Imbue
  - M PLUS Rounded 1c
  - Material Symbols Outlined
  - Material Symbols Rounded
  - Material Symbols Sharp
  - Montagu Slab
  - Nanum Pen Script
  - Newsreader
  - Nunito Sans
  - Pathway Extreme
  - Sono
  - Sunflower
  - Supermercado One
  - Texturina

  #### System fonts

  The system fonts only had one example where the names diverged:

  ```diff
  -import metrics from '@capsizecss/metrics/brushScriptMT';
  +import metrics from '@capsizecss/metrics/brushScript';
  ```

  This now aligns with the name consumers use to reference the font on their system.

### Minor Changes

- [#190](https://github.com/seek-oss/capsize/pull/190) [`75233b1`](https://github.com/seek-oss/capsize/commit/75233b16c613525420b1383698bcf114fa41b70f) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update Google Fonts to latest

### Patch Changes

- [#193](https://github.com/seek-oss/capsize/pull/193) [`121eb42`](https://github.com/seek-oss/capsize/commit/121eb4201598c09793ff741a51baf85869c7e5c1) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics: Update apple system font metrics

  Previously the metrics provided for `-apple-system` and `BlinkMacSystemFont` were extracted from the `SF Pro` font, with a custom override to correct the `descent` metric.

  Through work to support metrics for different font weights and styles, it was identified that MacOS uses the `SFNS` font.
  Extracting the metrics from this font means no more custom overrides, and will now enable using this font as a fallback via postscript name soon too.

## 2.2.0

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

## 2.1.1

### Patch Changes

- [#181](https://github.com/seek-oss/capsize/pull/181) [`c2091af`](https://github.com/seek-oss/capsize/commit/c2091afae7729c73a7c032a80c829aa88c15a85b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - xWidthAvg: Improve metric by factoring in space to weightings

  Analyzing the `xWidthAvg` metrics for `latin` character sets, we have seen further improvement in the accuracy by factoring in the space character to the weightings.

## 2.1.0

### Minor Changes

- [#175](https://github.com/seek-oss/capsize/pull/175) [`f2e1c2f`](https://github.com/seek-oss/capsize/commit/f2e1c2f667d54a299294dfdeb3de8e1a65695f1a) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics: Provide ESM entrypoints for individual font metrics

  Build an ESM version of individual font metrics in preparation for adding named exports as part of the upcoming support for non-latin unicode subsets.

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

### Minor Changes

- [#167](https://github.com/seek-oss/capsize/pull/167) [`193d5ec`](https://github.com/seek-oss/capsize/commit/193d5ec43b7eaf872574a4920cec69f11937945f) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - xWidthAvg: Update character frequency weightings data source

  The character frequency weightings used to calculate the `xWidthAvg` metrics were previously hard coded internally, and were an adaption from a [frequency table] from Wikipedia.

  We now generate these weightings based on the abstracts from [WikiNews] articles.
  This makes it possible to add support for languages that use non-latin [unicode subsets], e.g. Thai, by adding the relevant abstract and generating the `xAvgWidth` based on the corresponding unicode subset range.

  ### Will this change anything for consumers?

  Given the updated `xWidthAvg` metrics are very close to the original hard coded values, we do not forsee any impact on consumers.
  Even our CSS snapshot tests were unchanged, and they contain values rounded to 4 decimal places!

  The result is either no or extremely minor changes to the generated fallback font CSS, with the benefit being this lays the ground work to support additional language subsets in the near future.

  [frequency table]: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
  [WikiNews]: https://wikinews.org/
  [unicode subsets]: https://www.utf8icons.com/subsets

## 1.3.0

### Minor Changes

- [#151](https://github.com/seek-oss/capsize/pull/151) [`aae72fd`](https://github.com/seek-oss/capsize/commit/aae72fddc8e45124aeb100266952b392762cdefe) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update Google Fonts to latest

### Patch Changes

- [#154](https://github.com/seek-oss/capsize/pull/154) [`39c6ad4`](https://github.com/seek-oss/capsize/commit/39c6ad4827e3e2238fedf5dbcdf4c9bbd62c311d) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - entireMetricsCollection: Sort metrics by familyName

  Sort the metrics collection by `familyName`.
  Provides a nicer experience by default when looping over the dataset, while also improving the review DX when adding/editing metrics.

## 1.2.0

### Minor Changes

- [#138](https://github.com/seek-oss/capsize/pull/138) [`7e875dc`](https://github.com/seek-oss/capsize/commit/7e875dc1125ecb084dfbce166fbb57913c5f635f) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update Google Fonts to latest

## 1.1.1

### Patch Changes

- [#133](https://github.com/seek-oss/capsize/pull/133) [`87286bb`](https://github.com/seek-oss/capsize/commit/87286bbef42fd7bfba63d4b8f8ee467f0c8965d5) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Ensure metrics files are published to npm

## 1.1.0

### Minor Changes

- [#129](https://github.com/seek-oss/capsize/pull/129) [`9507530`](https://github.com/seek-oss/capsize/commit/950753056d5cb6a5c1cb87572470507ceb9a4b0a) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - **fontFamilyToCamelCase**: Expose utility to convert family name to import name

  A helper function to support tooling that needs to convert the font family name to the correct casing for the relevant metrics import.

  ```ts
  import { fontFamilyToCamelCase } from '@capsizecss/metrics';

  const familyName = fontFamilyToCamelCase('--apple-system'); // => `appleSystem`
  const metrics = await import(`@capsizecss/metrics/${familyName}`);
  ```

- [#129](https://github.com/seek-oss/capsize/pull/129) [`9507530`](https://github.com/seek-oss/capsize/commit/950753056d5cb6a5c1cb87572470507ceb9a4b0a) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - **entireMetricsCollection**: Expose all metrics indexed by family name

  Provides the entire metrics collection as a JSON object, keyed by font family name.

  ***

  **⚠️ CAUTION: Importing this will result in a _large JSON structure_ being pulled into your project!**

  **It is not recommended to use this client side.**

  ***

  ```ts
  import { entireMetricsCollection } from '@capsizecss/metrics/entireMetricsCollection';

  const metrics = entireMetricsCollection['arial'];
  ```

## 1.0.1

### Patch Changes

- [#126](https://github.com/seek-oss/capsize/pull/126) [`eb59cde`](https://github.com/seek-oss/capsize/commit/eb59cde65705913ab83abd929ab956403efc881b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - oxygen: Refine missing metrics

  Refines the missing `capHeight` and `xHeight` metrics to align with anchor co-ordinates of relevant glyphs — `H` for capHeight and `x` for xHeight. Previously these values where subjectively observed using the Capsize website.

- [#126](https://github.com/seek-oss/capsize/pull/126) [`eb59cde`](https://github.com/seek-oss/capsize/commit/eb59cde65705913ab83abd929ab956403efc881b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add more system fonts

  Expands the metrics library to include more system fonts. Fonts added are:

  - `Tahoma`
  - `Lucida Grande`
  - `Verdana`
  - `Trebuchet MS`
  - `Georgia`
  - `Courier New`
  - `Brush Script`

  The library now support all the [Best Web Safe Fonts](https://www.w3schools.com/cssref/css_websafe_fonts.php).

## 1.0.0

### Major Changes

- [#125](https://github.com/seek-oss/capsize/pull/125) [`5d77f47`](https://github.com/seek-oss/capsize/commit/5d77f4758c32de8703f4869ff7b10cbf0b97af51) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics, unpack: Cut v1 release

  No actual breaking change here, but cutting the v1 release to mark the packages moving out of experimental phase.

### Minor Changes

- [#122](https://github.com/seek-oss/capsize/pull/122) [`8a15c86`](https://github.com/seek-oss/capsize/commit/8a15c8647bb12c85853c6807c1edc9d82a79e6dc) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update Google Fonts

- [#122](https://github.com/seek-oss/capsize/pull/122) [`8a15c86`](https://github.com/seek-oss/capsize/commit/8a15c8647bb12c85853c6807c1edc9d82a79e6dc) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Calculate and expose `xWidthAvg`, the average width of lowercase characters.

- [#122](https://github.com/seek-oss/capsize/pull/122) [`8a15c86`](https://github.com/seek-oss/capsize/commit/8a15c8647bb12c85853c6807c1edc9d82a79e6dc) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add `category` field to describe the style of the font, e.g. “serif”, “sans-serif” etc.

  Exposes the `category` field captured by Google Fonts, manually populating it for system fonts.

## 0.4.0

### Minor Changes

- [#112](https://github.com/seek-oss/capsize/pull/112) [`0066a20`](https://github.com/seek-oss/capsize/commit/0066a209e7746c16a7a9e7433820bd57c39ba43f) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update Google Fonts to latest

- [#110](https://github.com/seek-oss/capsize/pull/110) [`404de74`](https://github.com/seek-oss/capsize/commit/404de74384f5c81b77bb8bc5335aa4859554ea07) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add `timesNewRoman` metrics

  Provides metrics for the built in system font `Times New Roman`.
  Can be used by importing as `@capsizecss/metrics/timesNewRoman`.

## 0.3.0

### Minor Changes

- [#88](https://github.com/seek-oss/capsize/pull/88) [`7500f2a`](https://github.com/seek-oss/capsize/commit/7500f2a4e5b2efd59e8238ffcd24f80ca670405c) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update Google Fonts to latest

## 0.2.0

### Minor Changes

- [#80](https://github.com/seek-oss/capsize/pull/80) [`578682b`](https://github.com/seek-oss/capsize/commit/578682bd99cd965f34a4a0b20445087fdd1396c8) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Expose `xHeight` metadata when available

* [#80](https://github.com/seek-oss/capsize/pull/80) [`578682b`](https://github.com/seek-oss/capsize/commit/578682bd99cd965f34a4a0b20445087fdd1396c8) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Ensure generated types reflect extracted metadata

  The constructed types will now align with the metadata available from the font itself. This will ensure that TypeScript consumers receieve build time feedback for incomplete metrics, allowing manual overrides to complete the required FontMetric data.

  ### Example

  When the font metadata does not include a `capHeight`:

  ```js
  {
    familyName: 'My Incomplete Font',
    ascent: 860,
    descent: -348,
    lineGap: 0,
    unitsPerEm: 1024
  }
  ```

  TypeScript will now error when providing the metrics, rather than accepting them and rendering incorrectly.

  ```ts
  import myIncompleteFontMetrics from '@capsizecss/metrics/myIncompleteFont';
  import { createStyleObject } from '@capsizecss/core';

  createStyleObject({
    fontSize: 16,
    leading: 24,
    // Errors with incomplete metrics, missing `capHeight`
    fontMetrics: myIncompleteFontMetrics,
  });
  ```

  This allows consumers to resolve missing values and complete the contract.

  ```ts
  createStyleObject({
    fontSize: 16,
    leading: 24,
    // Error can be resolved by providing a manual override
    fontMetrics: {
      ...myIncompleteFontMetrics,
      capHeight: 594,
    },
  });
  ```

  ### Resolving missing data

  Resolving manual overrides can be done via the [Capsize website](https://seek-oss.github.io/capsize/). After selecting or uploading the font, use the `Edit` button at the end of `Step 1`.

### Patch Changes

- [#80](https://github.com/seek-oss/capsize/pull/80) [`578682b`](https://github.com/seek-oss/capsize/commit/578682bd99cd965f34a4a0b20445087fdd1396c8) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Update Google Fonts to latest

## 0.1.0

### Minor Changes

- [#48](https://github.com/seek-oss/capsize/pull/48) [`55251eb`](https://github.com/seek-oss/capsize/commit/55251ebe3ee668e8955485ab5474438fc3177b1b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Initial release
