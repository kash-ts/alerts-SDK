import { createHash } from "crypto";

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

export default function generateSignature(
    params: Record<string, string | number>,
    client_secret: string
): string {
    const sortedValues = Object.values(params).map(String).sort();
    const valuesString = sortedValues.join("");
    return createHash("sha256").update(valuesString + client_secret).digest("hex");
}
