/* eslint-disable no-console */
// Axios client
import axios from 'axios';

// Verify input
const ghActor: string = process.argv[2] || '';
if (!ghActor) {
  console.error('\nPlease provide a username');
  console.error(' e.g.: ./dist/index.js octocat');
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
export async function getFromPublished(actor: string): Promise<User> {
  await axios
    .get(`https://api.github.com/users/${actor}`)
    .then((response) => {
      user.email = response.data.email || '';
      user.name = response.data.name;
    })
    .catch((error) => {
      console.log(error?.response?.status, '-', error?.response?.statusText);
      console.log('https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting');
    });
  return user;
}

// Unauthenticated GitHub API call for public commits
export async function getFromCommits(actor: string): Promise<User> {
  await axios
    .get(`https://api.github.com/users/${actor}/events/public`)
    .then((response) => {
      const filt = response.data
        .filter(function (f: Record<string, unknown>) {
          return f.type === 'PushEvent';
        })
        .map(function (m: Record<string, Record<string, Record<string, unknown>[]>>) {
          return m.payload?.commits[0]?.author;
        });
      if (filt[0]) {
        user.email = filt[0].email;
        user.name = filt[0].name;
      } else {
        return getFromPublished(actor);
      }
    })
    .catch((error) => {
      console.log(error?.response?.status, '-', error?.response?.statusText);
      console.log('https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting');
    });
  return user;
}

console.log(JSON.stringify(await getFromCommits(ghActor)));
