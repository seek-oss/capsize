---
'@capsizecss/metrics': minor
---

xWidthAvg: Update letter frequency data source

Letter frequencies used to calculate the `xWidthAvg` metrics were previously hard coded internally, and were an adaption from a [frequency table] on Wikipedia.

We now generate these weightings based on the abstracts of [WikiNews] articles, making it possible to add support for other languages that make use of non-latin [unicode subsets], e.g. Thai.

The generated `xWidthAvg` metrics seem to match (or are extremely close) the previous values, so we don't expect any significant changes to consumers.

[frequency table]: https://en.wikipedia.org/wiki/Letter_frequency#Relative_frequencies_of_letters_in_other_languages
[WikiNews]: https://wikinews.org/
[unicode subsets]: https://www.utf8icons.com/subsets