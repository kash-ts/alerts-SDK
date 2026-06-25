import "dotenv/config";

import { WebServer } from "@kash-88/alerts";

const access_token = process.env.ACCESS_TOKEN!;

async function main() {
    try {
        const client = new WebServer({
            access_token,
            autoReconnect: true
        });

        client.on("open", async () => {
            console.log("WebSocket соединение открыто");
            await client.authorization();
        });

        client.on("message", (message) => {
            console.log("Получено сообщение:", JSON.stringify(message));
        });

        client.on("close", (code, reason) => {
            console.log(`WebSocket соединение закрыто: ${code} ${reason}`);
        });

        client.on("error", (err) => {
            console.error("Ошибка WebSocket:", err);
        });

        client.on("reconnect", () => {
            console.log("Переподключение...");
        });
    } catch (error: any) {
        console.error("Ошибка:", error.message);
    }
}

main();