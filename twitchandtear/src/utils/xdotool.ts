import which from 'which';
import { spawn } from 'child_process';
import logger from '../config/logger';

const xdotoolPath = which.sync('xdotool');

export function sendKey(key: string): void {
  logger.debug(`xdotool key: ${key}`);
  spawn(xdotoolPath, ['key', key]);
}

function typeText(text: string): void {
  logger.debug(`xdotool type: ${text}`);
  spawn(xdotoolPath, ['type', '--clearmodifiers', text]);
}

export function sendConsoleCommand(command: string): void {
  // Open Zandronum console with backtick
  sendKey('grave');

  // Small delay then type the command
  setTimeout(() => {
    typeText(command);
    setTimeout(() => {
      sendKey('Return');
      setTimeout(() => {
        sendKey('Escape');
      }, 100);
    }, 100);
  }, 200);
}
