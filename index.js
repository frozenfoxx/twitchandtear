/* eslint-disable global-require */

'use strict'

const game = require('./game')
const logger = require('./config/logger')

logger.info('Starting up')
logger.info('Launching game server...')

game.launch()