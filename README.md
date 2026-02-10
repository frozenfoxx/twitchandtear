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
* Automatic OAuth token refresh (set and forget)

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
* A Twitch [application](https://dev.twitch.tv/console/apps/create)
* WAD files required by the server
* Node.js 18+ (for local development)
* TypeScript 5.3+ (for local development)

# Setup

## Step 1: Create a Twitch Application

1. Go to the [Twitch Developer Console](https://dev.twitch.tv/console/apps/create)
2. Create a new application with:
   - **Name**: Your bot name (e.g., "TwitchAndTear")
   - **OAuth Redirect URL**: `http://localhost:3000` (must include the port!)
   - **Category**: Chat Bot
3. Note your **Client ID** and generate a **Client Secret**

> **Important**: The OAuth Redirect URL must be exactly `http://localhost:3000` including the port. If you omit the port or use a different one, you'll get a `redirect_mismatch` error during authorization.

## Step 2: Get a Refresh Token

Run the authorization helper to get a refresh token. This only needs to be done once.

**Using Docker:**

```bash
docker run -it --rm --platform linux/amd64 \
  -e CLIENT_ID="your_client_id" \
  -e CLIENT_SECRET="your_client_secret" \
  -p 3000:3000 \
  frozenfoxx/twitchandtear:latest --auth
```

**Using local development:**

```bash
cd twitchandtear
npm install && npm run build
CLIENT_ID="your_client_id" CLIENT_SECRET="your_client_secret" npm run auth
```

This will:
1. Display a URL to open in your browser
2. After you authorize, display your `REFRESH_TOKEN`
3. Show a complete docker run example with your tokens

## Step 3: Run the Bot

Use the refresh token from Step 2:

```bash
docker run -it --rm --platform linux/amd64 \
  -e CLIENT_ID="your_client_id" \
  -e CLIENT_SECRET="your_client_secret" \
  -e REFRESH_TOKEN="your_refresh_token" \
  -e CHANNELS="your_twitch_channel" \
  -e STREAM_KEY="your_stream_key" \
  -e TARGET_HOST="your.zandronum.server.com" \
  -v /path/to/your/wads:/wads \
  frozenfoxx/twitchandtear:latest
```

The bot will automatically refresh the access token as needed. No manual token management required.

# Usage

## Required Parameters

| Parameter | Description |
|-----------|-------------|
| `-v /path/to/wads:/wads` | Bind mount containing your WAD files |
| `TARGET_HOST` | Zandronum server hostname or IP |
| `CHANNELS` | Space-delimited Twitch channels to join |
| `STREAM_KEY` | Twitch stream key from your [Dashboard](https://dashboard.twitch.tv/settings/stream) |

**Authentication** (choose one):

| Method | Parameters |
|--------|------------|
| Refresh Token (recommended) | `CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN` |
| OAuth Token (legacy) | `OAUTH_TOKEN` |

## Optional Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `TARGET_PORT` | `10666` | Zandronum server port |
| `TARGET_PASSWORD` | | Password for password-protected servers |
| `BOT_USERNAME` | `tat-zandronum` | Twitch bot username |
| `CLIENT_ID` | | Twitch application Client ID |
| `DOOMWADDIR` | `/wads` | WAD search directory in container |
| `-p 8080:8080` | | Expose NoVNC web viewer for debugging |
| `-p 5900:5900` | | Expose VNC for the display |

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

## Authorization (for development)

```bash
CLIENT_ID=xxx CLIENT_SECRET=xxx npm run auth
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
│   │   ├── auth.ts               # OAuth token management
│   │   └── index.ts              # Twitch chat bot client
│   ├── types/
│   │   └── env.d.ts              # Environment variable type definitions
│   ├── utils/
│   │   ├── sanitize.ts           # Input sanitization for game console
│   │   └── xdotool.ts            # xdotool helper functions
│   ├── __tests__/
│   │   ├── commands.test.ts      # Command handler tests
│   │   └── sanitize.test.ts      # Sanitization tests
│   ├── auth-cli.ts               # Authorization CLI tool
│   └── index.ts                  # Main application entry point
├── dist/                         # Compiled JavaScript output
├── tsconfig.json                 # TypeScript configuration
├── jest.config.ts                # Jest test configuration
└── package.json                  # Node.js dependencies and scripts
```
