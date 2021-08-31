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

// Error handler
interface errorResponse {
  response: Record<string, unknown>;
}
const link403 = 'https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting';
function errorOr403(error: errorResponse): User {
  if (error?.response?.status === '403') {
    console.error(`403 - ${link403}`);
    return {
      email: '',
      name: '',
    } as User;
  } else {
    throw new Error(JSON.stringify(error));
  }
}

// Unauthenticated GitHub API call for public info
export async function getFromPublished(actor: string): Promise<User> {
  return await axios
    .get(`https://api.github.com/users/${actor}`)
    .then((response) => {
      return {
        email: response.data.email || '',
        name: response.data.name,
      } as User;
    })
    .catch((error) => {
      return errorOr403(error) as User;
    });
}

// Unauthenticated GitHub API call for public commits
export async function getFromCommits(actor: string): Promise<User> {
  return await axios
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
        return {
          email: filt[0].email || '',
          name: filt[0].name,
        } as User;
      } else {
        return getFromPublished(actor);
      }
    })
    .catch((error) => {
      return errorOr403(error) as User;
    });
}

console.log(JSON.stringify(await getFromCommits(ghActor)));
