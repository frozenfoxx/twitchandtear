'use strict'

// required libraries
const ChatClient = require('@twurple/chat').ChatClient
const ClientCredentialsAuthProvider = require('@twurple/auth').ClientCredentialsAuthProvider
const fs = require('fs').promises
const logger = require('../config/logger')

// get relevant environment variables
const channels = process.env.CHANNELS.split(' ') || ['twitchandtear']
const client_id = process.env.CLIENT_ID || ''
const client_secret = process.env.CLIENT_SECRET || ''

// set up authorization for Twitch
const authProvider = new ClientCredentialsAuthProvider(client_id, client_secret)

// connect to the chat
const twitchChatClient = new ChatClient({ authProvider, channels: channels })
await twitchChatClient.connect()

module.exports = {
    twitchChatClient
}