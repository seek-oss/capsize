# @capsizecss/metrics

## 0.2.0

### Minor Changes

- [#80](https://github.com/seek-oss/capsize/pull/80) [`578682b`](https://github.com/seek-oss/capsize/commit/578682bd99cd965f34a4a0b20445087fdd1396c8) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Expose `xHeight` metadata when available

* [#80](https://github.com/seek-oss/capsize/pull/80) [`578682b`](https://github.com/seek-oss/capsize/commit/578682bd99cd965f34a4a0b20445087fdd1396c8) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics: Ensure generated types reflect extracted metadata

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

- [#80](https://github.com/seek-oss/capsize/pull/80) [`578682b`](https://github.com/seek-oss/capsize/commit/578682bd99cd965f34a4a0b20445087fdd1396c8) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - metrics: Update Google Fonts to latest

## 0.1.0

### Minor Changes

- [#48](https://github.com/seek-oss/capsize/pull/48) [`55251eb`](https://github.com/seek-oss/capsize/commit/55251ebe3ee668e8955485ab5474438fc3177b1b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Initial release
