import type { ChatUserstate, Client } from 'tmi.js';
import type { Command, CommandContext } from './types';
import { sendKey, sendConsoleCommand } from '../utils/xdotool';
import { sanitizeMessage, isValidMessage } from '../utils/sanitize';
import logger from '../config/logger';

const commands: Map<string, Command> = new Map();

function register(command: Command): void {
  commands.set(command.name, command);
}

// Fun response commands
register({
  name: '!ripandtear',
  description: 'Responds with the classic Doom quote',
  execute: (ctx) => {
    ctx.say('Until it is done!');
  },
});

register({
  name: '!iddqd',
  description: 'Responds to the classic god mode cheat code',
  execute: (ctx) => {
    const username = ctx.tags.username || 'unknown';
    ctx.say(`Your memory serves you well, @${username}`);
  },
});

// Spectator commands
register({
  name: '!nextplayer',
  description: 'Switch to spectating the next player',
  execute: (ctx) => {
    sendKey('F12');
    ctx.say('Viewing the next player...');
  },
});

register({
  name: '!prevplayer',
  description: 'Switch to spectating the previous player',
  execute: (ctx) => {
    sendKey('F11');
    ctx.say('Viewing the previous player...');
  },
});

// Chat-to-game command
register({
  name: '!say',
  description: 'Send a message into the game from Twitch chat',
  execute: (ctx) => {
    const text = ctx.args.join(' ');
    if (!isValidMessage(text)) {
      ctx.say('Message is empty or contains invalid characters.');
      return;
    }
    const sanitized = sanitizeMessage(text);
    const username = ctx.tags.username || 'unknown';
    sendConsoleCommand(`say [${username}]: ${sanitized}`);
    ctx.say(`Message sent to game: ${sanitized}`);
  },
});

// RCON command (moderator-only)
register({
  name: '!rcon',
  description: 'Execute a console command in Zandronum (moderators only)',
  modOnly: true,
  execute: (ctx) => {
    const text = ctx.args.join(' ');
    if (!isValidMessage(text)) {
      ctx.say('No command provided.');
      return;
    }
    const sanitized = sanitizeMessage(text);
    sendConsoleCommand(sanitized);
    ctx.say(`Executed: ${sanitized}`);
  },
});

// Help command
register({
  name: '!help',
  description: 'List available commands',
  execute: (ctx) => {
    const available = Array.from(commands.values())
      .filter((cmd) => !cmd.modOnly)
      .map((cmd) => cmd.name)
      .join(', ');
    ctx.say(`Available commands: ${available}`);
  },
});

export function handleMessage(
  client: Client,
  channel: string,
  tags: ChatUserstate,
  message: string,
): void {
  const parts = message.trim().split(/\s+/);
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  const command = commands.get(commandName);
  if (!command) return;

  if (command.modOnly) {
    const isMod = tags.mod || tags.badges?.broadcaster === '1';
    if (!isMod) {
      client.say(channel, 'This command is for moderators only.');
      return;
    }
  }

  logger.info(`Command ${commandName} from ${tags.username || 'unknown'}`);

  const ctx: CommandContext = {
    channel,
    tags,
    message,
    args,
    say: (text: string) => client.say(channel, text),
  };

  command.execute(ctx);
}
