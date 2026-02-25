import { getUser } from "@kash-88/alerts";

/**
 * Notes:
 * - You can obtain OAUTH_TOKEN by calling getOauthToken() after the user authorizes your app.
 */

const oauth_token = "OAUTH_TOKEN";

(async () => {
    try {
        const user = await getUser(oauth_token);
        console.log("User data:", user);
    } catch (error: any) {
        console.error("Error:", error.message);
    }
})();