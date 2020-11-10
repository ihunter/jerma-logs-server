require('dotenv').config()
const tmi = require('tmi.js')
const moment = require('moment')
const { admin, db, firebase, debtDB } = require('./db')

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
  channels: [process.env.CHANNEL]
})

// Register event handlers
client.on('message', onMessageHandler)
client.on('subgift',  onSubGiftHandler)

// Connect to Twitch
client.connect()

// Event handlers
function onMessageHandler (channel, tags, message, self) {
  // logMessage(tags, message)
}

function onSubGiftHandler (channel, username, streakMonths, recipient, methods, userstate) {
  logGiftSubsByJerma(username, 1)
}

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
    console.log('Message Saved Successfully')
  } catch (error) {
    console.log('Error saving message:', error)
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
    console.log(`${+messageData.sentAt} | ${dateYearMonth}`)
    console.log('Message Grouped Successfully')
  } catch (error) {
    console.log('Error grouping message:', error)
  }
}

async function logGiftSubsByJerma (username, numbOfSubs) {
  if (process.env.USER !== username) return

  try {
    await debtDB
      .ref('/totalsubs')
      .set(firebase.database.ServerValue.increment(numbOfSubs))
  } catch (error) {
    console.log('Error incrementing gift sub count', error)
  }
}
