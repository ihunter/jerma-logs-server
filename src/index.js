require('dotenv').config()
const tmi = require('tmi.js')
const { db } = require('./db')

// Create a client with options
const client = new tmi.client({
  connection: {
		secure: true,
		reconnect: true
	},
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: process.env.CHANNELS.split(',')
})

// Register event handlers
client.on('message', onMessageHandler)

// Connect to Twitch
client.connect()

// On message handler
function onMessageHandler (channel, tags, message, self) {
  logMessage(tags, message)
}

// Log messages to firebase firestore
async function logMessage (tags, message) {
  const usernames = process.env.CHANNELS.split(',')

  if (!usernames.includes(tags.username)) return

  const messagesCollectionRef = db.collection('messages')

  try {
    await messagesCollectionRef.doc(tags.id).set({
      id: tags['id'],
      displayName: tags['display-name'],
      userID: tags['user-id'],
      username: tags['username'],
      sentAt: tags['tmi-sent-ts'],
      badgeInfo: tags['badge-info'],
      badges: tags['badges'],
      color: tags['color'],
      emotes: tags['emotes'],
      flags: tags['flags'],
      mod: tags['mod'],
      roomID: tags['room-id'],
      subscriber: tags['subscriber'],
      turbo: tags['turbo'],
      userType: tags['user-type'],
      emotesRaw: tags['emotes-raw'],
      badgeInfoRaw: tags['badge-info-raw'],
      badgesRaw: tags['badges-raw'],
      messageType: tags['message-type'],
      message: message
    })
  } catch (error) {
    console.log('Error saving to firebase:', error)
  } finally {
    console.log('Message Saved Successfully')
  }
}

// {
//   'badge-info': null,
//   badges: { broadcaster: '1', premium: '1' },
//   color: '#1E90FF',
//   'display-name': 'ModusPwnens',
//   emotes: null,
//   flags: null,
//   id: 'e1ed2752-41c2-4543-9e9c-00ba48f491b9',
//   mod: false,
//   'room-id': '42521344',
//   subscriber: false,
//   'tmi-sent-ts': '1588302664175',
//   turbo: false,
//   'user-id': '42521344',
//   'user-type': null,
//   'emotes-raw': null,
//   'badge-info-raw': null,
//   'badges-raw': 'broadcaster/1,premium/1',
//   username: 'moduspwnens',
//   'message-type': 'chat'
// }
