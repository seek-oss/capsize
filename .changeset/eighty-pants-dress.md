---
'@capsizecss/unpack': minor
---

Add support for extracting from TrueType Collection by PostScript name

Enable the extraction of font metrics for a specific font from TrueType Collection (TTC) file by providing the `postscriptName` option.

For example:

```ts
import { fromFile } from '@capsizecss/unpack';

const metrics = await fromFile('AvenirNext.ttc', {
  postscriptName: 'AvenirNext-Bold',
});
```