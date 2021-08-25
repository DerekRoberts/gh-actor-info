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
  email: string;
  name: string;
}

// Create user from instance
const user: User = {
  email: '',
  name: '',
};

// Unauthenticated GitHub API call for public info
export async function getPublicInfo(actor: string): Promise<User> {
  await axios
    .get(`https://api.github.com/users/${actor}`)
    .then(function (response) {
      (user.email = response.data.email), (user.name = response.data.name);
    })
    .catch(function (error) {
      console.log(error.response.status, '-', error.response.statusText);
      console.log('https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting');
    });
  return user;
}

// Scrub public events - useful if email not published
export async function getCommitAuthor(actor: string): Promise<User> {
  return axios
    .get(`https://api.github.com/users/${actor}/events/public`)
    .then(function (response) {
      const userObj = response.data[0].payload.commits[0].author;
      return userObj;
    })
    .catch(function (error) {
      throw new Error(error.response.header);
    });
}

// console.log(await getPublicInfo(ghActor));
console.log(await getCommitAuthor(ghActor));
