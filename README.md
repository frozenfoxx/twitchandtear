# twitchandtear

[![Actions Status](https://github.com/frozenfoxx/twitchandtear/workflows/build/badge.svg)](https://github.com/frozenfoxx/twitchandtear/actions)

[Twitch](https://twitch.tv/) integration for [Zandronum](https://zandronum.com/).

A TypeScript-based Docker container that provides live streaming spectator mode for Doom multiplayer games using Zandronum, OBS Studio, and Twitch chat integration.

Docker Hub: [https://hub.docker.com/r/frozenfoxx/twitchandtear](https://hub.docker.com/r/frozenfoxx/twitchandtear)

# Features

* First person follow spectate
* Chatbot commands to switch character spectating

Planned:
* Send messages from the chat to the server
* Launch scripts via RCON if the server supports it

# Twitch Commands

* `!nextplayer`: spectate the next player
* `!prevplayer`: spectate the previous player

# Requirements

* Docker (for containerized deployment)
* A Twitch [app](https://dev.twitch.tv/console/apps/create)
* Node.js 18+ (for local development)
* TypeScript 5.3+ (for local development)

# Usage

## Docker

```
docker run -it --rm \
  -v /path/to/wads:/wads \
  -e CHANNELS="[space delimited list of channels to connect to]" \
  -e CLIENT_ID="[Twitch bot client id]" \
  -e CLIENT_SECRET="[Twitch bot client secret"] \
  -e OAUTH_TOKEN="[Twitch bot Oauth token]" \
  -e STREAM_KEY="[Twitch Stream Key]" \
  -e TARGET_HOST="[Zandronum host]" \
  frozenfoxx/twitchandtear:latest
```

* `CHANNELS`: Twitch channels to connect to.
* `CLIENT_ID`: a Twitch application Client ID.
* `CLIENT_SECRET`: a Twitch application Client Secret.
* `OAUTH_TOKEN`: a Twitch stream Oauth 2 token.
* `STREAM_KEY`: a Twitch stream key.
* `TARGET_HOST`: Zandronum host to connect to.

## Local Development

### Building

```bash
cd twitchandtear
npm install
npm run build
```

### Running

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## Project Structure

```
twitchandtear/
├── src/
│   ├── config/
│   │   └── logger.ts          # Winston logger configuration
│   ├── twitch/
│   │   └── index.ts           # Twitch chat bot client
│   ├── types/
│   │   └── env.d.ts           # Environment variable type definitions
│   └── index.ts               # Main application entry point
├── dist/                      # Compiled JavaScript output
├── tsconfig.json              # TypeScript configuration
└── package.json               # Node.js dependencies and scripts
```