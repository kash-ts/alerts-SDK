import { ChannelType } from "@type";

const channelPrefixes: Record<ChannelType, string> = {
    [ChannelType.Donation]: "$alerts:donation_",
    [ChannelType.Goal]: "$goals:goal_",
    [ChannelType.Poll]: "$polls:poll_"
};

/**
 * Get a Centrifugo channel name by user ID and channel type.
 *
 * @param {string | number} id - User ID
 * @param {ChannelType} type - Channel type
 *
 * @returns {string} Centrifugo channel name
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__centrifugo_channels}
 */

export default function getUserChannel(
    id: string | number,
    type: ChannelType
): string {
    if (id === null || id === undefined || id === "") {
        throw new Error("id must be a non-empty string or number");
    }

    return `${channelPrefixes[type]}${id}`;
} 