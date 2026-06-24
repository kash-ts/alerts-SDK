import { randomBytes } from "crypto";

/**
 * Generate a random 32-character external ID.
 *
 * @returns {string} 32 random alphanumeric characters
 */

export default function getExternal(): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = randomBytes(32);

    // Use rejection sampling to avoid bias
    const charsetLength = charset.length;
    const maxValidValue = 256 - (256 % charsetLength);
    let result = "";
    let index = 0;

    while (index < 32) {
        const randomValue = randomValues[index];
        if (randomValue < maxValidValue) {
            result += charset[randomValue % charsetLength];
            index++;
        } else {
            // Rejection: generate a new random value for this position
            randomValues[index] = randomBytes(1)[0];
        }
    }

    return result;
} 