'use strict'

// required libraries
const tmi = require('tmi.js')
const logger = require('../config/logger')

// get relevant environment variables
const bot_username = process.env.BOT_USERNAME || 'tat-zandronum'
const channels = process.env.CHANNELS.split(' ') || ['twitchandtear']
const client_id = process.env.CLIENT_ID || ''
const client_secret = process.env.CLIENT_SECRET || ''
const oauth_token = process.env.OAUTH_TOKEN || ''

// Define configuration options
const opts = {
    options: {
        debug: true,
        messagesLogLevel: "info"
    },
    connection: {
        reconnect: true,
        secure: true
    },
    identity: {
        username: bot_username,
        password: oauth_token
    },
    channels: channels
}

// Create a client with our options
const twitchChatClient = new tmi.client(opts)

// connect to the chat
twitchChatClient.connect().catch(console.error)

module.exports = {
    twitchChatClient
}