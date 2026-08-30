import axios from "axios";
import { MerchandiseSale } from "@type";
import generateSignature from "@function/generateSignature.js";
import { formatAxiosError } from "@utils";

/**
 * Send a merchandise sale alert.
 *
 * @param {string} access_token - User access token
 * @param {string} client_secret - API client secret key for signature
 * @param {number} user_id - DonationAlerts user ID to which the sale is referenced
 * @param {string} external_id - Up to 32 characters long unique sale ID
 * @param {string} merchant_identifier - Merchant's ID on DonationAlerts
 * @param {string} merchandise_identifier - Merchant's merchandise ID that was bought
 * @param {number} amount - Grand total of the sale
 * @param {string} currency - Currency code (EUR, USD, RUB, BRL, TRY)
 * @param {number} [bought_amount=1] - Total number of bought items
 * @param {string} [username] - Name of the customer
 * @param {string} [message] - Message sent by the customer
 *
 * @returns {Promise<MerchandiseSale>} Created merchandise sale alert data
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__merchandise_sale_notifications__send_sale_alerts}
 */

export default async function sendSaleAlert(
    access_token: string,
    client_secret: string,
    user_id: number,
    external_id: string,
    merchant_identifier: string,
    merchandise_identifier: string,
    amount: number,
    currency: string,
    bought_amount: number = 1,
    username?: string,
    message?: string
): Promise<MerchandiseSale> {
    if (!access_token || typeof access_token !== "string") {
        throw new Error("access_token must be a non-empty string");
    }
    if (!client_secret || typeof client_secret !== "string") {
        throw new Error("client_secret must be a non-empty string");
    }
    if (typeof user_id !== "number" || user_id <= 0) {
        throw new Error("user_id must be a positive number");
    }
    if (!external_id || typeof external_id !== "string") {
        throw new Error("external_id must be a non-empty string");
    }
    if (!merchant_identifier || typeof merchant_identifier !== "string") {
        throw new Error("merchant_identifier must be a non-empty string");
    }
    if (!merchandise_identifier || typeof merchandise_identifier !== "string") {
        throw new Error("merchandise_identifier must be a non-empty string");
    }
    if (typeof amount !== "number" || amount <= 0) {
        throw new Error("amount must be a positive number");
    }
    if (!currency || typeof currency !== "string") {
        throw new Error("currency must be a non-empty string");
    }
    if (typeof bought_amount !== "number" || bought_amount <= 0) {
        throw new Error("bought_amount must be a positive number");
    }

    try {
        const params: Record<string, string | number> = {
            user_id,
            external_id,
            merchant_identifier,
            merchandise_identifier,
            amount,
            currency,
            bought_amount
        };

        if (username) params.username = username;
        if (message) params.message = message;

        const signature = generateSignature(params, client_secret);
        params.signature = signature;

        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            formData.append(key, String(value));
        }

        const response = await axios.post<{ data: MerchandiseSale }>(
            "https://www.donationalerts.com/api/v1/merchandise_sale",
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
