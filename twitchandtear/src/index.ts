import logger from './config/logger';
import which from 'which';
import { spawn } from 'child_process';
import { streamChat } from './twitch';

logger.info('Connecting to Twitch...');

const xdotool = which.sync('xdotool');

streamChat.on('message', (channel, tags, message, self) => {
  if (self) return;

  const msg = message.toLowerCase();
  const username = tags.username || 'unknown';

  if (msg === '!ripandtear') {
    streamChat.say(channel, 'Until it is done!');
  }

  if (msg === '!iddqd') {
    streamChat.say(channel, `Your memory serves you well, @${username}`);
  }

  if (msg === '!nextplayer') {
    spawn(xdotool, ['key', 'F12']);
    streamChat.say(channel, 'Viewing the next player...');
  }

  if (msg === '!prevplayer') {
    spawn(xdotool, ['key', 'F11']);
    streamChat.say(channel, 'Viewing the previous player...');
  }
});

logger.info('TwitchAndTear bot is running...');
