/**
 * Get user channel by user id for WebSocket.
 * 
 * @param {string|number} id - User ID
 * 
 * @returns {string} The donation alert channel identifier in the format "$alerts:donation_{id}".
 */

export default function getUserChannel(id: string | number): string {
    try {
        if (typeof id !== "string" && typeof id !== "number" || id === "") {
            throw new Error("You must provide \"id\" as a string or number and non-empty.");
        }

        return `$alerts:donation_${id}`;
    } catch (error: any) {
        throw new Error(error);
    }
} 