import tmi from 'tmi.js';
import { TwitchAuth } from './auth';
import logger from '../config/logger';

const botUsername = process.env.BOT_USERNAME || 'tat-zandronum';
const channels = process.env.CHANNELS?.split(' ') || ['twitchandtear'];
const clientId = process.env.CLIENT_ID || '';
const clientSecret = process.env.CLIENT_SECRET || '';
const refreshToken = process.env.REFRESH_TOKEN || '';
const oauthToken = process.env.OAUTH_TOKEN || '';

interface TmiOptions {
  options?: {
    debug?: boolean;
    messagesLogLevel?: string;
  };
  connection?: {
    reconnect?: boolean;
    secure?: boolean;
  };
  identity?: {
    username: string;
    password: string;
  };
  channels: string[];
}

let twitchAuth: TwitchAuth | null = null;

async function getPassword(): Promise<string> {
  // If OAUTH_TOKEN is provided directly, use it (backward compatible)
  if (oauthToken) {
    logger.info('Using provided OAUTH_TOKEN');
    return oauthToken.startsWith('oauth:') ? oauthToken : `oauth:${oauthToken}`;
  }

  // Otherwise, use refresh token flow
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Either OAUTH_TOKEN or all of CLIENT_ID, CLIENT_SECRET, and REFRESH_TOKEN must be provided',
    );
  }

  twitchAuth = new TwitchAuth(clientId, clientSecret, refreshToken);
  return twitchAuth.getOAuthToken();
}

export async function createStreamChat(): Promise<tmi.Client> {
  const password = await getPassword();

  const opts: TmiOptions = {
    options: {
      debug: true,
      messagesLogLevel: 'info',
    },
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: {
      username: botUsername,
      password,
    },
    channels,
  };

  const client = new tmi.Client(opts);

  await client.connect();

  return client;
}

export { twitchAuth };
