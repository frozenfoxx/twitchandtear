import https from 'https';
import { URL, URLSearchParams } from 'url';
import logger from '../config/logger';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string[];
  token_type: string;
}

interface TokenError {
  status: number;
  message: string;
}

function postRequest(url: string, params: URLSearchParams): Promise<TokenResponse> {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = params.toString();

    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data) as TokenResponse);
        } else {
          reject({ status: res.statusCode, message: data } as TokenError);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

export class TwitchAuth {
  private clientId: string;
  private clientSecret: string;
  private refreshToken: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(clientId: string, clientSecret: string, refreshToken: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.refreshToken = refreshToken;
  }

  async getAccessToken(): Promise<string> {
    // Refresh if token is missing or expires within 5 minutes
    if (!this.accessToken || Date.now() >= this.tokenExpiry - 300000) {
      await this.refreshAccessToken();
    }
    return this.accessToken!;
  }

  async getOAuthToken(): Promise<string> {
    const token = await this.getAccessToken();
    return `oauth:${token}`;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  private async refreshAccessToken(): Promise<void> {
    logger.info('Refreshing Twitch access token...');

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    try {
      const response = await postRequest('https://id.twitch.tv/oauth2/token', params);

      this.accessToken = response.access_token;
      this.tokenExpiry = Date.now() + response.expires_in * 1000;

      // Twitch may rotate refresh tokens
      if (response.refresh_token && response.refresh_token !== this.refreshToken) {
        logger.info('Refresh token was rotated by Twitch');
        this.refreshToken = response.refresh_token;
      }

      logger.info('Successfully refreshed Twitch access token');
    } catch (error) {
      const tokenError = error as TokenError;
      logger.error(`Failed to refresh token: ${tokenError.message}`);
      throw new Error('Could not refresh Twitch token. Check your credentials.');
    }
  }

  static async exchangeCodeForTokens(
    clientId: string,
    clientSecret: string,
    code: string,
    redirectUri: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    const response = await postRequest('https://id.twitch.tv/oauth2/token', params);

    return {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    };
  }

  static getAuthorizationUrl(clientId: string, redirectUri: string, scopes: string[]): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
    });

    return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
  }
}
