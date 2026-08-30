import axios from "axios";
import { User } from "@type";
import { formatAxiosError } from "@utils";

/**
 * Fetch user profile information by OAuth token.
 * 
 * @param {string} access_token - User access token
 * 
 * @returns {Promise<User>} User data
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__users__user_profile_information}
 */

export default async function getUser(
    access_token: string
): Promise<User> {
    if (!access_token || typeof access_token !== "string") {
        throw new Error("access_token must be a non-empty string");
    }

    try {
        const response = await axios.get<{ data: User }>("https://www.donationalerts.com/api/v1/user/oauth", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return response.data.data;
    } catch (error: any) {
        throw new Error(formatAxiosError(error));
    }
} 