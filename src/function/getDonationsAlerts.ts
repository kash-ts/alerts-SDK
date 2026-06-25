import axios from "axios";
import { DonationsAlerts } from "@type";
import { formatAxiosError } from "@utils";

/**
 * Fetch user donation alerts list.
 *
 * @param {string} access_token - User access token
 * @param {number | string} [page=1] - Page number for pagination
 *
 * @returns {Promise<DonationsAlerts>} Donation alerts data
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__donations__donation_alerts_list}
 */

export default async function getDonationsAlerts(
    access_token: string,
    page: number | string = 1
): Promise<DonationsAlerts> {
    if (!access_token || typeof access_token !== "string") {
        throw new Error("access_token must be a non-empty string");
    }

    try {
        const response = await axios.get<DonationsAlerts>("https://www.donationalerts.com/api/v1/alerts/donations", {
            params: {
                page
            },
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(formatAxiosError(error));
    }
}