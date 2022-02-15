# twitchandtear

[![Build Status](https://cloud.drone.io/api/badges/frozenfoxx/twitchandtear/status.svg?ref=refs/heads/main)](https://cloud.drone.io/frozenfoxx/twitchandtear)

[Twitch](https://twitch.tv/) integration for [Zandronum](https://zandronum.com/).

Docker Hub: [https://hub.docker.com/r/frozenfoxx/twitchandtear](https://hub.docker.com/r/frozenfoxx/twitchandtear)

# Features

Implemented:


Planned:
* Third person follow spectate.
* Chatbot command to switch character spectating.
* Send messages from the chat to the server.
* Launch scripts via RCON if the server supports it.

# Requirements

* A Twitch [app](https://dev.twitch.tv/console/apps/create)

# Usage

## Docker

```
docker run -it --rm \
  -v /path/to/wads:/wads \
  -e CHANNELS="[space delimited list of channels to connect to]" \
  -e CLIENT_ID="[Twitch client id]" \
  -e CLIENT_SECRET="[Twitch client secret"] \
  -e STREAM_KEY="[Twitch Stream Key]" \
  -e TARGETHOST="[Zandronum host]" \
  frozenfoxx/twitchandtear:latest
```

* `CHANNELS`: Twitch channels to connec to.
* `CLIENT_ID`: a Twitch application Client ID.
* `CLIENT_SECRET`: a Twitch application Client Secret.
* `STREAM_KEY`: a Twitch stream key.
* `TARGET_HOST`: Zandronum host to connect to.