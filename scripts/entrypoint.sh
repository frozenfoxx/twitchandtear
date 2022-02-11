#!/usr/bin/env bash

# Variables
DOOMWADDIR=${DOOMWADDIR:-'/wads'}
TARGETHOST=${TARGETHOST:-'localhost'}
TARGETPORT=${TARGETPORT:-'10666'}

# Logic
## Run supervisor
/usr/bin/supervisord -c /etc/supervisor/supervisord.conf &

## Wait until X11 is up
until pids=$(pidof Xvfb)
do
  sleep 1
done

## Execute Zandronum
zandronum -connect ${TARGETHOST}:${TARGETPORT} &

## Execute app
node index.js