/**
 * Fetches the profile information for the authenticated user.
 * 
 * @example
 * import { getUserChannel } from "@kash.88/alerts";
 * 
 * // The "id" can be obtained using the "getUser" function,
 * 
 * try {
 *   const userId = "USER_ID";
 *   const channelId = getUserChannel(userId);
 * } catch (error) {
 *   console.error("Error generating channel ID:", error.message);
 * }
 * 
 * @param {string|number} id - The user ID for which to generate the channel identifier.
 * @returns {string} The donation alert channel identifier in the format "$alerts:donation_{id}".
 */

export default function getUserChannel(id: string | number): string {
    try {
        if (typeof id !== "string" && typeof id !== "number") {
            throw new Error("You must provide \"id\" as a string or number.");
        }

        if (id === null || id === undefined || id === "") {
            throw new Error("You must provide a non-empty \"id\".");
        }

        return `$alerts:donation_${id}`;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
} 