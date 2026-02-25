import axios from "axios";
import { User } from "@type";

/**
 * Fetches the profile information for the authenticated user.
 * 
 * @example
 * import { getUser } from "@kash.88/alerts";
 * 
 * // Get an access_token using getOauthToken or updateAccessToken
 * 
 * try {
 *   const accessToken = "USER_ACCESS_TOKEN";
 *   const user = await getUser(accessToken);
 * 
 *   console.log(user);
 * } catch (error) {
 *   console.error("Error fetching user:", error.response.data);
 * }
 * 
 * @param {string} access_token - The access token for authentication.
 * @returns {Promise<User>} A promise that resolves to the user profile data.
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__users__user_profile_information}
 */

export default async function getUser(access_token: string): Promise<User> {
    try {
        if (!access_token) {
            throw new Error("You must provide \"access_token\" as a non-empty string.");
        }

        const response = await axios.get<{ data: User }>("https://www.donationalerts.com/api/v1/user/oauth", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        return response.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
} 