import { getUserChannel } from "@kash-88/alerts";

/**
 * Notes:
 * - This function is intended to be used together with WebSocket.
 * - You can get USER_ID using getUser().
 */

const user_id = "USER_ID";

const channel = getUserChannel(user_id);
console.log("User channel:", channel);