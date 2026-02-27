<div align="center">

# DonationAlerts API
Лёгкая библиотека для быстрой интеграции с DonationAlerts API: авторизация, управление токенами и получение информации о пользователе в несколько строк.

[![npm version](https://img.shields.io/npm/v/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts/v/latest)
[![npm downloads](https://img.shields.io/npm/dm/@kash-88/alerts.svg?style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts/v/latests)
[![install size](https://img.shields.io/badge/dynamic/json?url=https://packagephobia.com/v2/api.json?p=@kash-88/alerts&query=$.install.pretty&label=install%20size&style=flat-square)](https://www.npmjs.com/package/@kash-88/alerts/v/latest)

</div>

Доступно на: **RU**, [EN](https://github.com/kash-88/alerts-SDK/blob/main/readme.md)

## Установка
Использование npm:

```bash
$ npm install @kash-88/alerts
```

Использование yarn:

```bash
$ yarn add @kash-88/alerts
```

Использование pnpm:

```bash
$ pnpm add @kash-88/alerts
```

Использование bun:

```bash
$ bun add @kash-88/alerts
```

## Доступные методы (Кратко)
| Функция             | Назначение                                              |
|---------------------|--------------------------------------------------------|
| getAuthorizeLink    | Генерирует OAuth-ссылку для авторизации                |
| getOauthToken       | Получает access_token и refresh_token по коду/refresh  |
| getUser             | Получает профиль пользователя по access_token          |
| getUserChannel      | Получает канал пользователя по user_id                 |
| updateAccessToken   | Обновляет access_token через refresh_token             |
| getPrivateToken     | Получает приватный токен для подписки на канал         |

---

## getAuthorizeLink (Синхронная)
**Назначение:** Генерирует OAuth-ссылку для авторизации DonationAlerts.

- **Параметры:**
  - `client_id: string` — ID вашего приложения
  - `scope: string[]` — Массив прав доступа
- **Endpoint:** https://www.donationalerts.com/oauth/authorize
- **Документация API:** [Authorization Request](https://www.donationalerts.com/apidoc#authorization__authorization_code__authorization_request)

**Пример:**
```js
import { getAuthorizeLink } from "@kash-88/alerts";

const client_id = "YOUR_CLIENT_ID"; // Получить на https://www.donationalerts.com/application/clients
const scope = ["oauth-user-show"];

try {
    const link = getAuthorizeLink({ client_id, scope });
    console.log("Authorize link:", link);
} catch (error) {
    console.error("Ошибка:", error.message);
} 
```

---

## getOauthToken (Асинхронная)
**Назначение:** Получает access_token и refresh_token по коду авторизации.

- **Параметры:**
  - `client_id: string` — ID вашего приложения
  - `client_secret: string` — Секрет приложения
  - `code: string` — Код авторизации
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **Документация API:** [Getting Access Token](https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token)

**Пример:**
```js
import { getOauthToken } from "@kash-88/alerts";

// Получить на https://www.donationalerts.com/application/clients
const client_id = "YOUR_CLIENT_ID";
const client_secret = process.env.CLIENT_SECRET!;
const code = "USER_CODE";

(async () => {
    try {
        const token = await getOauthToken({ client_id, client_secret, code });
        console.log("Oauth token:", token);
    } catch (error) {
        console.error("Ошибка:", error.message);
    }
})(); 
```

---

## getUser (Асинхронная)
**Назначение:** Получает информацию о профиле пользователя по access_token.

- **Параметры:**
  - `access_token: string` — Access token пользователя
- **Endpoint:** https://www.donationalerts.com/api/v1/user/oauth
- **Документация API:** [User Info](https://www.donationalerts.com/apidoc#api_v1__users)

**Пример:**
```js
import { getUser } from "@kash-88/alerts";

const user_access_token = "USER_ACCESS_TOKEN";

(async () => {
    try {
        const user = await getUser(user_access_token);
        console.log("User data:", user);
    } catch (error) {
        console.error("Ошибка:", error.message);
    }
})(); 
```

---

## getUserChannel (Синхронная)
**Назначение:** Получает канал пользователя по user_id.

- **Параметры:**
  - `user_id: string` — ID пользователя
- **Endpoint:** —
- **Документация API:** —

**Пример:**
```js
import { getUserChannel } from "@kash-88/alerts";

const user_id = "USER_ID";

const channel = getUserChannel(user_id);
console.log("User channel:", channel);
```

---

## updateAccessToken (Асинхронная)
**Назначение:** Обновляет access_token с помощью refresh_token.

- **Параметры:**
  - `client_id: string` — ID вашего приложения
  - `client_secret: string` — Секрет приложения
  - `refresh_token: string` — Refresh token
- **Endpoint:** https://www.donationalerts.com/oauth/token
- **Документация API:** [Refreshing Access Tokens](https://www.donationalerts.com/apidoc#authorization__authorization_code__refreshing_access_tokens)

**Пример:**
```js
import "dotenv/config";
import { getOauthToken } from "@kash-88/alerts";

// Получить на https://www.donationalerts.com/application/clients
const client_id = "YOUR_CLIENT_ID";
const client_secret = process.env.CLIENT_SECRET!;

const refresh_token = "USER_REFRESH_TOKEN";

(async () => {
    try {
        const token = await getOauthToken({ client_id, client_secret, refresh_token });
        console.log("Oauth token:", token);
    } catch (error) {
        console.error("Ошибка:", error.message);
    }
})();
```

---

## getPrivateToken (Асинхронная)
**Назначение:** Получает приватный токен для подписки на канал DonationAlerts через Centrifuge.

- **Параметры:**
  - `channel: string` — Имя канала для подписки
  - `uuidv4_client_id: string` — UUID v4 клиента (используется при подключении к WebSocket)
  - `access_token: string` — OAuth access token пользователя
- **Endpoint:** https://www.donationalerts.com/api/v1/centrifuge/subscribe
- **Документация API:** —

**Пример:**
```js
import { getPrivateToken } from "@kash-88/alerts";

const channel = "USER_CHANNEL"; // Получить через getUserChannel
const uuidv4_client_id = "UUIDv4_CLIENT_ID"; // UUID клиента WebSocket
const access_token = "USER_ACCESS_TOKEN";

(async () => {
    try {
        const token = await getPrivateToken({ channel, uuidv4_client_id, access_token });
        console.log("Private token:", token);
    } catch (error) {
        console.error("Ошибка получения приватного токена:", error.message);
    }
})();
```