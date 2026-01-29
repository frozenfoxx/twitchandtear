#!/usr/bin/env bash

# Variables
DOOMWADDIR=${DOOMWADDIR:-'/wads'}
TARGET_HOST=${TARGET_HOST:-'localhost'}
TARGET_PORT=${TARGET_PORT:-'10666'}

# Logic

## Run supervisor
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf &

## Wait until X11 is up
until pids=$(pidof Xvfb)
do
  sleep 1
done

## Execute Zandronum
DISPLAY=':0' DOOMWADDIR=${DOOMWADDIR} zandronum -connect ${TARGET_HOST}:${TARGET_PORT} &

## Execute OBS
DISPLAY=':1' /usr/local/bin/obs.sh &

## Execute app
cd /app
npm start $@