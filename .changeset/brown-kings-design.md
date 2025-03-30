---
'@capsizecss/unpack': minor
---

Adds support for extracting font metrics from a buffer

Extract font metrics from a buffer directly by calling the newly exposed `fromBuffer` function:

```ts
import { fromBuffer } from '@capsizecss/unpack';

const metrics = await fromBuffer(buffer);
```
