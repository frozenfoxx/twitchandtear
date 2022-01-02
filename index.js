/* eslint-disable global-require */

'use strict'

const logger = require('./config/logger')
const twitch = require('./twitch')

// logic
logger.info('Launching game server...')
const game = require('./game')
