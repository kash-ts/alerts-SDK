import { getPrivateToken } from "@kash-88/alerts";
import { WebSocket } from "ws";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";

// --- Interfaces ---
interface CentrifugeConfiguration {
    ws: {
        url: string;
    };
}

interface WSClientOptions {
    channel: string;
    socket_connection_token: string;
    oauth_token: string;
}

interface CentrifugeMessage {
    params: Record<string, unknown>;
    id: number;
    method?: number;
}

// --- Configuration ---
const configuration: CentrifugeConfiguration = {
    ws: {
        url: "wss://centrifugo.donationalerts.com/connection/websocket"
    }
};

type MessageEvents = {
    open: () => void;
    message: (data: CentrifugeMessage) => void;
    close: () => void;
    error: (error: Error) => void;
    reconnecting: (attempt: number) => void;
    reconnect_failed: () => void;
}

// --- Class ---
export default class CentrifugeClient extends (EventEmitter as new () => TypedEmitter<MessageEvents>) {
    private options: WSClientOptions;
    private ws: WebSocket | null = null;

    constructor(options: WSClientOptions) {
        super();
        this.options = options; this.ws;
    }

    public createConnection(): WebSocket {
        if (this.ws) {
            return this.ws;
        }

        try {
            this.ws = new WebSocket(configuration.ws.url);
            
            return this.ws;
        } catch (error) {
            console.error("[WS] Failed to create connection:", error);
            throw error;
        }
    }

    public confirmConnection(socket_connection_token: string = this.options.socket_connection_token): void {
        const message: CentrifugeMessage = {
            params: {
                token: socket_connection_token
            },
            id: 1
        };
        this.sendMessage(JSON.stringify(message));
    }

    public async connectPrivateToken(channel: string, uuidv4_client_id: string, oauth_token: string = this.options.oauth_token): Promise<void> {
        try {
            const token = await getPrivateToken(
                channel,
                uuidv4_client_id,
                oauth_token
            );

            const subscribeMessage: CentrifugeMessage = {
                params: {
                    channel: channel,
                    token
                },
                method: 1,
                id: 2
            };

            this.sendMessage(JSON.stringify(subscribeMessage));
        } catch (error: any) {
            throw new Error(error);
        }
    }

    public sendMessage(message: string): void {
        if(!this.ws) return;

        try {
            this.ws.send(message);
        } catch (error: any) {
            throw new Error(error);
        }
    }
} 