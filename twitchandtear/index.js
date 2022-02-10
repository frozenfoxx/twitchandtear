/* eslint-disable global-require */

'use strict'

const logger = require('./config/logger')
const spawn = require('child_process')
const which = require('which')

// logic
logger.info('Connecting to game server...')
const game = require('./game')

logger.info('Connecting to Twitch...')
const twitch = require('./twitch')

// lookup xdotool
const xdotool = which.sync('xdotool')