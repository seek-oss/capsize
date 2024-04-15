---
'@capsizecss/metrics': patch
---

metrics: Update apple system font metrics

Previously the metrics provided for `-apple-system` and `BlinkMacSystemFont` were extracted from the `SF Pro` font, with a custom override to correct the `descent` metric.

Through upcoming work to support font weights and styles, it has been identified that MacOS uses the `SFNS` font.
Extracting the metrics from this font means no more custom overrides, and will now enable using this font as a fallback via postscript name soon too.
