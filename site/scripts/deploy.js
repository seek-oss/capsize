import assert from 'node:assert';
import path from 'node:path';
import process from 'node:process';
import ghpages from 'gh-pages';
import repoPkg from '../../package.json' assert { type: 'json' };

const repoUrl = repoPkg.repository.url;
const args = process.argv.slice(1);
const basePath = args[args.indexOf('-p') + 1];

assert(
  args.indexOf('-p') > -1 && basePath,
  `Must provide a path: ${args[0]} -p <path>`,
);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const tokenRegex = GITHUB_TOKEN ? new RegExp(GITHUB_TOKEN, 'g') : null;

const log = function (message) {
  // eslint-disable-next-line no-console
  console.log(
    tokenRegex ? message.replace(tokenRegex, '[GITHUB_TOKEN]') : message,
  );
};

const makeConfig = function () {
  return {
    repo: GITHUB_TOKEN
      ? repoUrl.replace('https://', `https://${GITHUB_TOKEN}@`)
      : repoUrl,
    logger: log,
  };
};

ghpages.publish(basePath, makeConfig(), function (err) {
  if (err) {
    log('Deployment error');
    log(JSON.stringify(err));
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  } else {
    log('Deployment complete!');
  }
});
