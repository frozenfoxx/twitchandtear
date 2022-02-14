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
  -e STREAM_KEY="[Twitch Stream Key]" \
  -e TARGETHOST="[Zandronum host]" \
  frozenfoxx/twitchandtear:latest
```

* `STREAM_KEY`: a Twitch stream key.