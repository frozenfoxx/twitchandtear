import logger from './config/logger';
import { createStreamChat } from './twitch';
import { handleMessage } from './commands';

async function main(): Promise<void> {
  logger.info('Connecting to Twitch...');

  try {
    const streamChat = await createStreamChat();

    streamChat.on('message', (channel, tags, message, self) => {
      if (self) return;
      handleMessage(streamChat, channel, tags, message);
    });

    logger.info('TwitchAndTear bot is running...');
  } catch (error) {
    logger.error('Failed to start bot:', error);
    process.exit(1);
  }
}

main();
