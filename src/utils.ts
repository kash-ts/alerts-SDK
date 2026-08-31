import { createHash } from "crypto";

/**
 * Format an axios error into a readable error message.
 *
 * @param {any} error - The error thrown by axios or any other source
 * @returns {string} A formatted error message
 */

export function formatAxiosError(error: any): string {
    if (error?.response?.data?.error_description) {
        return error.response.data.error_description;
    }
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.response?.data?.error) {
        return error.response.data.error;
    }
    if (error?.message) {
        return error.message;
    }
    return String(error);
}

/**
 * Generate a SHA256 request signature for Merchandise API.
 *
 * The signature is formed from alphabetically sorted parameter values
 * (interpreted as strings) with the API client secret appended to the end.
 *
 * @param {Record<string, string | number>} params - Request parameters
 * @param {string} client_secret - API client secret key
 *
 * @returns {string} SHA256 hex digest signature
 * @see {@link https://www.donationalerts.com/apidoc#introduction__http_api_requests__request_signatures}
 */
export function generateSignature(
    params: Record<string, string | number>,
    client_secret: string
): string {
    const sortedValues = Object.values(params).map(String).sort();
    const valuesString = sortedValues.join("");
    return createHash("sha256").update(valuesString + client_secret).digest("hex");
}

