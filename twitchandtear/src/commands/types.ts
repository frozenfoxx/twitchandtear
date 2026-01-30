import type { ChatUserstate } from 'tmi.js';

export interface CommandContext {
  channel: string;
  tags: ChatUserstate;
  message: string;
  args: string[];
  say: (text: string) => void;
}

export interface Command {
  name: string;
  description: string;
  modOnly?: boolean;
  execute: (ctx: CommandContext) => void;
}
