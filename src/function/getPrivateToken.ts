import axios from "axios";
import { formatAxiosError } from "@utils";

interface ChannelToken {
  channel: string;
  token: string;
}

/**
 * Get private tokens for subscribing to DonationAlerts channels via Centrifugo.
 *
 * @param {string[]} channels - Array of channel names to subscribe to
 * @param {string} client - Centrifugo UUIDv4 client ID
 * @param {string} access_token - User OAuth token
 *
 * @returns {Promise<ChannelToken[]>} - Array of channel and token pairs.
 */

export default async function getPrivateToken(
  channels: string[],
  client: string,
  access_token: string
): Promise<ChannelToken[]> {
  if (!Array.isArray(channels) || channels.length === 0) {
    throw new Error("channels must be a non-empty array");
  }
  const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!client || !uuidv4Regex.test(client)) {
    throw new Error("client must be a valid UUIDv4");
  }
  if (!access_token || typeof access_token !== "string") {
    throw new Error("access_token must be a non-empty string");
  }

  try {
    const response = await axios.post(
      "https://www.donationalerts.com/api/v1/centrifuge/subscribe",
      { channels, client },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (!Array.isArray(response.data?.channels) || response.data.channels.length === 0) {
      throw new Error("Failed to get private tokens: no channels in response");
    }

    return response.data.channels.map((c: { channel: string; token: string }) => ({
      channel: c.channel,
      token: c.token
    }));
  } catch (error: any) {
    throw new Error(formatAxiosError(error));
  }
} 