/* eslint-disable global-require */

'use strict'

const logger = require('./config/logger')
const spawn = require('child_process')
const which = require('which')

// logic
logger.info('Connecting to Twitch...')
const twitchChatClient = require('./twitch')

// lookup xdotool
const xdotool = which.sync('xdotool')

// react to messages in the chat
twitchChatClient.onMessage((channel, user, message) => {
    if (message === '!ripandtear') {
        twitchChatClient.say(channel, 'Until it is done!');
    }
})