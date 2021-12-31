/* eslint-disable global-require */

'use strict'

const game = require('./game')
const logger = require('./config/logger')
const twitch = require('./twitch')

// retrieve arguments, ignoring the first two
const cliArgs = process.argv.slice(2)

// logic
logger.info('Starting up')
logger.info('Launching game server...')

game.launch(cliArgs)