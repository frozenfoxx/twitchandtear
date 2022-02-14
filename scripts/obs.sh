#!/usr/bin/env bash

# Variables
STREAM_KEY=${STREAM_KEY:-''}

# Logic
cat ~/service_template.json | envsubst > ~/.config/obs-studio/basic/profiles/Twitch/service.json

exec obs \
	--startstreaming \
	--profile Twitch \
	--scene Default