// Axios
import axios from 'axios';

// User interface
interface User {
  email: string;
  name: string;
}

function user(name?: string, email?: string): User {
  return {
    name: name || '',
    email: email || '',
  } as User;
}

// Error handler
function errorOr403(error: Record<string, Record<string, unknown>>): User {
  const link403 = 'https://docs.github.com/en/rest/overview/resources-in-the-rest-api#rate-limiting';
  if (error?.response?.status === '403') {
    console.error(`403 - ${link403}`);
    return user();
  } else {
    throw new Error(JSON.stringify(error));
  }
}

// Unauthenticated GitHub API call for public info
export async function getFromPublished(actor: string): Promise<User> {
  return await axios
    .get(`https://api.github.com/users/${actor}`)
    .then((response) => {
      return user(response.data.name, response.data.user);
    })
    .catch((error) => {
      return errorOr403(error);
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
        return user(filt[0].name, filt[0].email);
      } else {
        return getFromPublished(actor);
      }
    })
    .catch((error) => {
      return errorOr403(error) as User;
    });
}
