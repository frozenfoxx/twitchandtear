'use strict'

const logger = require('../config/logger')
const which = require('which')

// lookup the server binary
var gameExe = which.sync('zandronum-server')

function launch() {
    logger.info("Found gameExe at" + gameExe)
}

module.exports = {
    launch
}