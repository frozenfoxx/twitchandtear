#!/usr/bin/env bash

# Variables
DOOMWADDIR=${DOOMWADDIR:-'/wads'}
TARGET_HOST=${TARGET_HOST:-'localhost'}
TARGET_PORT=${TARGET_PORT:-'10666'}
TARGET_PASSWORD=${TARGET_PASSWORD:-''}

# Check for auth mode
if [ "$1" = "--auth" ] || [ "$1" = "auth" ]; then
  echo "Running in authorization mode..."
  cd /app
  exec npm run auth
fi

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

## Build Zandronum command
ZANDRONUM_CMD="zandronum -connect ${TARGET_HOST}:${TARGET_PORT}"
if [ -n "${TARGET_PASSWORD}" ]; then
  ZANDRONUM_CMD="${ZANDRONUM_CMD} +cl_password ${TARGET_PASSWORD}"
fi

## Execute Zandronum
echo "Launching Zandronum, connecting to ${TARGET_HOST}:${TARGET_PORT}..."
DISPLAY=':0' DOOMWADDIR=${DOOMWADDIR} ${ZANDRONUM_CMD} &

## Execute OBS
echo "Launching OBS..."
DISPLAY=':0' /usr/local/bin/obs.sh &

## Execute app
echo "Starting TwitchAndTear bot..."
cd /app
exec npm start -- "$@"
