import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

(async () => {
  if (!process.env.GOOGLE_FONTS_API_KEY) {
    console.error(
      '🚨 Missing GOOGLE_FONTS_API_KEY environment variable. This is required to update the Google Font data.',
    );

    process.exitCode = 1;

    return;
  }

  const response = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONTS_API_KEY}`,
  );
  const data = await response.json();

  await fs.writeFile(
    path.join(__dirname, 'googleFontsApi.json'),
    JSON.stringify(data, null, 2),
    'utf-8',
  );

  console.log('✅ Complete');
})();
