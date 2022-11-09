# @capsizecss/unpack

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
