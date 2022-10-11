---
'@capsizecss/unpack': minor
---

Remove `fullName`, `postscriptName` and `subfamilyName` fields

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