import { updateAccessToken } from "@kash-88/alerts";

/**
 * Notes:
 * - You can get CLIENT_ID and CLIENT_TOKEN at https://www.donationalerts.com/application/clients.
 * - You can obtain REFRESH_TOKEN from the response of getOauthToken().
 */

const client_id = "CLIENT_ID";
const client_token = "CLIENT_TOKEN";
const refresh_token = "REFRESH_TOKEN";

(async () => {
    try {
        const token = await updateAccessToken({ client_id, client_token, refresh_token } as any);
        console.log("Oauth token:", token);
    } catch (error: any) {
        console.error("Error:", error.message);
    }
})();