---
'@capsizecss/metrics': minor
---

xWidthAvg: Update character frequency weightings data source

Character frequency weightings used to calculate the `xWidthAvg` metrics were previously hard coded internally, and were an adaption from a [frequency table] on Wikipedia.

We now generate these weightings based on the abstracts of [WikiNews] articles, making it possible to add support for other languages that make use of non-latin [unicode subsets], e.g. Thai.

The updated `xWidthAvg` metrics are very close to the original hard coded values.
This results in either no or extremely minor changes to the generated fallback font CSS, meaning we don't expect any notable changes to consumers, with the benefit being this lays the ground work to support additional language subsets in the future.

[frequency table]: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
[WikiNews]: https://wikinews.org/
[unicode subsets]: https://www.utf8icons.com/subsets