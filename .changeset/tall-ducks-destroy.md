---
"@capsizecss/unpack": major
---

**unpack:** Remove polyfill libraries

Remove `node-fetch` and `blob-to-buffer` polyfills in favour of built-in `fetch` and `arrayBuffer` APIs in node.

### BREAKING CHANGES:

Requires node >= 18
