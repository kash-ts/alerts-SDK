import axios from "axios";
import { GetPrivateToken } from "@type";
import { validateDataObject } from "@utils";

/**
 * Gets a private token for subscribing to a DonationAlerts channel via Centrifuge.
 *
 * @example
 * import { connectPrivateToken } from "@kash-88/alerts";
 *
 * // The "channel" can be obtained using the "getUserChannel" function,
 * // and the "uuidv4_client_id" is provided during authentication in WebSocket (ws).
 * 
 * try {
 *   const token = await connectPrivateToken({
 *     channel: "USER_CHANNEL",
 *     uuidv4_client_id: "USER_uuid_ID",
 *     access_token: "USER_ACCESS_TOKEN"
 *   });
 * 
 *   console.log(token);
 * } catch (error) {
 *   console.error("Error getting Oauth token:", error.response.data);
 * }
 *
 * @param {Object} params - Parameters for getting the token.
 * @param {string} params.channel - Channel name to subscribe.
 * @param {string} params.uuidv4_client_id - UUID v4 client ID.
 * @param {string} params.oauth_token - OAuth access token of the user.
 * @returns {Promise<string>} - Token for channel subscription.
 */

export async function getPrivateToken(data: GetPrivateToken): Promise<string> {
  try {
    validateDataObject(data, ["channel", "uuidv4_client_id", "oauth_token"]);

    const response = await axios.post(
      "https://www.donationalerts.com/api/v1/centrifuge/subscribe",
      {
        channels: [data.channel],
        client: data.uuidv4_client_id
      },
      {
        headers: {
          "Authorization": `Bearer ${data.access_token}`
        }
      }
    );
    return response.data.channels[0].token;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error_description || error?.message || error);
  }
} 