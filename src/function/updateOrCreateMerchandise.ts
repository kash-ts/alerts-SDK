import axios from "axios";
import { Merchandise } from "@type";
import generateSignature from "@function/generateSignature.js";
import { formatAxiosError } from "@utils";

/**
 * Update or create a merchandise by merchant and merchandise identifiers.
 *
 * @param {string} access_token - User access token
 * @param {string} client_secret - API client secret key for signature
 * @param {string} merchant_identifier - Merchant's ID on DonationAlerts
 * @param {string} merchandise_identifier - Up to 16 characters long unique merchandise ID
 * @param {Record<string, string>} title - Object with merchandise titles in different locales (en_US required)
 * @param {string} currency - Currency code (EUR, USD, RUB, BRL, TRY)
 * @param {number} price_user - Revenue added to streamer for each sale
 * @param {number} price_service - Revenue added to DonationAlerts for each sale
 * @param {number} [is_active=0] - 0 or 1, whether merchandise is available for purchase
 * @param {number} [is_percentage=0] - 0 or 1, whether prices are percentages or absolute amounts
 * @param {string} [url] - URL to merchandise's web page
 * @param {string} [img_url] - URL to merchandise's image
 * @param {number} [end_at_ts] - Unix timestamp when merchandise becomes inactive
 *
 * @returns {Promise<Merchandise>} Updated or created merchandise data
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__merchandises__update_or_create_merchandise}
 */

export default async function updateOrCreateMerchandise(
    access_token: string,
    client_secret: string,
    merchant_identifier: string,
    merchandise_identifier: string,
    title: Record<string, string>,
    currency: string,
    price_user: number,
    price_service: number,
    is_active: number = 0,
    is_percentage: number = 0,
    url?: string,
    img_url?: string,
    end_at_ts?: number
): Promise<Merchandise> {
    if (!access_token || typeof access_token !== "string") {
        throw new Error("access_token must be a non-empty string");
    }
    if (!client_secret || typeof client_secret !== "string") {
        throw new Error("client_secret must be a non-empty string");
    }
    if (!merchant_identifier || typeof merchant_identifier !== "string") {
        throw new Error("merchant_identifier must be a non-empty string");
    }
    if (!merchandise_identifier || typeof merchandise_identifier !== "string") {
        throw new Error("merchandise_identifier must be a non-empty string");
    }
    if (!title || Object.keys(title).length === 0) {
        throw new Error("title must be a non-empty object");
    }
    if (!currency || typeof currency !== "string") {
        throw new Error("currency must be a non-empty string");
    }
    if (typeof price_user !== "number" || typeof price_service !== "number") {
        throw new Error("price_user and price_service must be numbers");
    }

    try {
        const params: Record<string, string | number> = {
            currency,
            price_user,
            price_service,
            is_active,
            is_percentage
        };

        for (const [locale, value] of Object.entries(title)) {
            params[`title[${locale}]`] = value;
        }
        if (url) params.url = url;
        if (img_url) params.img_url = img_url;
        if (end_at_ts !== undefined) params.end_at_ts = end_at_ts;

        const signature = generateSignature(params, client_secret);
        params.signature = signature;

        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            formData.append(key, String(value));
        }

        const response = await axios.put<{ data: Merchandise }>(
            `https://www.donationalerts.com/api/v1/merchandise/${merchant_identifier}/${merchandise_identifier}`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        );

        return response.data.data;
    } catch (error: any) {
        throw new Error(formatAxiosError(error));
    }
}
