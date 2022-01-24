'use strict'

// required libraries
const logger = require('../config/logger')
const split2 = require('split2')
const rcon = require('rcon')

// retrieve arguments, ignoring the first two
const cliArgs = process.argv.slice(2)

// retrieve environment variables
const envVars = {
    RCONHOST: process.env.RCONHOST || 'localhost',
    RCONPASSWORD: process.env.RCONPASSWORD || '',
    RCONPORT: process.env.RCONPORT || 10666
}

// connect to gameServer
const gameServer = rcon(
    envVars.RCONHOST,
    envVars.RCONPORT,
    envVars.RCONPASSWORD,
    {
        tcp: false
    }
)

var authenticated = false
var queuedCommands = []

gameServer.connect()

gameServer.on('auth', function() {
  console.log("Authenticated");
  authenticated = true;

  // You must wait until this event is fired before sending any commands,
  // otherwise those commands will fail.
  //
  // This example buffers any commands sent before auth finishes, and sends
  // them all once the connection is available.

  for (var i = 0; i < queuedCommands.length; i++) {
    conn.send(queuedCommands[i])
  }
  queuedCommands = []

}).on('response', function(str) {
  console.log("Response: " + str)
}).on('error', function(err) {
  console.log("Error: " + err)
}).on('end', function() {
  console.log("Connection closed")
  process.exit()
})

module.exports = {
    gameServer
}