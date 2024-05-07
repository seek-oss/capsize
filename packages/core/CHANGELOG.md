# @capsizecss/core

## 4.1.1

### Patch Changes

- [#198](https://github.com/seek-oss/capsize/pull/198) [`f55acae`](https://github.com/seek-oss/capsize/commit/f55acae09286855e31df556d6ac793bb78ebe7fe) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - createFontStack: Apply `line-gap-override` with no `lineGap` in preferred font

  Ensure that the `line-gap-override` property is applied correctly when overriding a fallback font with a web font that has no `lineGap`.
  Previously if the override was zero it would be omitted from the declaration, rather than the correct behaviour of overriding the fallback metric to zero.

- [#199](https://github.com/seek-oss/capsize/pull/199) [`630a5fe`](https://github.com/seek-oss/capsize/commit/630a5fedd0b4a62eaaa6747073c275bd70dcd8a9) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - createFontStack: Ensure provided \`size-adjust\` is factored into metric overrides

  Ensures a custom `size-adjust` value provided via the `fontFaceProperties` option is factored into the calculations for the metric overrides.

  #### Example

  If a custom `size-adjust` value is provided:

  ```ts
  createFontStack([merriweatherSans, arial], {
    fontFaceProperties: {
      sizeAdjust: '300%',
    },
  });
  ```

  The resulting metric overrides are now adjusted accordingly:

  ```diff
   @font-face {
     font-family: "Merriweather Sans Fallback";
     src: local('Arial');
  -  ascent-override: 92.3409%;
  +  ascent-override: 32.8%;
  -  descent-override: 25.619%;
  +  descent-override: 9.1%;
     line-gap-override: 0%;
     size-adjust: 300%;
   }
  ```

## 4.1.0

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

## 4.0.0

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

### Patch Changes

- [#164](https://github.com/seek-oss/capsize/pull/164) [`a308885`](https://github.com/seek-oss/capsize/commit/a308885657a34a698596cf1d9103d50e1b3c0537) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - createFontStack: Append original fallback font name to the font stack

  The `fontFamily` returned from `createFontStack` now includes the original fallback font name(s). These are appended to the end of the font stack in the case the preferred font and generated fallbacks are not available.

  ```ts
  import lobster from '@capsizecss/metrics/lobster';
  import arial from '@capsizecss/metrics/arial';

  const { fontFamily } = createFontStack([lobster, arial]);
  ```

  Where `fontFamily` is now:

  ```diff
  - `Lobster, 'Lobster Fallback: Arial'`
  + `Lobster, 'Lobster Fallback: Arial', Arial`
  ```

- [#164](https://github.com/seek-oss/capsize/pull/164) [`a308885`](https://github.com/seek-oss/capsize/commit/a308885657a34a698596cf1d9103d50e1b3c0537) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - createFontStack: Quote `font-family` in `@font-face` declaration if needed

  Previously, when using `fontFaceFormat: 'styleObject'`, the generated fallback name was not quoted as necessary within the `@font-face` declaration.
  This could cause issues if the font family name contained spaces or other characters that required quoting.

## 3.1.1

### Patch Changes

- [#137](https://github.com/seek-oss/capsize/pull/137) [`79437c8`](https://github.com/seek-oss/capsize/commit/79437c8e6c0bfd9bde0ee0166d458d936b9f64da) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - createFontStack: Apply metric overrides conditionally

  Addresses an issue where metric overrides would be applied for fonts with the same metric values.
  The `ascent-override`, `descent-override` and `line-gap-override` properties are now all conditional, only returned when the metrics differ between the preferred font and its fallback(s).

## 3.1.0

### Minor Changes

- [#117](https://github.com/seek-oss/capsize/pull/117) [`0e969d8`](https://github.com/seek-oss/capsize/commit/0e969d8968a6b115fec96b1ac214c100480f9e65) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add `createFontStack` for metrics-based font family fallbacks.

  Creates metrics-based `@font-face` declarations to improve the alignment of font family fallbacks, which can dramatically improve the [Cumulative Layout Shift](https://web.dev/cls/) metric for sites that depend on a web font.

  ### Example usage

  ```ts
  import { createFontStack } from '@capsizecss/core';
  import lobster from '@capsizecss/metrics/lobster';
  import helveticaNeue from '@capsizecss/metrics/helveticaNeue';
  import arial from '@capsizecss/metrics/arial';

  const { fontFamily, fontFaces } = createFontStack([
    lobster,
    helveticaNeue,
    arial,
  ]);
  ```

  The returned values are the computed font family and the generated font face declarations:

  ```ts
  // `fontFamily`
  "Lobster, 'Lobster Fallback: Helvetica Neue', 'Lobster Fallback: Arial'";
  ```

  ```css
  /* `fontFaces` */
  @font-face {
    font-family: 'Lobster Fallback: Helvetica Neue';
    src: local('Helvetica Neue');
    ascent-override: 115.1741%;
    descent-override: 28.7935%;
    size-adjust: 86.8251%;
  }
  @font-face {
    font-family: 'Lobster Fallback: Arial';
    src: local('Arial');
    ascent-override: 113.5679%;
    descent-override: 28.392%;
    size-adjust: 88.053%;
  }
  ```

### Patch Changes

- [#122](https://github.com/seek-oss/capsize/pull/122) [`8a15c86`](https://github.com/seek-oss/capsize/commit/8a15c8647bb12c85853c6807c1edc9d82a79e6dc) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Add additional properties to `FontMetrics` type definition.

  Previously the `FontMetrics` type captured only the metrics required by the options for the `createStyleObject` and `createStyleString` APIs.
  With additional APIs coming that require a different subset of metrics, the type now reflects the structure of the data from the `metrics` package.

  The additional properties are: `familyName`, `category`, `xHeight` and `xWidthAvg`.
  See documentation for more details.

## 3.0.0

### Major Changes

- [#41](https://github.com/seek-oss/capsize/pull/41) [`beb400b`](https://github.com/seek-oss/capsize/commit/beb400beab5296353da32c4676466355184ab22b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - The `capsize` package has been moved to its own organisation on npm called `@capsizecss`. This will allow an official ecosystem of tooling to be added over time.

  ### Features

  #### `createStyleObject`

  Accepts capsize `options` and returns a JS object representation of the capsize styles that is compatible with most css-in-js frameworks.

  This replaces the default export of the previous version (see migration guide below).

  ```ts
  import { createStyleObject } from '@capsizecss/core';

  const capsizeStyles = createStyleObject({
    fontSize: 18,
    fontMetrics: {
      // ...
    },
  });

  <div
    css={{
      // fontFamily: '...' etc,
      ...capsizeStyles,
    }}
  >
    My capsized text 🛶
  </div>;
  ```

  #### `createStyleString`

  Accepts capsize `options` and returns a string representation of the capsize styles that can then be templated into a HTML `style` tag or appended to a stylesheet.

  ```ts
  import { createStyleString } from '@capsizecss/core';

  const capsizedStyleRule = createStyleString('capsizedText', {
    fontSize: 18,
    fontMetrics: {
      // ...
    },
  });

  document.write(`
    <style type="text/css">
      ${capsizedStyleRule}
    </style>
    <div class="capsizedText">
      My capsized text 🛶
    </div>
  `);
  ```

  #### `precomputeValues`

  Accepts capsize `options` and returns all the information required to create styles for a specific font size given the provided font metrics. This is useful for integrations with different styling solutions.

  ### Breaking Change Migration Guide

  #### Installation

  Replace the previous `capsize` dependency with the new scoped version of the package `@capsizecss/core`:

  ```bash
  npm uninstall capsize
  npm install @capsizecss/core
  ```

  #### API changes

  There is no longer a default export, this behaviour is now available via the `createStyleObject` named export.

  ```diff
  - import capsize from 'capsize';
  + import { createStyleObject } from '@capsizecss/core';

  - const styles = capsize({
  + const styles = createStyleObject({
    fontSize: 18,
    fontMetrics: {
      // ...
    }
  });
  ```

  #### Import changes

  Both the `getCapHeight` function and `FontMetrics` type still exist, but the package name will need to be updated.

  ```diff
  - import { getCapHeight, FontMetrics } from 'capsize';
  + import { getCapHeight, FontMetrics } from '@capsizecss/core';
  ```

  #### Removals

  The `CapsizeOptions` type has been removed, you can infer this from the first argument passed to `createStyleObject` using TypeScripts built-in `Parameters` utility:

  ```diff
  - import type { CapsizeStyles } from 'capsize';
  + import type { createStyleObject } from '@capsizecss/core';

  + type CapsizeOptions = Parameters<typeof createStyleObject>[0];
  ```

  The `CapsizeStyles` type has been removed, you can infer this from `createStyleObject` using TypeScripts built-in `ReturnType` utility:

  ```diff
  - import type { CapsizeStyles } from 'capsize';
  + import type { createStyleObject } from '@capsizecss/core';

  + type CapsizeStyles = ReturnType<typeof createStyleObject>;
  ```
