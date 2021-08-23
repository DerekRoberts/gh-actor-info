/* eslint-disable no-console */
const ghActor: string = process.argv[2] || '';

if (!ghActor) {
  console.error('\nPlease provide a username');
  console.error(' e.g.: ./lib/index.js --username=octocat');
  process.exit(1);
}

interface User {
  actor: string;
  email: string;
  name: string;
}

const user: User = {
  actor: ghActor,
  email: 'first.last@gov.bc.ca',
  name: 'First Last',
};

console.log(user);
