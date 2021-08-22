const fs = require('fs').promises;
const path = require('path');

(async () => {
  await fs.copyFile(
    path.join(__dirname, '../README.md'),
    path.join('packages/core', 'README.md'),
  );
})();
