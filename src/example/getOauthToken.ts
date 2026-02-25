import { getOauthToken } from "@kash-88/alerts";

/**
 * Notes:
 * - You can get CLIENT_ID and CLIENT_TOKEN at https://www.donationalerts.com/application/clients.
 * - USER_CODE is the authorization code returned after the user authorizes your app via the link from getAuthorizeLink().
 */

const client_id = "CLIENT_ID";
const client_token = "CLIENT_TOKEN";
const code = "USER_CODE";

(async () => {
    try {
        const token = await getOauthToken({ client_id, client_token, code } as any);
        console.log("Oauth token:", token);
    } catch (error: any) {
        console.error("Error:", error.message);
    }
})();