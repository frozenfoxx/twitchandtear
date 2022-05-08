/* eslint-disable global-require */

'use strict'

const logger = require('./config/logger')
const which = require('which')
const { spawn } = require('child_process')

// logic
logger.info('Connecting to Twitch...')
const twitch = require('./twitch')

// lookup xdotool
const xdotool = which.sync('xdotool')

// react to messages in the chat
twitch.streamChat.on('message', (channel, tags, message, self) => {
    // don't do anything if it's our own message
    if (self) return

    // bit of humor
    if (message.toLowerCase() === '!ripandtear') {
        twitch.streamChat.say(channel, 'Until it is done!')
    }

    // good memory
    if (message.toLowerCase() === '!iddqd') {
        twitch.streamChat.say(channel, `Your memory serves you well, @${tags.username}`)
    }

    // spectate next player
    if (message.toLowerCase() === '!nextplayer') {
        spawn(xdotool, ["key", "F12"])
        twitch.streamChat.say(channel, 'Viewing the next player...')
    }

    // spectate previous player
    if (message.toLowerCase() === '!prevplayer') {
        spawn(xdotool, ["key", "F11"])
        twitch.streamChat.say(channel, 'Viewing the previous player...')
    }
})