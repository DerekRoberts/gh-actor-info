/* eslint-disable no-console */

import { getFromCommits } from './index.js';

// Verify input
const ghActor: string = process.argv[2] || '';
if (!ghActor) {
  console.error('\nPlease provide a username');
  console.error(' e.g.: ./dist/index.js octocat');
  process.exit(1);
}
console.log(JSON.stringify(await getFromCommits(ghActor)));
