import axios from "axios";
import { OAuthToken, OAuthScope } from "@type";
import { formatAxiosError } from "@utils";

/**
 * Refresh Access token using Refresh token.
 * 
 * @param {string} client_id - Your client (application) ID
 * @param {string} client_secret - Your client (application) secret
 * @param {string} refresh_token - User refresh token
 * @param {OAuthScope[]} scopes - Array of access scopes
 * 
 * @returns {Promise<OAuthToken>} A promise that resolves to the new token data from the API.
 * @see {@link https://www.donationalerts.com/apidoc#authorization__authorization_code__getting_access_token}
 */

export default async function updateOauthToken(
    client_id: string,
    client_secret: string,
    refresh_token: string,
    scopes: OAuthScope[]
): Promise<OAuthToken> {
    if (!client_id || typeof client_id !== "string") {
        throw new Error("client_id must be a non-empty string");
    }
    if (!client_secret || typeof client_secret !== "string") {
        throw new Error("client_secret must be a non-empty string");
    }
    if (!refresh_token || typeof refresh_token !== "string") {
        throw new Error("refresh_token must be a non-empty string");
    }
    if (!Array.isArray(scopes) || scopes.length === 0) {
        throw new Error("scopes must be a non-empty array");
    }

    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "refresh_token");
        formData.append("refresh_token", refresh_token);
        formData.append("client_id", client_id);
        formData.append("client_secret", client_secret);
        formData.append("scope", Array.from(new Set(scopes)).join(" "));

        const response = await axios.post<OAuthToken>("https://www.donationalerts.com/oauth/token", formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(formatAxiosError(error));
    }
} 