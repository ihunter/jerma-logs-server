require('dotenv').config()
const moment = require('moment')
const { admin, db } = require('../db')

function formatMessage(tags, message) {
  return {
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
}

// Log messages to firebase firestore
exports.logMessage = async (tags, message) => {
  const messagesCollectionRef = db.collection('messages')

  const messageData = formatMessage(tags, message)

  try {
    await messagesCollectionRef.doc(tags.id).set(messageData)
  } catch (error) {
    console.log('Error Saving Message:', error)
  }
}

exports.groupMessage = async (tags, message) => {
  const messagesByMonthCollectionRef = db.collection('messagesByMonth')

  const messageData = formatMessage(tags, message)

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

exports.groupMessageByYearAndMonth = async (tags, message) => {
  const messageData = formatMessage(tags, message)

  const year = moment(+messageData.sentAt).format('YYYY')
  const month = moment(+messageData.sentAt).format('MMMM')

  
  const messagesByYearAndMonthCollectionRef = db.collection('messagesByYear').doc(year).collection('messagesByMonth').doc(month)

  try {
    const groupDoc = await messagesByYearAndMonthCollectionRef.get()

    if (groupDoc.exists) {
      await messagesByYearAndMonthCollectionRef.update({
        messages: admin.firestore.FieldValue.arrayUnion(messageData)
      })
    } else {
      await messagesByYearAndMonthCollectionRef.set({
        messages: admin.firestore.FieldValue.arrayUnion(messageData)
      })
    }
  } catch (error) {
    console.log('Error Grouping Message:', error)
  }
}

exports.groupStoredMessages = async () => {
  const messagesCollectionRef = db.collection('messages')
  const messagesByMonthCollectionRef = db.collection('messagesByMonth')

  try {
    const messagesSnapshot = await messagesCollectionRef.get()

    messagesSnapshot.forEach(async messageDoc => {
      const messageData = messageDoc.data()
      const dateYearMonth = moment(+messageData.sentAt).format('MMMM-YYYY')
      
      try {
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
        console.log('Error grouping message:', error)
      }
    })
  } catch (error) {
    console.log('Error fetching messages:', error)
  }
}

exports.groupStoredMessagesByYearAndMonth = async () => {
  const messagesCollectionRef = db.collection('messages')
  try {
    const messagesSnapshot = await messagesCollectionRef.get()

    messagesSnapshot.forEach(async messageDoc => {
      const messageData = messageDoc.data()
      const year = moment(+messageData.sentAt).format('YYYY')
      const month = moment(+messageData.sentAt).format('MMMM')

      const messagesByYearCollectionRef = db.collection('messagesByYear').doc(year).collection('messagesByMonth').doc(month)
      
      try {
        const doc = await messagesByYearCollectionRef.get()
    
        if (doc.exists) {
          await messagesByYearCollectionRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(messageData)
          })
        } else {
          await messagesByYearCollectionRef.set({
            messages: admin.firestore.FieldValue.arrayUnion(messageData)
          })
        }
      } catch (error) {
        console.log('Error grouping message:', error)
      }
    })
  } catch (error) {
    console.log('Error fetching messages:', error)
  }
}
