import axios from "axios";
import { CustomAlerts } from "@type";
import { formatAxiosError } from "@utils";

/**
 * Send a custom alert to the authorized user.
 *
 * @param {string} access_token - User access token
 * @param {string} external_id - Up to 32 characters long unique alert ID
 * @param {string} header - Up to 255 characters long header text
 * @param {string} message - Up to 300 characters long message text
 * @param {number} is_shown - 0 or 1, determines whether the alert should be displayed
 * @param {string | null} [image_url] - URL to the image file displayed with the alert
 * @param {string | null} [sound_url] - URL to the sound file played when displaying the alert
 *
 * @returns {Promise<CustomAlerts>} Created custom alert data
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__custom_alerts__send_custom_alerts}
 */

export default async function createCustomAlerts(
	access_token: string,
	external_id: string,
	header: string,
	message: string,
	is_shown: 0 | 1,
	image_url?: string | null,
	sound_url?: string | null
): Promise<CustomAlerts> {
	if (!access_token || typeof access_token !== "string") {
		throw new Error("access_token must be a non-empty string");
	}
	if (!external_id || typeof external_id !== "string") {
		throw new Error("external_id must be a non-empty string");
	}
	if (typeof header !== "string" || typeof message !== "string") {
		throw new Error("header and message must be strings");
	}
	if (is_shown !== 0 && is_shown !== 1) {
		throw new Error("is_shown must be 0 or 1");
	}

	try {
		const formData = new URLSearchParams();
		formData.append("external_id", external_id);
		formData.append("header", header);
		formData.append("message", message);
		formData.append("is_shown", String(is_shown));
		if (image_url) formData.append("image_url", image_url);
		if (sound_url) formData.append("sound_url", sound_url);

		const response = await axios.post<{ data: CustomAlerts }>("https://www.donationalerts.com/api/v1/custom_alert",
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