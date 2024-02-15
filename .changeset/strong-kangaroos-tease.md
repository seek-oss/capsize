---
'@capsizecss/metrics': minor
---

xWidthAvg: Update character frequency weightings data source

The character frequency weightings used to calculate the `xWidthAvg` metrics were previously hard coded internally, and were an adaption from a [frequency table] from Wikipedia.

We now generate these weightings based on the abstracts from [WikiNews] articles.
This makes it possible to add support for languages that use non-latin [unicode subsets], e.g. Thai, by adding the relevant abstract and generating the `xAvgWidth` based on the corresponding unicode subset range.

### Will this change anything for consumers?

Given the updated `xWidthAvg` metrics are very close to the original hard coded values, we do not forsee any impact on consumers.
Even our CSS snapshot tests were unchanged, and they contain values rounded to 4 decimal places!

The result is either no or extremely minor changes to the generated fallback font CSS, with the benefit being this lays the ground work to support additional language subsets in the near future.

[frequency table]: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
[WikiNews]: https://wikinews.org/
[unicode subsets]: https://www.utf8icons.com/subsets