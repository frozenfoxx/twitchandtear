# twitchandtear

[![Actions Status](https://github.com/frozenfoxx/twitchandtear/workflows/build/badge.svg)](https://github.com/frozenfoxx/twitchandtear/actions)

[Twitch](https://twitch.tv/) integration for [Zandronum](https://zandronum.com/).

A TypeScript-based Docker container that provides live streaming spectator mode for Doom multiplayer games using Zandronum, OBS Studio, and Twitch chat integration.

Docker Hub: [https://hub.docker.com/r/frozenfoxx/twitchandtear](https://hub.docker.com/r/frozenfoxx/twitchandtear)

# Features

* First person follow spectate
* Chatbot commands to switch character spectating
* Send messages from Twitch chat into the game
* Execute console commands via RCON (moderator-only)

# Twitch Commands

* `!nextplayer`: spectate the next player
* `!prevplayer`: spectate the previous player
* `!say <message>`: send a message into the game
* `!rcon <command>`: execute a Zandronum console command (moderators only)
* `!help`: list available commands
* `!ripandtear`: responds with "Until it is done!"
* `!iddqd`: responds with a classic Doom reference

# Requirements

* Docker (for containerized deployment)
* A Twitch [app](https://dev.twitch.tv/console/apps/create)
* WAD files required by the server
* Node.js 18+ (for local development)
* TypeScript 5.3+ (for local development)

# Usage

## Docker

```bash
docker run --platform linux/amd64 \
  -e TARGET_HOST="your.zandronum.server.com" \
  -e OAUTH_TOKEN="oauth:your_twitch_bot_token" \
  -e CHANNELS="your_twitch_channel" \
  -e STREAM_KEY="live_your_twitch_stream_key" \
  -v /path/to/your/wads:/wads \
  -p 8080:8080 \
  frozenfoxx/twitchandtear:latest
```

### Required Parameters

* `-v /path/to/your/wads:/wads`: bind mount a directory containing your WAD files (IWADs and PWADs). Zandronum will search this directory automatically.
* `TARGET_HOST`: Zandronum server hostname or IP to connect to.
* `OAUTH_TOKEN`: Twitch bot OAuth token. Generate one at [https://twitchapps.com/tmi/](https://twitchapps.com/tmi/).
* `CHANNELS`: space-delimited list of Twitch channels for the bot to join.
* `STREAM_KEY`: Twitch stream key from your [Twitch Dashboard](https://dashboard.twitch.tv/settings/stream).

### Optional Parameters

* `TARGET_PORT`: Zandronum server port (default: `10666`).
* `BOT_USERNAME`: Twitch bot account username (default: `tat-zandronum`).
* `CLIENT_ID`: Twitch application Client ID.
* `CLIENT_SECRET`: Twitch application Client Secret.
* `DOOMWADDIR`: WAD search directory inside the container (default: `/wads`).
* `-p 8080:8080`: expose the NoVNC web viewer for debugging the display.
* `-p 5900:5900`: expose VNC for the display.

# Development

## Building

```bash
cd twitchandtear
npm install
npm run build
```

## Running

```bash
npm start
```

## Development Mode

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Project Structure

```
twitchandtear/
├── src/
│   ├── commands/
│   │   ├── index.ts              # Command registry and dispatcher
│   │   └── types.ts              # Command type definitions
│   ├── config/
│   │   └── logger.ts             # Winston logger configuration
│   ├── twitch/
│   │   └── index.ts              # Twitch chat bot client
│   ├── types/
│   │   └── env.d.ts              # Environment variable type definitions
│   ├── utils/
│   │   ├── sanitize.ts           # Input sanitization for game console
│   │   └── xdotool.ts            # xdotool helper functions
│   ├── __tests__/
│   │   ├── commands.test.ts      # Command handler tests
│   │   └── sanitize.test.ts      # Sanitization tests
│   └── index.ts                  # Main application entry point
├── dist/                         # Compiled JavaScript output
├── tsconfig.json                 # TypeScript configuration
├── jest.config.ts                # Jest test configuration
└── package.json                  # Node.js dependencies and scripts
```
