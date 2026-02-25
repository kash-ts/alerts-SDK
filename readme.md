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
| [getAuthorizeLink](#getAuthorizeLink)   | Generate OAuth authorization link                            |
| [getOauthToken](#getOauthToken)         | Exchange code for access_token and refresh_token             |
| [getUser](#getUser)                     | Fetch user profile by access_token                           |
| [getUserChannel](#getUserChannel)       | Get user channel by user_id                                  |
| [updateAccessToken](#updateAccessToken) | Refresh access_token using refresh_token                     |
| [getPrivateToken](#getPrivateToken)     | Get private token for channel subscription                   |

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
 * Note:
 * You can get the CLIENT_ID in https://www.donationalerts.com/application/clients
 * You can find the SCOPE list in https://www.donationalerts.com/apidoc#authorization__scopes
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

## getOauthToken
**Purpose:** Exchange authorization code for access_token and refresh_token. **Async**

- **Params:**
  - `client_id: string` — Your client (application) ID
  - `client_secret: string` — Your app client secret
  - `code: string` — User authorization code
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **API Docs:** [Getting Access Token](https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token)

**Example:**
```js
/**
 * Note:
 * You can get the CLIENT_ID and CLIENT_SERCET (Token) in https://www.donationalerts.com/application/clients
 * USER_CODE is the user token after authorization, use getAuthorizeLink() to get the authorization link.
 */

import { getOauthToken } from "@kash-88/alerts";

const client_id = "CLIENT_ID";
const client_secret = process.env.CLIENT_SECRET!;
const code = "USER_CODE";

(async () => {
    try {
        const token = await getOauthToken({ client_id, client_secret, code });
        console.log("Oauth token:", token);
    } catch (error) {
        console.error("Error:", error.message);
    }
})(); 
```

---

## getUser
**Purpose:** Fetch user profile information by access_token. **Async**

- **Params:**
  - `access_token: string` — User's oauth token
- **Endpoint:** https://www.donationalerts.com/api/v1/user/oauth
- **API Docs:** [User Info](https://www.donationalerts.com/apidoc#api_v1__users)

**Example:**
```js
/**
 * Note:
 * You can get the user OAUTH_TOKEN after the user logs in via getOauthToken(), and then use getOauthToken() to get an oauth token!
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

## getUserChannel
**Purpose:** Get user channel by user_id. **Sync**

- **Params:**
  - `user_id: string` — User ID
- **Endpoint:** —
- **API Docs:** —

**Example:**
```js
import { getUserChannel } from "@kash-88/alerts";

const user_id = "USER_ID";

const channel = getUserChannel(user_id);
console.log("User channel:", channel);
```

---

## updateAccessToken
**Purpose:** Refresh access_token using refresh_token. **Async**

- **Params:**
  - `client_id: string` — Your app's client ID
  - `client_secret: string` — Your app's client secret
  - `refresh_token: string` — Refresh token
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **API Docs:** [Refreshing Access Tokens](https://www.donationalerts.com/apidoc#authorization__authorization_code__refreshing_access_tokens)

**Example:**
```js
import "dotenv/config";
import { getOauthToken } from "@kash-88/alerts";

// Get on https://www.donationalerts.com/application/clients
const client_id = "YOUR_CLIENT_ID";
const client_secret = process.env.CLIENT_SECRET!;

const refresh_token = "USER_REFRESH_TOKEN";

(async () => {
    try {
        const token = await getOauthToken({ client_id, client_secret, refresh_token });
        console.log("Oauth token:", token);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## getPrivateToken (Async)
**Purpose:** Get a private token for subscribing to a DonationAlerts channel via Centrifuge.

- **Params:**
  - `channel: string` — Channel name to subscribe
  - `uuidv4_client_id: string` — UUID v4 client ID (used in WebSocket connection)
  - `access_token: string` — User's OAuth access token
- **Endpoint:** https://www.donationalerts.com/api/v1/centrifuge/subscribe
- **API Docs:** —

**Example:**
```js
import { getPrivateToken } from "@kash-88/alerts";

const channel = "USER_CHANNEL"; // Get via getUserChannel
const uuidv4_client_id = "UUIDv4_CLIENT_ID"; // WebSocket client UUID
const access_token = "USER_ACCESS_TOKEN";

(async () => {
    try {
        const token = await getPrivateToken({ channel, uuidv4_client_id, access_token });
        console.log("Private token:", token);
    } catch (error) {
        console.error("Error getting private token:", error.message);
    }
})();