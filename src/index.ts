/* eslint-disable no-console */

// Axios client
import axios from 'axios';

// Verify input
const ghActor: string = process.argv[2] || '';
if (!ghActor) {
  console.error('\nPlease provide a username');
  console.error(' e.g.: ./lib/index.js --username=octocat');
  process.exit(1);
}

// User interface
interface User {
  actor: string;
  email: string;
  name: string;
}

// Create user from instance
const user: User = {
  actor: ghActor,
  email: '',
  name: '',
};

// Unauthenticated GitHub API call
axios
  .get(`https://api.github.com/users/${ghActor}`)
  .then(function (response) {
    (user.email = response.data.email), (user.name = response.data.name);
    console.log(user);
  })
  .catch(function (error) {
    console.log(error.response.status);
    console.log(error.response.statusText);
    console.log('https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting');
  });

console.log(user);
