'use strict'

// required libraries
const RefreshingAuthProvider = require('@twurple/auth').RefreshingAuthProvider
const ChatClient = require('@twurple/chat').ChatClient
const fs = require('fs').promises
const logger = require('../config/logger')

// get relevant environment variables
const channels = process.env.CHANNELS.split(' ') || ['twitchandtear']
const client_id = process.env.CLIENT_ID || ''
const client_secret = process.env.CLIENT_SECRET || ''

// set up authorization for Twitch
const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'))
const authProvider = new RefreshingAuthProvider(
	{
		client_id,
		client_secret,
		onRefresh: async newTokenData => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
	},
	tokenData
)

// connect to the chat
const twitchChatClient = new ChatClient({ authProvider, channels: channels })
await twitchChatClient.connect()

module.exports = {
    twitchChatClient
}