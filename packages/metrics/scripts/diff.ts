import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

interface FontMetrics {
  familyName: string;
  variants: Record<string, unknown>;
}

const scriptsDir = path.join(__dirname);

const currentFonts: FontMetrics[] = JSON.parse(
  fs.readFileSync(path.join(scriptsDir, 'googleFonts.json'), 'utf-8'),
);

const previousFonts: FontMetrics[] = JSON.parse(
  execSync('git show HEAD:packages/metrics/scripts/googleFonts.json', {
    encoding: 'utf-8',
    maxBuffer: 100 * 1024 * 1024,
  }),
);

const previousByName = new Map(
  previousFonts.map((f) => [f.familyName, JSON.stringify(f.variants)]),
);
const currentByName = new Map(
  currentFonts.map((f) => [f.familyName, JSON.stringify(f.variants)]),
);

const newFonts: string[] = [];
const updatedFonts: string[] = [];
const removedFonts: string[] = [];

for (const name of currentByName.keys()) {
  if (!previousByName.has(name)) {
    newFonts.push(name);
  } else if (previousByName.get(name) !== currentByName.get(name)) {
    updatedFonts.push(name);
  }
}

for (const name of previousByName.keys()) {
  if (!currentByName.has(name)) {
    removedFonts.push(name);
  }
}

const sections: string[] = [];

if (newFonts.length > 0) {
  sections.push(
    `### New\n${newFonts
      .sort()
      .map((f) => `- ${f}`)
      .join('\n')}`,
  );
}
if (updatedFonts.length > 0) {
  sections.push(
    `### Updated\n${updatedFonts
      .sort()
      .map((f) => `- ${f}`)
      .join('\n')}`,
  );
}
if (removedFonts.length > 0) {
  sections.push(
    `### Removed\n${removedFonts
      .sort()
      .map((f) => `- ${f}`)
      .join('\n')}`,
  );
}

if (sections.length > 0) {
  console.log(sections.join('\n\n'));
}
