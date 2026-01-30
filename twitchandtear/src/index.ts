import logger from './config/logger';
import { streamChat } from './twitch';
import { handleMessage } from './commands';

logger.info('Connecting to Twitch...');

streamChat.on('message', (channel, tags, message, self) => {
  if (self) return;
  handleMessage(streamChat, channel, tags, message);
});

logger.info('TwitchAndTear bot is running...');
