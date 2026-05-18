import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { computeDiff } from './diff';

const { newFonts, removedFonts, summary } = computeDiff();

if (!summary) {
  process.exit(0);
}

const versionIncrement =
  removedFonts.length > 0 ? 'major' : newFonts.length > 0 ? 'minor' : 'patch';

const monthYear = new Date().toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
});

const breakingMessage =
  versionIncrement === 'major'
    ? `**BREAKING CHANGE:** ${removedFonts.length} font${removedFonts.length === 1 ? ' was' : 's were'} removed due to no longer being available in the Google Fonts library (see list below).`
    : '';

const title = `Update Google Fonts — ${monthYear}`;

const frontMatter = [
  '---',
  `'@capsizecss/metrics': ${versionIncrement}`,
  '---',
  '',
].join('\n');

const description = [title, breakingMessage, summary].join('\n\n');

const shortHash = execSync('git rev-parse --short HEAD', {
  encoding: 'utf-8',
}).trim();
const changesetPath = path.resolve(
  `../../.changeset/update-google-fonts-${shortHash}.md`,
);
fs.writeFileSync(changesetPath, `${frontMatter}${description}\n`);

console.log(changesetPath); // Read by CI to populate the body of the PR
