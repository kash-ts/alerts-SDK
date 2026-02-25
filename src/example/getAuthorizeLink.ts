import { getAuthorizeLink } from "@kash-88/alerts";

/**
 * Notes:
 * - You can get CLIENT_ID at https://www.donationalerts.com/application/clients.
 * - You can find the list of scopes at https://www.donationalerts.com/apidoc#authorization__scopes.
 */

const client_id = "CLIENT_ID";
const scope = ["oauth-user-show"];

try {
    const link = getAuthorizeLink({ client_id, scope });
    console.log("Authorize link:", link);
} catch (error: any) {
    console.error("Error:", error.message);
}