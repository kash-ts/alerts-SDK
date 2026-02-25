<div align="center">
    <img src="./readme/donationAlerts.png" alt="Donation Alerts Logo" width="400">
</div>

<div align="center">

# DonationAlerts SDK
A library for seamless integration with the DonationAlerts API. It provides a comprehensive set of tools for authorization, user token management, retrieving account data, and handling various other API interactions.

[![npm version](https://img.shields.io/npm/v/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts)
[![npm downloads](https://img.shields.io/npm/dm/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@kash-88/alerts&query=$.install.pretty&label=install%20size&style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts)
[![GitHub User's stars](https://img.shields.io/github/stars/kash-ts)](https://github.com/kash-ts)

</div>

## Installation
Using npm:

```bash
$ npm install @kash-88/alerts
```

Using yarn:

```bash
$ yarn add @kash-88/alerts
```

## Available functions (methods)
| Function                                | Purpose                                                      |
|-----------------------------------------|--------------------------------------------------------------|
| [getAuthorizeLink](#getAuthorizeLink)   | Generate OAuth authorization link.                            |
| [getOauthToken](#getOauthToken)         | Exchange code for oauth token and refresh_token.             |
| [getUser](#getUser)                     | Fetch user profile by oauth token.                           |
| [getUserChannel](#getUserChannel)       | Get user channel by user id.                                  |
| [updateAccessToken](#updateAccessToken) | Refresh oauth token using refresh token.                     |
| [getPrivateToken](#getPrivateToken)     | Get private token for channel subscription.                   |

---

## getAuthorizeLink **(Sync)**
**Purpose:** Generate OAuth authorization link for DonationAlerts.

- **Params:**
  - `client_id: string` — Your client (application) ID
  - `scope: string[]` — Array of access scopes
- **Endpoint:** https://www.donationalerts.com/oauth/authorize
- **API Docs:** [Authorization Request](https://www.donationalerts.com/apidoc#authorization__authorization_code__authorization_request)

**Example:**
```js
/**
 * Notes:
 * - You can get CLIENT_ID at https://www.donationalerts.com/application/clients.
 * - You can find the list of scopes at https://www.donationalerts.com/apidoc#authorization__scopes.
 */

import { getAuthorizeLink } from "@kash-88/alerts";

const client_id = "CLIENT_ID";
const scope = ["oauth-user-show"];

try {
    const link = getAuthorizeLink({ client_id, scope });
    console.log("Authorize link:", link);
} catch (error) {
    console.error("Error:", error.message);
} 
```

---

## getOauthToken (Async)
**Purpose:** Exchange authorization code for Oauth token and Refresh token.

- **Params:**
  - `client_id: string` — Your client (application) ID
  - `client_secret: string` — Your client (application) secret
  - `code: string` — User authorization code
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **API Docs:** [Getting Access Token](https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token)

**Example:**
```js
/**
 * Notes:
 * - You can get CLIENT_ID and CLIENT_TOKEN at https://www.donationalerts.com/application/clients.
 * - USER_CODE is the authorization code returned after the user authorizes your app via the link from getAuthorizeLink().
 */

import { getOauthToken } from "@kash-88/alerts";

const client_id = "CLIENT_ID";
const client_token = "CLIENT_TOKEN";
const code = "USER_CODE";

(async () => {
    try {
        const token = await getOauthToken({ client_id, client_token, code });
        console.log("Oauth token:", token);
    } catch (error) {
        console.error("Error:", error.message);
    }
})(); 
```

---

## getUser (Async)
**Purpose:** Fetch user profile information by Oauth token.

- **Params:**
  - `oauth_token: string` — User oauth token
- **Endpoint:** https://www.donationalerts.com/api/v1/user/oauth
- **API Docs:** [User Info](https://www.donationalerts.com/apidoc#api_v1__users)

**Example:**
```js
/**
 * Notes:
 * - You can obtain OAUTH_TOKEN by calling getOauthToken() after the user authorizes your app.
 */

import { getUser } from "@kash-88/alerts";

const oauth_token = "OAUTH_TOKEN";

(async () => {
    try {
        const user = await getUser(oauth_token);
        console.log("User data:", user);
    } catch (error) {
        console.error("Error:", error.message);
    }
})(); 
```

---

## getUserChannel (Sync)
**Purpose:** Get user channel by user id for websocket.

- **Params:**
  - `user_id: string` — User ID
- **Endpoint:** —
- **API Docs:** —

**Example:**
```js
/**
 * Notes:
 * - This function is intended to be used together with WebSocket.
 * - You can get USER_ID using getUser().
 */

import { getUserChannel } from "@kash-88/alerts";

const user_id = "USER_ID";

const channel = getUserChannel(user_id);
console.log("User channel:", channel);
```

---

## updateAccessToken (Async)
**Purpose:** Refresh Access token using Refresh token.

- **Params:**
  - `client_id: string` — Your client (application) ID
  - `client_token: string` — Your client (application) token
  - `refresh_token: string` — User refresh token
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **API Docs:** [Refreshing Access Tokens](https://www.donationalerts.com/apidoc#authorization__authorization_code__refreshing_access_tokens)

**Example:**
```js
/**
 * Notes:
 * - You can get CLIENT_ID and CLIENT_TOKEN at https://www.donationalerts.com/application/clients.
 * - You can obtain REFRESH_TOKEN from the response of getOauthToken().
 */

import { getOauthToken } from "@kash-88/alerts";

const client_id = "CLIENT_ID";
const client_token = "CLIENT_TOKEN";
const refresh_token = "REFRESH_TOKEN";

(async () => {
    try {
        const token = await getOauthToken({ client_id, client_token, refresh_token });
        console.log("Oauth token:", token);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## getPrivateToken (Async)
**Purpose:** Get a Private token for subscribing to a DonationAlerts channel via Centrifuge.

- **Params:**
  - `channel: string` — User channel
  - `uuidv4_client_id: string` — UUID v4 client ID
  - `oauth_token: string` — User OAuth token
- **Endpoint:** https://www.donationalerts.com/api/v1/centrifuge/subscribe
- **API Docs:** —

**Example:**
```js
/**
 * Notes:
 * - This function is intended to be used together with WebSocket.
 * - You can get USER_CHANNEL using getUserChannel().
 * - You receive uuidv4_client_id when you establish the WebSocket connection.
 * - You can obtain the user OAUTH_TOKEN using getOauthToken().
 */

import { getPrivateToken } from "@kash-88/alerts";

const channel = "USER_CHANNEL";
const uuidv4_client_id = "UUIDv4_CLIENT_ID";
const oauth_token = "OAUTH_TOKEN";

(async () => {
    try {
        const token = await getPrivateToken({ channel, uuidv4_client_id, oauth_token });
        console.log("Private token:", token);
    } catch (error) {
        console.error("Error getting private token:", error.message);
    }
})();