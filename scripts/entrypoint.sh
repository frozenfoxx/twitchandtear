#!/usr/bin/env bash

# Variables
DOOMWADDIR=${DOOMWADDIR:-'/wads'}
TARGET_HOST=${TARGET_HOST:-'localhost'}
TARGET_PORT=${TARGET_PORT:-'10666'}

# Logic
## Start dbus
dbus-uuidgen > /var/lib/dbus/machine-id
dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address

## Run supervisor
su twitchandtear -c "/usr/bin/supervisord -c /etc/supervisor/supervisord.conf" &

## Wait until X11 is up
until pids=$(pidof Xvfb)
do
  sleep 1
done

## Execute Zandronum
su twitchandtear -c "DISPLAY=':0' DOOMWADDIR=${DOOMWADDIR} zandronum -connect ${TARGET_HOST}:${TARGET_PORT}" &

## Execute OBS
su twitchandtear -c "DISPLAY=':1' /usr/local/bin/obs.sh" &

## Execute app
cd /app
su twitchandtear -c "node index.js"