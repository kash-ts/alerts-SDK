<div align="center">
    <a href="https://www.donationalerts.com/apidoc"><img src="./readme/donationAlerts.png" alt="Donation Alerts Logo" width="400"></a>
</div>

<div align="center">

# DonationAlerts SDK
A library for seamless integration with the DonationAlerts API. It provides a comprehensive set of tools for authorization, user token management, retrieving account data, and handling various other API interactions.


<p></p>

[![npm version](https://img.shields.io/npm/v/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts)
[![npm downloads](https://img.shields.io/npm/dm/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@kash-88/alerts&query=$.install.pretty&label=install%20size&style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts)
[![GitHub User's stars](https://img.shields.io/github/stars/kash-ts/alerts-SDK)](https://github.com/kash-ts/alerts-SDK)

</div>

## Installation

```bash
$ npm install @kash-88/alerts
```

## Available functions (methods)
| Function                                              | Purpose                                          |
|-------------------------------------------------------|--------------------------------------------------|
| [getAuthorizeLink](#getAuthorizeLink)                 | Generate OAuth authorization link.               |
| [getOauthToken](#getOauthToken)                       | Exchange code for oauth token and refresh_token. |
| [updateOauthToken](#updateOauthToken)                 | Refresh oauth token using refresh token.         |
| [getUser](#getUser)                                   | Fetch user profile by oauth token.               |
| [getUserChannel](#getUserChannel)                     | Get user channel by id.                          |
| [getPrivateToken](#getPrivateToken)                   | Get private token for channel subscription.      |
| [getDonationsAlerts](#getDonationsAlerts)             | Fetch user donation alerts list.                 |
| [getExternal](#getExternal)                           | Generate random external ID.                     |
| [createCustomAlerts](#createCustomAlerts)             | Send a custom alert to the authorized user.      |
| [generateSignature](#generateSignature)               | Generate SHA256 request signature.               |
| [createMerchandise](#createMerchandise)               | Create a new merchandise.                        |
| [updateMerchandise](#updateMerchandise)               | Update an existing merchandise.                  |
| [updateOrCreateMerchandise](#updateOrCreateMerchandise) | Update or create a merchandise.                |
| [getUserDataFromPromocode](#getUserDataFromPromocode) | Get user ID from an advertising promocode.       |
| [sendSaleAlert](#sendSaleAlert)                       | Send a merchandise sale alert.                   |
| [WebServer](#WebServer)                               | WebSocket client for Centrifugo.                 |

---

## createCustomAlerts (Async)
**Purpose:** Отправка кастомного оповещения для пользователя

- **Params:**
  - `access_token: string` — User access token
  - `external_id: string` — Unique alert identifier (up to 32 characters)
  - `header: string` — Alert title (up to 255 characters)
  - `message: string` — Alert message (up to 300 characters)
  - `is_shown: 0 | 1` — Whether or not notifications will be displayed
  - `image_url?: string | null` — URL of the image that will be shown along with the notification
  - `sound_url?: string | null` — URL of the sound that will be played along with notifications
- **Endpoint:** https://www.donationalerts.com/api/v1/custom_alert
- **API Docs:** [Send Custom Alerts](https://www.donationalerts.com/apidoc#api_v1__custom_alerts__send_custom_alerts)

**Example:**
```js
/**
 * Notes:
 * - You can generate external_id using the getExternal() function.
 */

import { createCustomAlerts, getExternal } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";
const external_id = getExternal();
const header = "Header alerts";
const message = "Message alerts";
const is_shown = 1;
const image_url = null;
const sound_url = null;

(async () => {
    try {
        const token = await createCustomAlerts(access_token, external_id, header, message, is_shown, image_url, sound_url);
        console.log("Result:", token);
    } catch (error) {
        console.error("Error:", error.message);
    }
})(); 
```

---

## getAuthorizeLink (Sync)
**Purpose:** Generate OAuth authorization link for DonationAlerts.

- **Params:**
  - `client_id: string` — Your client (application) ID
  - `redirect_uri: string` — The URL where users will be sent after authorization
  - `scopes: OAuthScope[]` — Array of access scopes
  - `type: "code" | "token"` — Type response oauth token
- **Endpoint:** https://www.donationalerts.com/oauth/authorize
- **API Docs:** [Authorization Request](https://www.donationalerts.com/apidoc#authorization__authorization_code__authorization_request)

**Example:**
```js
/**
 * Notes:
 * - You can get CLIENT_ID at https://www.donationalerts.com/application/clients.
 * - You can find the list of scopes at https://www.donationalerts.com/apidoc#authorization__scopes.
 */

import { getAuthorizeLink, OAuthScope } from "@kash-88/alerts";

const client_id = "CLIENT_ID";
const redirect_uri = "https://example.com/callback";
const scopes = [OAuthScope.UserShow];
const type = "code"; // Or "token"

const link = getAuthorizeLink(client_id, redirect_uri, scopes, type);
console.log("Authorize link:", link); 
```

---

## getOauthToken (Async)
**Purpose:** Exchange Authorization code for OAuth token and Refresh token.

- **Params:**
  - `client_id: string` — Your client (application) ID
  - `client_secret: string` — Your client (application) secret
  - `redirect_uri: string` — The URL where users will be sent after authorization
  - `code: string` — User authorization code
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **API Docs:** [Getting Access Token](https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token)

**Example:**
```js
/**
 * Notes:
 * - You can get CLIENT_ID and CLIENT_TOKEN at https://www.donationalerts.com/application/clients.
 * - USER_CODE is the authorization code returned after the user authorizes your app via the link from getAuthorizeLink() with type="code".
 */

import { getOauthToken } from "@kash-88/alerts";

const client_id = "CLIENT_ID";
const client_secret = "CLIENT_SECRET";
const redirect_uri = "https://example.com/callback";
const code = "USER_CODE";

(async () => {
    try {
        const token = await getOauthToken(client_id, client_secret, redirect_uri, code);
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
  - `access_token: string` — User access token
- **Endpoint:** https://www.donationalerts.com/api/v1/centrifuge/subscribe
- **API Docs:** —

**Example:**
```js
/**
 * Notes:
 * - This function is intended to be used together with WebSocket.
 * - You can get USER_CHANNEL using getUserChannel().
 * - You receive client ID when you establish the WebSocket connection.
 * - You can obtain the user access_token using getOauthToken().
 */

import { getPrivateToken } from "@kash-88/alerts";

const channel = "USER_CHANNEL";
const client = "UUIDv4_CLIENT_ID";
const access_token = "ACCESS_TOKEN";

(async () => {
    try {
        const token = await getPrivateToken(channel, client, access_token);
        console.log("Private token:", token);
    } catch (error) {
        console.error("Error getting private token:", error.message);
    }
})();
```

---

## getUser (Async)
**Purpose:** Fetch user profile information by OAuth token.

- **Params:**
  - `access_token: string` — User access token
- **Endpoint:** https://www.donationalerts.com/api/v1/user/oauth
- **API Docs:** [User Info](https://www.donationalerts.com/apidoc#api_v1__users)

**Example:**
```js
/**
 * Notes:
 * - You can obtain ACCESS_TOKEN by calling getOauthToken() after the user authorizes your app.
 */

import { getUser } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";

(async () => {
    try {
        const user = await getUser(access_token);
        console.log("User data:", user);
    } catch (error) {
        console.error("Error:", error.message);
    }
})(); 
```

---

## getUserChannel (Sync)
**Purpose:** Get user channel by user id for WebSocket.

- **Params:**
  - `user_id: string | number` — User ID
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

## updateOauthToken (Async)
**Purpose:** Refresh Access token using Refresh token.

- **Params:**
  - `client_id: string` — Your client (application) ID
  - `client_token: string` — Your client (application) token
  - `refresh_token: string` — User refresh token
  - `scopes: OAuthScope[]` — Array of access scopes
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **API Docs:** [Refreshing Access Tokens](https://www.donationalerts.com/apidoc#authorization__authorization_code__refreshing_access_tokens)

**Example:**
```js
/**
 * Notes:
 * - You can get CLIENT_ID and CLIENT_TOKEN at https://www.donationalerts.com/application/clients.
 * - You can obtain REFRESH_TOKEN from the response of getOauthToken().
 */

import { updateOauthToken, OAuthScope } from "@kash-88/alerts";

const client_id = "CLIENT_ID";
const client_token = "CLIENT_TOKEN";
const refresh_token = "REFRESH_TOKEN";
const scopes = [OAuthScope.UserShow, OAuthScope.DonationSubscribe];

(async () => {
    try {
        const token = await updateOauthToken(client_id, client_token, refresh_token, scopes);
        console.log("Oauth token:", token);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## getDonationsAlerts (Async)
**Purpose:** Fetch user donation alerts list.

- **Params:**
  - `access_token: string` — User access token
  - `page?: number | string` — Page number for pagination (default: 1)
- **Endpoint:** https://www.donationalerts.com/api/v1/alerts/donations
- **API Docs:** [Donation Alerts List](https://www.donationalerts.com/apidoc#api_v1__donations__donation_alerts_list)

**Example:**
```js
import { getDonationsAlerts } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";

(async () => {
    try {
        const donations = await getDonationsAlerts(access_token, 1);
        console.log("Donations:", donations);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## getExternal (Sync)
**Purpose:** Generate a random 32-character external ID.

- **Params:** None
- **Returns:** `string` — 32 random alphanumeric characters

**Example:**
```js
import { getExternal } from "@kash-88/alerts";

const external_id = getExternal();
console.log("External ID:", external_id);
```

---

## generateSignature (Sync)
**Purpose:** Generate a SHA256 request signature for Merchandise API.

- **Params:**
  - `params: Record<string, string | number>` — Request parameters
  - `client_secret: string` — API client secret key
- **Returns:** `string` — SHA256 hex digest signature
- **API Docs:** [Request Signatures](https://www.donationalerts.com/apidoc#introduction__http_api_requests__request_signatures)

**Example:**
```js
import { generateSignature } from "@kash-88/alerts";

const params = { foo: "xyz", bar: "abc" };
const client_secret = "CLIENT_SECRET";
const signature = generateSignature(params, client_secret);
console.log("Signature:", signature);
```

---

## createMerchandise (Async)
**Purpose:** Create a new merchandise.

- **Params:**
  - `access_token: string` — User access token
  - `client_secret: string` — API client secret key for signature
  - `merchant_identifier: string` — Merchant's ID on DonationAlerts
  - `merchandise_identifier: string` — Up to 16 characters long unique merchandise ID
  - `title: Record<string, string>` — Object with merchandise titles in different locales (en_US required)
  - `currency: string` — Currency code (EUR, USD, RUB, BRL, TRY)
  - `price_user: number` — Revenue added to streamer for each sale
  - `price_service: number` — Revenue added to DonationAlerts for each sale
  - `is_active?: number` — 0 or 1 (default: 0)
  - `is_percentage?: number` — 0 or 1 (default: 0)
  - `url?: string` — URL to merchandise's web page
  - `img_url?: string` — URL to merchandise's image
  - `end_at_ts?: number` — Unix timestamp when merchandise becomes inactive
- **Endpoint:** https://www.donationalerts.com/api/v1/merchandise
- **API Docs:** [Create Merchandise](https://www.donationalerts.com/apidoc#api_v1__merchandises__create_merchandise)

**Example:**
```js
import { createMerchandise } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";
const client_secret = "CLIENT_SECRET";

(async () => {
    try {
        const merchandise = await createMerchandise(
            access_token,
            client_secret,
            "MERCHANT_ID",
            "MERCH_ID",
            { en_US: "Product Name", ru_RU: "Название товара" },
            "USD",
            30,
            15,
            1,
            0,
            "https://example.com/product",
            "https://example.com/image.png"
        );
        console.log("Merchandise:", merchandise);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## updateMerchandise (Async)
**Purpose:** Update an existing merchandise by its DonationAlerts ID.

- **Params:**
  - `access_token: string` — User access token
  - `client_secret: string` — API client secret key for signature
  - `merchandise_id: number` — Unique merchandise ID on DonationAlerts
  - `title: Record<string, string>` — Object with merchandise titles in different locales (en_US required)
  - `currency: string` — Currency code (EUR, USD, RUB, BRL, TRY)
  - `price_user: number` — Revenue added to streamer for each sale
  - `price_service: number` — Revenue added to DonationAlerts for each sale
  - `is_active?: number` — 0 or 1 (default: 0)
  - `is_percentage?: number` — 0 or 1 (default: 0)
  - `url?: string` — URL to merchandise's web page
  - `img_url?: string` — URL to merchandise's image
  - `end_at_ts?: number` — Unix timestamp when merchandise becomes inactive
- **Endpoint:** https://www.donationalerts.com/api/v1/merchandise/{id}
- **API Docs:** [Update Merchandise](https://www.donationalerts.com/apidoc#api_v1__merchandises__update_merchandise)

**Example:**
```js
import { updateMerchandise } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";
const client_secret = "CLIENT_SECRET";

(async () => {
    try {
        const merchandise = await updateMerchandise(
            access_token,
            client_secret,
            3,
            { en_US: "Updated Product", ru_RU: "Обновлённый товар" },
            "USD",
            35,
            15,
            1
        );
        console.log("Updated merchandise:", merchandise);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## updateOrCreateMerchandise (Async)
**Purpose:** Update or create a merchandise by merchant and merchandise identifiers.

- **Params:**
  - `access_token: string` — User access token
  - `client_secret: string` — API client secret key for signature
  - `merchant_identifier: string` — Merchant's ID on DonationAlerts
  - `merchandise_identifier: string` — Up to 16 characters long unique merchandise ID
  - `title: Record<string, string>` — Object with merchandise titles in different locales (en_US required)
  - `currency: string` — Currency code (EUR, USD, RUB, BRL, TRY)
  - `price_user: number` — Revenue added to streamer for each sale
  - `price_service: number` — Revenue added to DonationAlerts for each sale
  - `is_active?: number` — 0 or 1 (default: 0)
  - `is_percentage?: number` — 0 or 1 (default: 0)
  - `url?: string` — URL to merchandise's web page
  - `img_url?: string` — URL to merchandise's image
  - `end_at_ts?: number` — Unix timestamp when merchandise becomes inactive
- **Endpoint:** https://www.donationalerts.com/api/v1/merchandise/{merchant}/{merch_id}
- **API Docs:** [Update or Create Merchandise](https://www.donationalerts.com/apidoc#api_v1__merchandises__update_or_create_merchandise)

**Example:**
```js
import { updateOrCreateMerchandise } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";
const client_secret = "CLIENT_SECRET";

(async () => {
    try {
        const merchandise = await updateOrCreateMerchandise(
            access_token,
            client_secret,
            "MERCHANT_ID",
            "MERCH_ID",
            { en_US: "Product Name" },
            "USD",
            30,
            15,
            1
        );
        console.log("Merchandise:", merchandise);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## getUserDataFromPromocode (Async)
**Purpose:** Get user ID from an advertising promocode.

- **Params:**
  - `access_token: string` — User access token
  - `client_secret: string` — API client secret key for signature
  - `promocode: string` — User promocode
- **Endpoint:** https://www.donationalerts.com/api/v1/merchandise/user
- **API Docs:** [Get User Data from Promocode](https://www.donationalerts.com/apidoc#api_v1__merchandises__update_or_create_merchandise__get_user_data_from_promocode)

**Example:**
```js
import { getUserDataFromPromocode } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";
const client_secret = "CLIENT_SECRET";

(async () => {
    try {
        const userId = await getUserDataFromPromocode(access_token, client_secret, "test123");
        console.log("User ID:", userId);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## sendSaleAlert (Async)
**Purpose:** Send a merchandise sale alert.

- **Params:**
  - `access_token: string` — User access token
  - `client_secret: string` — API client secret key for signature
  - `user_id: number` — DonationAlerts user ID to which the sale is referenced
  - `external_id: string` — Up to 32 characters long unique sale ID
  - `merchant_identifier: string` — Merchant's ID on DonationAlerts
  - `merchandise_identifier: string` — Merchant's merchandise ID that was bought
  - `amount: number` — Grand total of the sale
  - `currency: string` — Currency code (EUR, USD, RUB, BRL, TRY)
  - `bought_amount?: number` — Total number of bought items (default: 1)
  - `username?: string` — Name of the customer
  - `message?: string` — Message sent by the customer
- **Endpoint:** https://www.donationalerts.com/api/v1/merchandise_sale
- **API Docs:** [Send Sale Alerts](https://www.donationalerts.com/apidoc#api_v1__merchandise_sale_notifications__send_sale_alerts)

**Example:**
```js
import { sendSaleAlert, getExternal } from "@kash-88/alerts";

const access_token = "ACCESS_TOKEN";
const client_secret = "CLIENT_SECRET";

(async () => {
    try {
        const sale = await sendSaleAlert(
            access_token,
            client_secret,
            3,
            getExternal(),
            "MERCHANT_ID",
            "MERCH_ID",
            100,
            "RUB",
            2,
            "John",
            "Test message"
        );
        console.log("Sale alert:", sale);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();
```

---

## WebServer (CentrifugeClient)
**Purpose:** WebSocket client for real-time donation alerts via Centrifugo.

- **Constructor params:**
  - `access_token: string` — User access token
  - `channels?: string[]` — Custom channels to subscribe to (defaults to donation channel)
  - `autoReconnect?: boolean` — Automatically reconnect on connection close (default: false)
- **Events:**
  - `open` — Connection opened
  - `message` — Message received from server
  - `close` — Connection closed (code, reason)
  - `error` — Error occurred
  - `reconnect` — Reconnecting after disconnection
- **Methods:**
  - `authorization()` — Authorize and subscribe to channels (call after `open` event)
  - `createNewConnection()` — Create a new WebSocket connection
  - `sendMessage(message: string)` — Send a message through the WebSocket
- **Endpoint:** wss://centrifugo.donationalerts.com/connection/websocket
- **API Docs:** [Centrifugo](https://www.donationalerts.com/apidoc#centrifugo)

**Example:**
```js
import { WebServer, OAuthScope, getUserChannel } from "@kash-88/alerts";

const ws = new WebServer({
    access_token: "ACCESS_TOKEN",
    autoReconnect: true
});

ws.on("open", async () => {
    console.log("WebSocket connected");
    await ws.authorization();
});

ws.on("message", (data) => {
    console.log("Message:", data);
});

ws.on("close", (code, reason) => {
    console.log(`Closed: ${code} ${reason}`);
});

ws.on("error", (error) => {
    console.error("Error:", error);
});

ws.on("reconnect", () => {
    console.log("Reconnecting...");
});
```