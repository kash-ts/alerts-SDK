import axios from "axios";
import { OAuthToken } from "@type";
import { formatAxiosError } from "@utils";

/**
 * Exchange Authorization code for OAuth token and Refresh token.
 * 
 * @param {string} client_id - Your client (application) ID
 * @param {string} client_secret - Your client (application) secret
 * @param {string} redirect_uri - The URL where users will be sent after authorization
 * @param {string} code - User authorization code
 * 
 * @returns {Promise<OAuthToken>} OAuth user token
 * @see {@link https://github.com/kash-ts/alerts-SDK?tab=readme-ov-file#getOauthToken}
 */

export default async function getOauthToken(
    client_id: string,
    client_secret: string,
    redirect_uri: string,
    code: string
): Promise<OAuthToken> {
    if (!client_id || typeof client_id !== "string") {
        throw new Error("client_id must be a non-empty string");
    }
    if (!client_secret || typeof client_secret !== "string") {
        throw new Error("client_secret must be a non-empty string");
    }
    if (!redirect_uri || typeof redirect_uri !== "string") {
        throw new Error("redirect_uri must be a non-empty string");
    }
    if (!code || typeof code !== "string") {
        throw new Error("code must be a non-empty string");
    }

    try {
        const formData = new URLSearchParams();
        formData.append("grant_type", "authorization_code");
        formData.append("client_id", client_id);
        formData.append("client_secret", client_secret);
        formData.append("redirect_uri", redirect_uri);
        formData.append("code", code);

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