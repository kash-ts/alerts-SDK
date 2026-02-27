<div align="center">

# DonationAlerts API
A lightweight library for easy integration with the DonationAlerts API: authorization, token management, and user info in a few lines.

[![npm version](https://img.shields.io/npm/v/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts/v/latest)
[![npm downloads](https://img.shields.io/npm/dm/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts/v/latests)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@kash-88/alerts&query=$.install.pretty&label=install%20size&style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts/v/latest)

</div>

Available in: [RU](https://github.com/kash-88/alerts-SDK/blob/main/readme-ru.md), **EN**

## Installation
Using npm:

```bash
$ npm install @kash-88/alerts
```

Using yarn:

```bash
$ yarn add @kash-88/alerts
```

Using pnpm:

```bash
$ pnpm add @kash-88/alerts
```

Using bun:

```bash
$ bun add @kash-88/alerts
```

## Available Methods (Quick Overview)
| Function            | Purpose                                                      |
|---------------------|--------------------------------------------------------------|
| getAuthorizeLink    | Generate OAuth authorization link                            |
| getOauthToken       | Exchange code for access_token and refresh_token             |
| getUser             | Fetch user profile by access_token                           |
| getUserChannel      | Get user channel by user_id                                  |
| updateAccessToken   | Refresh access_token using refresh_token                     |
| getPrivateToken     | Get private token for channel subscription                   |

---

## getAuthorizeLink (Sync)
**Purpose:** Generate OAuth authorization link for DonationAlerts.

- **Params:**
  - `client_id: string` — Your app"s client ID
  - `scope: string[]` — Array of access scopes
- **Endpoint:** https://www.donationalerts.com/oauth/authorize
- **API Docs:** [Authorization Request](https://www.donationalerts.com/apidoc#authorization__authorization_code__authorization_request)

**Example:**
```js
import { getAuthorizeLink } from "@kash-88/alerts";

const client_id = "YOUR_CLIENT_ID"; // Get on https://www.donationalerts.com/application/clients
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
**Purpose:** Exchange authorization code for access_token and refresh_token.

- **Params:**
  - `client_id: string` — Your app's client ID
  - `client_secret: string` — Your app's client secret
  - `code: string` — Authorization code
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **API Docs:** [Getting Access Token](https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token)

**Example:**
```js
import { getOauthToken } from "@kash-88/alerts";

// Get on https://www.donationalerts.com/application/clients
const client_id = "YOUR_CLIENT_ID";
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

## getUser (Async)
**Purpose:** Fetch user profile information by access_token.

- **Params:**
  - `access_token: string` — User's access token
- **Endpoint:** https://www.donationalerts.com/api/v1/user/oauth
- **API Docs:** [User Info](https://www.donationalerts.com/apidoc#api_v1__users)

**Example:**
```js
import { getUser } from "@kash-88/alerts";

const user_access_token = "USER_ACCESS_TOKEN";

(async () => {
    try {
        const user = await getUser(user_access_token);
        console.log("User data:", user);
    } catch (error) {
        console.error("Error:", error.message);
    }
})(); 
```

---

## getUserChannel (Sync)
**Purpose:** Get user channel by user_id.

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

## updateAccessToken (Async)
**Purpose:** Refresh access_token using refresh_token.

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