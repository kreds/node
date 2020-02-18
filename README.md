# Kreds

node.js library for the [Kreds API](https://github.com/kreds/api). Built with TypeScript.

## Installation

The library is available on [npm](https://www.npmjs.com/package/kreds), you can install it with either npm or yarn:

```sh
npm install kreds
# or:
yarn install kreds
```

## Example usage

```ts
import Kreds from 'kreds';

const kreds = new Kreds({
    instanceUrl: 'https://auth.example.com',
    clientId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    clientSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    redirectUri: 'https://app.example.com/auth/callback',
});

const authorizeUrl = kreds.authorizeUrl('state');

// Then, after redirection
// Check if 'state' from query parameters is equal to the state provided to the authorizeUrl call.
// Check if 'error' is empty, and then call getToken with the code if everything is fine.

try {
    const { accessToken, refreshToken } = await kreds.authorizationCodeGrant('code');
} catch (e) {
    // Make sure to handle the exception.
}
```