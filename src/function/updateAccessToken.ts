import axios from "axios";
import { validateDataObject } from "@utils";
import { UpdateTokenData, OauthToken } from "@type";

/**
 * Refreshes an access token using a refresh token.
 * 
 * @example
 * import { updateAccessToken } from "@kash.88/alerts";
 * 
 * try {
 *   const tokenData = await updateAccessToken({
 *     client_id: "YOUR_CLIENT_ID",
 *     client_secret: "YOUR_CLIENT_SECRET",
 *     refresh_token: "USER_REFRESH_TOKEN"
 *   });
 * 
 *   console.log(tokenData.access_token);
 * } catch (error) {
 *   console.error("Error updating access token:", error.response.data);
 * }
 * 
 * @param {UpdateTokenData} data - The data for the token refresh request.
 * @returns {Promise<OauthToken>} A promise that resolves to the new token data from the API.
 * @see {@link https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token}
 */

export default async function updateAccessToken(data: UpdateTokenData): Promise<OauthToken> {
    try {
        validateDataObject(data, ["client_id", "client_secret", "refresh_token"]);

        const response = await axios.post<OauthToken>("https://www.donationalerts.com/oauth/token", {
            grant_type: "refresh_token",
            client_id: data.client_id,
            client_secret: data.client_secret,
            refresh_token: data.refresh_token
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
} 