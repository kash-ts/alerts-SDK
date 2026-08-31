import axios from "axios";
import { formatAxiosError, generateSignature } from "@utils";

/**
 * Get user ID from an advertising promocode.
 *
 * @param {string} access_token - User access token
 * @param {string} client_secret - API client secret key for signature
 * @param {string} promocode - User promocode
 *
 * @returns {Promise<number>} DonationAlerts user ID
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__merchandises__update_or_create_merchandise__get_user_data_from_promocode}
 */

export default async function getUserDataFromPromocode(
    access_token: string,
    client_secret: string,
    promocode: string
): Promise<number> {
    if (!access_token || typeof access_token !== "string") {
        throw new Error("access_token must be a non-empty string");
    }
    if (!client_secret || typeof client_secret !== "string") {
        throw new Error("client_secret must be a non-empty string");
    }
    if (!promocode || typeof promocode !== "string") {
        throw new Error("promocode must be a non-empty string");
    }

    try {
        const params: Record<string, string | number> = { promocode };

        const signature = generateSignature(params, client_secret);
        params.signature = signature;

        const response = await axios.get<{ data: { user_id: number } }>(
            "https://www.donationalerts.com/api/v1/merchandise/user",
            {
                params,
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        );

        return response.data.data.user_id;
    } catch (error: any) {
        throw new Error(formatAxiosError(error));
    }
}
