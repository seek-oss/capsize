const fs = require('fs').promises;
const path = require('path');

// Copy README.md from root to packages/core and rewrite relative links
(async () => {
  const sourceDir = path.join(__dirname, '..');
  const targetDir = path.join(__dirname, '../packages/core');
  const relativePath = path.relative(targetDir, sourceDir);
  const content = await fs.readFile(path.join(sourceDir, 'README.md'), {
    encoding: 'utf-8',
  });

  // Assume that everything not starting with # or http(s): is a relative link
  const transformed = content.replace(
    /]\((?!(#|https?:))/g,
    `](${relativePath}/`,
  );

  await fs.writeFile(path.join(targetDir, 'README.md'), transformed);
})();
