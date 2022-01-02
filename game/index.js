'use strict'

// required libraries
const logger = require('../config/logger')
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
        stdio: "inherit",
        stdout: "inherit"
    }
)

gameServer.on('exit', function(code, signal) {
    logger.info("Game server exited with " + `code ${code} and signal ${signal}`)
})

module.exports = {
    gameServer
}