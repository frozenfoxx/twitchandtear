import tmi from 'tmi.js';
import logger from '../config/logger';

const botUsername = process.env.BOT_USERNAME || 'tat-zandronum';
const channels = process.env.CHANNELS?.split(' ') || ['twitchandtear'];
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
    password: oauthToken,
  },
  channels,
};

const streamChat = new tmi.client(opts);

streamChat.connect().catch((error) => {
  logger.error('Failed to connect to Twitch:', error);
});

export { streamChat };
