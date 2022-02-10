#!/usr/bin/env bash

# Variables
DISPLAY=":${DISPLAY:-'0'}"
VNCPORT=${VNCPORT:-'5900'}

# Logic
Xvfb ${DISPLAY} &
x11vnc -display ${DISPLAY} -rfbport ${VNCPORT} &
node index.js $@