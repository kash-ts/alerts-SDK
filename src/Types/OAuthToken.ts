interface OAuthToken {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token?: string;
}

export default OAuthToken;
