---
'@capsizecss/metrics': major
---

metrics: Prefer public family name to internal `familyName` metrics

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
