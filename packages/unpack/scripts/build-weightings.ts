import fs from 'fs/promises';
import path from 'path';
import sortKeys from 'sort-keys';

(async () => {
  const directoryPath = path.join(__dirname, 'unigrams');
  const languages = await fs.readdir(directoryPath);

  let weightings: Record<string, Record<string, number>> = {};

  await Promise.all(
    languages.map(async function (filename) {
      const content = await fs.readFile(
        path.join(directoryPath, filename),
        'utf-8',
      );

      const languageMatch = filename.match(/unigrams-(\w+)\.txt/);
      if (!languageMatch) {
        return;
      }

      const language = languageMatch[1];

      let total = 0;
      const data = content
        .trim()
        .split('\n')
        .map((s) => {
          const [char, countString] = s.split(' ');
          const count = parseInt(countString, 10);

          total = total + count;

          return {
            char,
            count,
          };
        })
        .map(({ char, count }) => [
          char,
          parseFloat((count / total).toFixed(4)),
        ])
        .filter((w) => w[1] > 0);

      weightings[language] = Object.fromEntries(data);
    }),
  );

  await fs.writeFile(
    path.join(__dirname, '../src/weightings.json'),
    `${JSON.stringify(sortKeys(weightings), null, 2)}\n`,
    'utf-8',
  );
})();
