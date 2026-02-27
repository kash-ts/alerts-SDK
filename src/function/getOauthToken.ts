import axios from "axios";
import { OauthToken } from "@type";

/**
 * Exchange Authorization code for OAuth token and Refresh token.
 * 
 * @param {string} client_id - Your client (application) ID
 * @param {string} client_token - Your client (application) token
 * @param {string} code - User authorization code
 * 
 * @returns {Promise<OauthToken>} A promise that resolves to the token data from the API.
 * @see {@link https://github.com/kash-ts/alerts-SDK?tab=readme-ov-file#getOauthToken}
 */

export default async function getOauthToken(client_id:string, client_token:string, code:string): Promise<OauthToken> {
    try {
        const response = await axios.post<OauthToken>("https://www.donationalerts.com/oauth/token", {
            grant_type: "authorization_code",
            client_id: client_id,
            client_secret: client_token,
            code: code
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
} 