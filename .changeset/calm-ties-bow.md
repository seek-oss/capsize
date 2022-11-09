---
'@capsizecss/unpack': patch
---

**fromFile**: Resolve unpack metrics error when unable to read the font file.

Fixes an issue where reading the metrics from a file could fail but still attempt to unpack the metrics.
