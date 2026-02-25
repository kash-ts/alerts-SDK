import { validateDataObject } from "@utils";
import { GetAuthorizeLinkData } from "@type";

/**
 * Generates an authorization link for the DonationAlerts API.
 * 
 * @example
 * import { getAuthorizeLink } from "@kash.88/alerts";
 * 
 * const authLink = getAuthorizeLink({
 *   client_id: "YOUR_CLIENT_ID",
 *   scope: ["oauth-user-show"]
 * });
 * console.log(authLink);
 * 
 * @param {GetAuthorizeLinkData} data - The data for generating the link.
 * @returns {string} The authorization URL.
 * @see {@link https://www.donationalerts.com/apidoc#authorization__authorization_code__authorization_request}
 */

export default function getAuthorizeLink(data: GetAuthorizeLinkData): string {
    try {
        validateDataObject(data, ["client_id", "scope"]);

        if (!Array.isArray(data.scope)) {
            throw new Error("You must provide \"scope\" as an array in the data object.");
        }
        
        return `https://www.donationalerts.com/oauth/authorize?client_id=${data.client_id}&response_type=code&scope=${data.scope.join("%20")}`;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
}