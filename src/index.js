require('dotenv').config()
const tmi = require('tmi.js')
const moment = require('moment')
const { admin, db } = require('./db')

// Create a client with options
const client = new tmi.client({
  skipMembership: true,
  channels: [process.env.CHANNEL]
})

// Register event handlers
client.on('message', (channel, tags, message, self) => {
  logMessage(tags, message)
})

// Connection events
client.on('connecting', (address, port) => {
  console.log('Connecting:', address, port)
})

client.on('connected', (address, port) => {
  console.log('Connected:', address, port)
})

client.on('disconnected', (reason) => {
  console.log('Disconnected:', reason)
})

client.on("reconnect", () => {
  console.log('Attempting to reconnect')
})

// Connect to Twitch
client.connect()

// Log messages to firebase firestore
async function logMessage (tags, message) {
  const username = process.env.USER

  if (username !== tags.username) return

  const messagesCollectionRef = db.collection('messages')
  const messagesByMonthCollectionRef = db.collection('messagesByMonth')

  const messageData = {
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
  }

  try {
    await messagesCollectionRef.doc(tags.id).set(messageData)
  } catch (error) {
    console.log('Error Saving Message:', error)
  }

  try {
    const dateYearMonth = moment(+messageData.sentAt).format('MMMM-YYYY')
    const groupDoc = await messagesByMonthCollectionRef.doc(dateYearMonth).get()

    if (groupDoc.exists) {
      await messagesByMonthCollectionRef.doc(dateYearMonth).update({
        messages: admin.firestore.FieldValue.arrayUnion(messageData)
      })
    } else {
      await messagesByMonthCollectionRef.doc(dateYearMonth).set({
        messages: admin.firestore.FieldValue.arrayUnion(messageData)
      })
    }
  } catch (error) {
    console.log('Error Grouping Message:', error)
  }
}
