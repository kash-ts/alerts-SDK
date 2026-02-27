/**
 * Generate OAuth authorization link for DonationAlerts.
 * 
 * @param {string} client_id - Your client (application) ID
 * @param {string[]} scopes - Array of access scopes
 * 
 * @returns {string} The authorization URL.
 * @see {@link https://github.com/kash-ts/alerts-SDK?tab=readme-ov-file#getauthorizelink-sync}
 */

export default function getAuthorizeLink(client_id:string, scopes:string[]): string {
    try {
        if (!Array.isArray(scopes) || typeof client_id !== "string") {
            throw new Error("\"Scopes\" must contain an array with permissions and \"Client_id\" must contain the application id.");
        }

        const uniqueScopes = Array.from(new Set(scopes));

        return `https://www.donationalerts.com/oauth/authorize?client_id=${client_id}&response_type=code&scope=${uniqueScopes.join("%20")}`;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
}