import axios from "axios";
import { User } from "@type";

/**
 * Fetch user profile information by OAuth token.
 * 
 * @param {string} oauth_token - User oauth token
 * 
 * @returns {Promise<User>} A promise that resolves to the user profile data.
 * @see {@link https://www.donationalerts.com/apidoc#api_v1__users__user_profile_information}
 */

export default async function getUser(oauth_token: string): Promise<User> {
    try {
        if (typeof oauth_token !== "string") {
            throw new Error("You must provide \"string\" as a string and non-empty.");
        }

        const response = await axios.get<{ data: User }>("https://www.donationalerts.com/api/v1/user/oauth", {
            headers: {
                Authorization: `Bearer ${oauth_token}`
            }
        });

        return response.data.data;
    } catch (error: any) {
        throw new Error(error?.response?.data?.error_description || error?.message || error);
    }
} 