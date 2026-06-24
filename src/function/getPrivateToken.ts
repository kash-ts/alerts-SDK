import axios from "axios";
import { formatAxiosError } from "@utils";

/**
 * Get a Private token for subscribing to a DonationAlerts channel via Centrifuge.
 *
 * @param {string} channel - User channel
 * @param {string} client - Centrifugo UUIDv4 client ID
 * @param {string} access_token - User OAuth token
 * 
 * @returns {Promise<string>} - Token for channel subscription.
 */

export default async function getPrivateToken(
  channel: string,
  client: string,
  access_token: string
): Promise<string> {
  if (!channel || typeof channel !== "string") {
    throw new Error("channel must be a non-empty string");
  }
  if (!client || typeof client !== "string") {
    throw new Error("client must be a non-empty string");
  }
  if (!access_token || typeof access_token !== "string") {
    throw new Error("access_token must be a non-empty string");
  }

  try {
    const response = await axios.post("https://www.donationalerts.com/api/v1/centrifuge/subscribe",
      {
        channels: [channel],
        client: client
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!response.data?.channels?.[0]?.token) {
      throw new Error("Failed to get private token: no channels in response");
    }
    return response.data.channels[0].token;
  } catch (error: any) {
    throw new Error(formatAxiosError(error));
  }
} 