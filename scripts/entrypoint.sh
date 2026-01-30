#!/usr/bin/env bash

# Variables
DOOMWADDIR=${DOOMWADDIR:-'/wads'}
TARGET_HOST=${TARGET_HOST:-'localhost'}
TARGET_PORT=${TARGET_PORT:-'10666'}

# Set up XDG_RUNTIME_DIR for PulseAudio
export XDG_RUNTIME_DIR="/tmp/runtime-twitchandtear"
mkdir -p "${XDG_RUNTIME_DIR}"
chmod 700 "${XDG_RUNTIME_DIR}"

# Ensure PulseAudio socket is reachable
export PULSE_SERVER="unix:/tmp/pulseaudio.socket"

# Logic

## Run supervisor
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf &

## Wait until X11 is up
echo "Waiting for Xvfb to start..."
until pidof Xvfb > /dev/null 2>&1
do
  sleep 1
done
echo "Xvfb is running."

## Wait for PulseAudio socket
echo "Waiting for PulseAudio..."
until [ -S /tmp/pulseaudio.socket ]
do
  sleep 1
done
echo "PulseAudio is running."

## Execute Zandronum
echo "Launching Zandronum, connecting to ${TARGET_HOST}:${TARGET_PORT}..."
DISPLAY=':0' DOOMWADDIR=${DOOMWADDIR} zandronum -connect "${TARGET_HOST}:${TARGET_PORT}" &

## Execute OBS
echo "Launching OBS..."
DISPLAY=':0' /usr/local/bin/obs.sh &

## Execute app
echo "Starting TwitchAndTear bot..."
cd /app
exec npm start -- "$@"
