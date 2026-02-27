import axios from "axios";
import { OauthToken } from "@type";

/**
 * Refresh Access token using Refresh token.
 * 
 * @param {string} client_id - Your client (application) ID
 * @param {string} client_secret - Your client (application) token
 * @param {string} refresh_token - User refresh token
 * 
 * @returns {Promise<OauthToken>} A promise that resolves to the new token data from the API.
 * @see {@link https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token}
 */

export default async function updateAccessToken(client_id:string, client_secret:string, refresh_token:string): Promise<OauthToken> {
    try {
        const response = await axios.post<OauthToken>("https://www.donationalerts.com/oauth/token", {
            grant_type: "refresh_token",
            client_id: client_id,
            client_secret: client_secret,
            refresh_token: refresh_token
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
} 