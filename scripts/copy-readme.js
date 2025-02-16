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

  // Rewrite all occurences of `packages/EXISTING_PACKAGE/` to relative path
  const packages = await fs.readdir(path.join(sourceDir, 'packages'));
  const regExp = new RegExp(`packages\/(${packages.join('|')})\/`, 'g');
  const transformed = content.replace(
    regExp,
    (match) => `${relativePath}/${match}`,
  );

  await fs.writeFile(path.join(targetDir, 'README.md'), transformed);
})();
