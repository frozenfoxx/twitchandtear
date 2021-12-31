'use strict'

// required libraries
const logger = require('../config/logger')
const spawn = require('cross-spawn')
const which = require('which')

// lookup the server binary
var gameExe = which.sync('zandronum-server')

// retrieve environment variables
const envVars = {
    DOOMWADDIR: process.env.DOOMWADDIR || '/wads'
}

function launch(args) {
    logger.info("Launching zandronum-server...")
    const gameServer = spawn(
        gameExe,
        args,
        {
            env: {
                DOOMWADDIR: envVars.DOOMWADDIR
            },
            stdio: 'inherit',
            stdout: 'inherit'
        }
    )
}

module.exports = {
    launch
}