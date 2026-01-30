import type { ChatUserstate } from 'tmi.js';

// Mock xdotool before importing commands
jest.mock('../utils/xdotool', () => ({
  sendKey: jest.fn(),
  sendConsoleCommand: jest.fn(),
}));

import { handleMessage } from '../commands';
import { sendKey, sendConsoleCommand } from '../utils/xdotool';

function createMockClient() {
  return { say: jest.fn() } as unknown as import('tmi.js').Client;
}

function baseTags(overrides: Partial<ChatUserstate> = {}): ChatUserstate {
  return { username: 'testuser', mod: false, ...overrides };
}

describe('handleMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responds to !ripandtear', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags(), '!ripandtear');
    expect(client.say).toHaveBeenCalledWith('#test', 'Until it is done!');
  });

  it('responds to !iddqd with username', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags({ username: 'doomguy' }), '!iddqd');
    expect(client.say).toHaveBeenCalledWith(
      '#test',
      'Your memory serves you well, @doomguy',
    );
  });

  it('sends F12 for !nextplayer', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags(), '!nextplayer');
    expect(sendKey).toHaveBeenCalledWith('F12');
  });

  it('sends F11 for !prevplayer', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags(), '!prevplayer');
    expect(sendKey).toHaveBeenCalledWith('F11');
  });

  it('sends !say message to game console', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags(), '!say hello world');
    expect(sendConsoleCommand).toHaveBeenCalledWith(
      'say [testuser]: hello world',
    );
  });

  it('rejects empty !say', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags(), '!say');
    expect(sendConsoleCommand).not.toHaveBeenCalled();
    expect(client.say).toHaveBeenCalledWith(
      '#test',
      'Message is empty or contains invalid characters.',
    );
  });

  it('blocks !rcon from non-moderators', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags({ mod: false }), '!rcon sv_cheats 1');
    expect(sendConsoleCommand).not.toHaveBeenCalled();
    expect(client.say).toHaveBeenCalledWith(
      '#test',
      'This command is for moderators only.',
    );
  });

  it('allows !rcon from moderators', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags({ mod: true }), '!rcon map MAP01');
    expect(sendConsoleCommand).toHaveBeenCalledWith('map MAP01');
  });

  it('allows !rcon from broadcaster', () => {
    const client = createMockClient();
    handleMessage(
      client,
      '#test',
      baseTags({ mod: false, badges: { broadcaster: '1' } }),
      '!rcon map MAP02',
    );
    expect(sendConsoleCommand).toHaveBeenCalledWith('map MAP02');
  });

  it('ignores unknown commands', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags(), '!unknown');
    expect(client.say).not.toHaveBeenCalled();
  });

  it('is case-insensitive for command names', () => {
    const client = createMockClient();
    handleMessage(client, '#test', baseTags(), '!RipAndTear');
    expect(client.say).toHaveBeenCalledWith('#test', 'Until it is done!');
  });
});
