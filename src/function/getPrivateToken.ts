import axios from "axios";

/**
 * Get a Private token for subscribing to a DonationAlerts channel via Centrifuge.
 *
 * @param {string} channel - User channel
 * @param {string} uuidv4_client_id - UUID v4 client ID
 * @param {string} access_token - User OAuth token
 * 
 * @returns {Promise<string>} - Token for channel subscription.
 */

export async function getPrivateToken(channel:string, uuidv4_client_id:string, access_token:string): Promise<string> {
  try {
    const response = await axios.post(
      "https://www.donationalerts.com/api/v1/centrifuge/subscribe",
      {
        channels: [channel],
        client: uuidv4_client_id
      },
      {
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      }
    );
    return response.data.channels[0].token;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error_description || error?.message || error);
  }
} 