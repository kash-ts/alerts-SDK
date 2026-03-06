import "dotenv/config";

import { getUser, getUserChannel, CentrifugeClient } from "@kash-88/alerts";

const oauth_token = process.env.ACCESS_TOKEN!;
let isConnectToPrivate = false;

async function main() {
    try {
        const user = await getUser(oauth_token);
        const channel = getUserChannel(user.id);
        const socket_connection_token = String(process.env.SOCKET_CONNECTION_TOKEN);

        const client = new CentrifugeClient({
            channel,
            socket_connection_token,
            oauth_token
        });

        const ws = client.createConnection();

        ws.on("open", async () => {
            console.log("WebSocket соединение открыто");
            client.confirmConnection(socket_connection_token);
        });

        ws.on("message", (message) => {
            const srt = message.toString("utf8");
            const json = JSON.parse(srt);

            if(json.id = 1 && !isConnectToPrivate) {
                isConnectToPrivate = true; return client.connectPrivateToken(channel, json.result.client);
            }

            console.log(srt);
        });

        ws.on("close", () => {
            console.log("WebSocket соединение закрыто");
        });

        ws.on("error", (err) => {
            console.error("Ошибка WebSocket:", err);
        });
    } catch (error: any) {
        console.error("Ошибка:", error.message);
    }
}

main();