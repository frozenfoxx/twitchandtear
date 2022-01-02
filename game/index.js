'use strict'

// required libraries
const logger = require('../config/logger')
const split2 = require('split2')
const spawn = require('cross-spawn')
const which = require('which')

// lookup the server binary
const gameExe = which.sync('zandronum-server')

// retrieve arguments, ignoring the first two
const cliArgs = process.argv.slice(2)

// retrieve environment variables
const envVars = {
    DOOMWADDIR: process.env.DOOMWADDIR || '/wads'
}

// launch gameServer
const gameServer = spawn(
    gameExe,
    cliArgs,
    {
        env: {
            DOOMWADDIR: envVars.DOOMWADDIR
        },
        stdio: "pipe"
    }
)

// Parse the server output
gameServer.stdout.pipe(split2()).on('data', (data) => {
    logger.verbose(data)
})

// on exit, dump a message about what happened
gameServer.on('exit', function(code, signal) {
    logger.info("Game server exited with " + `code ${code} and signal ${signal}`)
})

module.exports = {
    gameServer
}