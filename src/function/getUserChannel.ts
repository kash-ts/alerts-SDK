/**
 * Get user channel by user id for WebSocket.
 * 
 * @param {string | number} id - User ID
 * 
 * @returns {string} The donation alert channel identifier in the format "$alerts:donation_{id}".
 */

export default function getUserChannel(
    id: string | number
): string {
    if (id === null || id === undefined || id === "") {
        throw new Error("id must be a non-empty string or number");
    }

    return `$alerts:donation_${id}`;
} 