import { OAuthScope } from "@type";

/**
 * Generate OAuth authorization link for DonationAlerts.
 * 
 * @param {string} client_id - Your client (application) ID
 * @param {string} redirect_uri - The URL where users will be sent after authorization
 * @param {OAuthScope[]} scopes - Array of access scopes
 * @param {'code' | 'token'} type - Type response oauth token
 * 
 * @returns {string} The authorization URL.
 * @see {@link https://www.donationalerts.com/apidoc#authorization__authorization_code__authorization_steps}
 */

export default function getAuthorizeLink(
    client_id: string,
    redirect_uri: string,
    scopes: OAuthScope[],
    type: 'code' | 'token'
): string {
    if (!client_id || typeof client_id !== "string") {
        throw new Error("client_id must be a non-empty string");
    }
    if (!redirect_uri || typeof redirect_uri !== "string") {
        throw new Error("redirect_uri must be a non-empty string");
    }
    if (!Array.isArray(scopes) || scopes.length === 0) {
        throw new Error("scopes must be a non-empty array");
    }
    if (type !== "code" && type !== "token") {
        throw new Error("type must be 'code' or 'token'");
    }

    const uniqueScopes = Array.from(new Set(scopes));

    return `https://www.donationalerts.com/oauth/authorize?client_id=${encodeURIComponent(client_id)}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${type}&scope=${uniqueScopes.join("%20")}`;
}