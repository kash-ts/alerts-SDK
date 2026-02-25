import { getPrivateToken } from "@kash-88/alerts";

/**
 * Notes:
 * - This function is intended to be used together with WebSocket.
 * - You can get USER_CHANNEL using getUserChannel().
 * - You receive uuidv4_client_id when you establish the WebSocket connection.
 * - You can obtain the user OAUTH_TOKEN using getOauthToken().
 */

const channel = "USER_CHANNEL";
const uuidv4_client_id = "UUIDv4_CLIENT_ID";
const oauth_token = "OAUTH_TOKEN";

(async () => {
    try {
        const token = await getPrivateToken({ channel, uuidv4_client_id, oauth_token });
        console.log("Private token:", token);
    } catch (error: any) {
        console.error("Error getting private token:", error.message);
    }
})();