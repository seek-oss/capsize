import fs from 'fs/promises';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import sortKeys from 'sort-keys';

type WikiNewsFeed = {
  feed: {
    doc: {
      abstract: string;
    }[];
  };
};

/*
Steps to add support for new subsets:
1. Identify source from WikiNews data:
    - Previously sourced from mirror: https://wikidata.aerotechnet.com/
    - Find folder `<lang>wikinews`, e.g. `enwikinews`
    - Find latest date folder, e.g. `20231201`
2. Download & extract `abstracts` data file:
    - Filename should be `<lang>wikinews-<date>-abstract.xml`, e.g. `enwikinews-20231201-abstract.xml`
3. Add extracted XML file to `abstracts` folder
4. Add subset name to `Subset` type below (see https://www.utf8icons.com/subsets for reference on Unicode Range names)
5. Add mapping to `languageToSubset` below, for resolving the language from the filename to the correct subset
6. Add Unicode Range to `unicodeRanges` below, for filtering characters to count their frequency
7. Run `pnpm dev` to generate the weightings, local dev refs and metrics
*/

type Subset = 'latin' | 'thai';

const languageToSubset: Record<string, Subset> = {
  en: 'latin',
  th: 'thai',
};

const unicodeRanges: Record<Subset, string[]> = {
  // latin and latin-1 supplement (excluding control characters)
  latin: ['\u0020-\u007F', '\u00A0-\u00FF'],
  // thai (excluding diacritic marks/combining characters)
  thai: ['\u0E01-\u0E30', '\u0E32-\u0E33', '\u0E3F-\u0E46', '\u0E4F-\u0E5B'],
};

const abstractFileNamePattern = /([a-z]{2})wikinews-[\d]+-abstract\.xml/;
const SAMPLE_SIZE = 5000;

(async () => {
  const directoryPath = path.join(__dirname, 'abstracts');
  const languages = await fs.readdir(directoryPath);

  let weightings: Record<string, Record<string, number>> = {};

  await Promise.all(
    languages.map(async function (filename) {
      const languageMatch = filename.match(abstractFileNamePattern);
      if (!languageMatch) {
        throw new Error(
          `Filename did not match expected source pattern: ${filename}`,
        );
      }

      const language = languageMatch[1];
      const subset = languageToSubset[language];

      if (!subset) {
        throw new Error(`Could not find subset for language: ${language}`);
      }

      const content = await fs.readFile(
        path.join(directoryPath, filename),
        'utf-8',
      );

      const parser = new XMLParser();
      const json: WikiNewsFeed = parser.parse(content);

      const data = json.feed.doc
        .slice(1, SAMPLE_SIZE)
        // remove markdown link syntax
        .map(({ abstract }) =>
          abstract.replace(/\[(.[^\|]+)(?:\|.[^\]]+)?\]/g, '$1'),
        )
        // remove some common wikiquote syntax
        .filter((a) => a !== '__NOTOC__' && a !== '----' && a !== '-----')
        .join('');

      let rawTotal = 0;
      const charOccurenceCount: Record<string, number> = {};
      const charRegex = new RegExp(`[${unicodeRanges[subset].join('')}]`);
      for (const char of data) {
        if (charRegex.test(char)) {
          charOccurenceCount[char] = (charOccurenceCount[char] ?? 0) + 1;
          rawTotal += 1;
        }
      }

      let filteredTotal = 0;

      const output = Object.entries(charOccurenceCount)
        .map(([char, count]) => ({
          char,
          count,
          weighting: parseFloat((count / rawTotal).toFixed(4)),
        }))
        // Filter out zero weightings below 4 decimal places
        .filter(({ count, weighting }) => {
          if (weighting > 0) {
            // sum the filtered total for updated weightings
            filteredTotal += count;
            return true;
          }
          return false;
        })
        // Calculate updated weightings, depends on filtered total, so must be done after
        .map(({ char, count }) => [
          char,
          parseFloat((count / filteredTotal).toFixed(4)),
        ]);

      weightings[subset] = Object.fromEntries(output);
    }),
  );

  await fs.writeFile(
    path.join(__dirname, '../src/weightings.ts'),
    `export default ${JSON.stringify(sortKeys(weightings), null, 2)}\n`,
    'utf-8',
  );
})();
