'use strict'

// required libraries
const logger = require('../config/logger')
const spawn = require('cross-spawn')
const split2 = require('split2')
const which = require('which')
const Xvfb = require('xvfb')

// lookup the server binary
const gameExe = which.sync('zandronum')

// retrieve environment variables
const envVars = {
  DISPLAY: process.env.DISPLAY || '0',
  DOOMWADDIR: envVars.DOOMWADDIR || '/wads',
  TARGETHOST: process.env.TARGETHOST || 'localhost',
  TARGETPORT: process.env.TARGETPORT || 10666,
  RCONPASSWORD: process.env.RCONPASSWORD || ''
}

// start the Xvfb
const xvfb = new Xvfb(envVars.DISPLAY)
xvfb.startSync()

// launch game
const game = spawn(
  gameExe,
  [
    "-connect",
    `${envVars.TARGETHOST}:${envVars.TARGETPORT}`
  ],
  {
    env: {
      envVars
    },
    stdio: [
      "inherit", //stdin
      "pipe",    //stdout
      "pipe"     //stderr
    ]
  }
)

// Parse the game output
game.stdout.pipe(split2()).on('data', (data) => {
  logger.verbose(data)
})

game.stderr.pipe(split2()).on('data', (data) => {
  logger.verbose(data)
})

// on exit, dump a message about what happened
game.on('exit', function(code, signal) {
  logger.info(`Game exited with code ${code} and signal ${signal}`)
  xvfb.stopSync()
})

module.exports = {
  game
}