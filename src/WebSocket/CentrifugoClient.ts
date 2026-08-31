import getPrivateToken from "@function/getPrivateToken.js";
import getUser from "@function/getUser.js";
import getUserChannel from "@function/getUserChannel.js";
import { User, ChannelType } from "@type";
import { formatAxiosError } from "@utils";
import { WebSocket, RawData } from "ws";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";

interface WSClientOptions {
    access_token: string;
    channels?: string[];
    autoReconnect?: boolean;
}

type MessageEvents = {
    open: () => void;
    message: (data: any) => void;
    close: (code: number, reason: Buffer) => void;
    error: (error: Error) => void;
    reconnect: () => void;
}

/**
 * Class for interacting with Centrifugo donationalerts
 *
 * @param {WSClientOptions} options - Connection options
 * @param {string} options.access_token - User access token
 * @param {string[]} [options.channels] - Custom channels to subscribe to (defaults to donation channel)
 * @param {boolean} [options.autoReconnect=false] - Automatically reconnect on connection close
 */

export default class CentrifugoClient extends (EventEmitter as new () => TypedEmitter<MessageEvents>) {
    private WebSocket: WebSocket | null;
    private user: User | null;
    private userPromise: Promise<User> | null;
    private access_token: string;
    private channels: string[];
    private autoReconnect: boolean;
    private isAuthorized: boolean;
    private reconnectTimer: NodeJS.Timeout | null;
    private isReconnecting: boolean;
    private authMessageHandler: ((rawMessage: RawData) => void) | null;

    constructor(options: WSClientOptions) {
        super();
        this.access_token = options.access_token;
        this.channels = options.channels ?? [];
        this.autoReconnect = options.autoReconnect ?? false;
        this.isAuthorized = false;
        this.reconnectTimer = null;
        this.isReconnecting = false;
        this.authMessageHandler = null;

        this.WebSocket = null;
        this.user = null;
        this.userPromise = this.getUser(this.access_token).catch((error) => {
            this.emit("error", error);
            throw error;
        });

        this.createNewConnection();
        this.setupEvent();
    }

    /**
     * Obtain user data
     *
     * @param {string} access_token - User access token
     * @returns {Promise<User>} User data
     */

    private async getUser(
        access_token: string
    ): Promise<User> {
        try {
            this.user = await getUser(access_token);
            return this.user;
        } catch (error: any) {
            throw new Error(formatAxiosError(error));
        }
    }

    /**
     * Get channels to subscribe to
     *
     * @returns {Promise<string[]>} Array of channel identifiers
     */

    private async getChannels(): Promise<string[]> {
        if (!this.user?.id) this.user = await (this.userPromise ?? this.getUser(this.access_token));
        if (!this.user?.id) throw new Error("Failed to get channels due to missing user ID");

        if (this.channels.length > 0) return this.channels;

        return [getUserChannel(this.user.id, ChannelType.Donation)];
    }

    /**
     * Create a new WebSocket connection
     */

    public createNewConnection() {
        try {
            if (this.WebSocket) return;
            this.WebSocket = new WebSocket("wss://centrifugo.donationalerts.com/connection/websocket");
        } catch (error: any) {
            throw new Error(error?.message || error);
        }
    }

    /**
     * Forward events through a TypedEmitter
     */

    private setupEvent() {
        if (!this.WebSocket) {
            this.createNewConnection();
            if (!this.WebSocket) throw new Error("WebSocket connection failed");
        }

        const ws = this.WebSocket;

        ws.on('open', () => {
            this.emit("open");
        });

        ws.on('close', (code: number, reason: Buffer) => {
            this.isAuthorized = false;
            this.emit("close", code, reason);

            if (this.autoReconnect) {
                this.WebSocket = null;
                if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
                this.isReconnecting = true;
                this.reconnectTimer = setTimeout(() => {
                    this.isReconnecting = false;
                    this.createNewConnection();
                    this.setupEvent();
                    this.emit("reconnect");
                }, 5000);
            }
        });

        ws.on('message', (rawMessage: RawData) => {
            try {
                const message = JSON.parse(rawMessage.toString());
                this.emit("message", message);
            } catch (error: any) {
                this.emit("error", new Error(`Failed to parse WebSocket message: ${error?.message || error}`));
            }
        });

        ws.on('error', (error: Error) => {
            this.emit("error", error);
        });
    }

    /**
     * Authorize WebSocket and subscribe to selected channels
     */

    public async authorization() {
        if (this.isReconnecting) {
            throw new Error("Reconnection is in progress, please wait for the 'reconnect' event");
        }

        if (!this.WebSocket) this.createNewConnection();
        if (!this.WebSocket) throw new Error("WebSocket connection failed");

        if (this.WebSocket.readyState !== WebSocket.OPEN) {
            throw new Error("WebSocket connection is not open. Call authorization() after the 'open' event");
        }

        if (!this.user) this.user = await (this.userPromise ?? this.getUser(this.access_token));
        if (!this.user?.socket_connection_token) throw new Error("Failed to log in due to receiving socket connection token");

        if (this.authMessageHandler) {
            this.WebSocket?.removeListener('message', this.authMessageHandler);
        }

        const handleAuthResponse = async (rawMessage: RawData) => {
            try {
                const json = JSON.parse(rawMessage.toString());

                if (json.id === 1) {
                    this.authMessageHandler = null;
                    this.WebSocket?.removeListener('message', handleAuthResponse);

                    if (!json.result?.client) {
                        this.emit("error", new Error("Authorization failed: missing client ID in response"));
                        return;
                    }

                    const channels = await this.getChannels();
                    const channelTokens = await getPrivateToken(channels, json.result.client, this.access_token);

                    for (let i = 0; i < channelTokens.length; i++) {
                        const { channel, token } = channelTokens[i];
                        this.sendMessage(JSON.stringify({
                            id: 2 + i,
                            method: 1,
                            params: { channel, token }
                        }));
                    }

                    this.isAuthorized = true;
                }
            } catch (error: any) {
                this.authMessageHandler = null;
                this.WebSocket?.removeListener('message', handleAuthResponse);
                this.emit("error", new Error(`Authorization failed: ${error?.message || error}`));
            }
        };

        this.authMessageHandler = handleAuthResponse;
        this.WebSocket.on('message', handleAuthResponse);

        this.sendMessage(JSON.stringify({
            params: {
                token: this.user.socket_connection_token
            },
            id: 1
        }));
    }

    /**
     * Send a message through the WebSocket connection
     *
     * @param {string} message - JSON-encoded message to send
     */

    public sendMessage(message: string): void {
        try {
            if (!this.WebSocket) return;
            if (this.WebSocket.readyState !== WebSocket.OPEN) return;
            this.WebSocket.send(message);
        } catch (error: any) {
            throw new Error(error?.message || error);
        }
    }

    /**
     * Close the WebSocket connection and stop auto-reconnect
     */

    public close(): void {
        this.autoReconnect = false;
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.WebSocket) {
            if (this.authMessageHandler) {
                this.WebSocket.removeListener('message', this.authMessageHandler);
                this.authMessageHandler = null;
            }
            this.WebSocket.close();
            this.WebSocket = null;
        }
        this.isAuthorized = false;
    }
} 