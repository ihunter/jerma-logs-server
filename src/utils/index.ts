import type { MessageData, TmiTags } from '../types'
import { FieldValue } from 'firebase-admin/firestore'
import moment from 'moment'
import { db } from '../db'
import 'dotenv/config'

function formatMessage(tags: TmiTags, message: string): MessageData {
  return {
    id: tags.id,
    displayName: tags['display-name'],
    userID: tags['user-id'],
    username: tags.username,
    sentAt: tags['tmi-sent-ts'],
    badgeInfo: tags['badge-info'],
    badges: tags.badges,
    color: tags.color,
    emotes: tags.emotes,
    flags: tags.flags,
    mod: tags.mod,
    roomID: tags['room-id'],
    subscriber: tags.subscriber,
    turbo: tags.turbo,
    userType: tags['user-type'],
    emotesRaw: tags['emotes-raw'],
    badgeInfoRaw: tags['badge-info-raw'],
    badgesRaw: tags['badges-raw'],
    messageType: tags['message-type'],
    message,
    reply: {
      parent: {
        displayName: tags['reply-parent-display-name'],
        msgBody: tags['reply-parent-msg-body'],
        msgID: tags['reply-parent-msg-id'],
        userID: tags['reply-parent-user-id'],
        userLogin: tags['reply-parent-user-login'],
      },
      threadParent: {
        displayName: tags['reply-thread-parent-display-name'],
        msgID: tags['reply-thread-parent-msg-id'],
        userID: tags['reply-thread-parent-user-id'],
        userLogin: tags['reply-thread-parent-user-login'],
      },
    },
  }
}

async function logSus(messageData: MessageData) {
  if (messageData?.message?.match(/^!(commands\sedit|editcom)\s(-(cd|ul|a)=\w+\s)*!sus\s.+/) === null)
    return

  const susCollectionRef = db.collection('sus')

  try {
    if (!messageData.id)
      throw new TypeError('Message ID undefined')
    await susCollectionRef.doc(messageData.id).set(messageData)
  }
  catch (error) {
    console.error('Error Saving Sus:', error)
  }
}

// Log messages to firebase firestore
async function logMessage(messageData: MessageData) {
  const messagesCollectionRef = db.collection('messages')

  try {
    if (!messageData.id)
      throw new TypeError('Message ID undefined')
    await messagesCollectionRef.doc(messageData.id).set(messageData)
  }
  catch (error) {
    console.error('Error Saving Message:', error)
  }
}

async function logTestMessage(messageData: MessageData) {
  const messagesCollectionRef = db.collection('testMessages')

  try {
    if (!messageData.id)
      throw new TypeError('Message ID undefined')
    await messagesCollectionRef.doc(messageData.id).set(messageData)
  }
  catch (error) {
    console.error('Error Saving Message:', error)
  }
}

async function groupMessage(messageData: MessageData) {
  const messagesByMonthCollectionRef = db.collection('messagesByMonth')

  try {
    if (!messageData.sentAt)
      throw new TypeError('Message sentAt undefined')
    const dateYearMonth = moment(Number.parseInt(messageData.sentAt)).format(
      'MMMM-YYYY',
    )
    const groupDoc = await messagesByMonthCollectionRef
      .doc(dateYearMonth)
      .get()

    if (groupDoc.exists) {
      await messagesByMonthCollectionRef.doc(dateYearMonth).update({
        messages: FieldValue.arrayUnion(messageData),
      })
    }
    else {
      await messagesByMonthCollectionRef.doc(dateYearMonth).set({
        messages: FieldValue.arrayUnion(messageData),
      })
    }
  }
  catch (error) {
    console.error('Error Grouping Message:', error)
  }
}

async function groupMessageByYearAndMonth(messageData: MessageData) {
  if (!messageData.sentAt)
    throw new TypeError('Message sentAt undefined')
  const year = moment(Number.parseInt(messageData.sentAt)).format('YYYY')
  const month = moment(Number.parseInt(messageData.sentAt)).format('MMMM')

  const messagesByYearAndMonthCollectionRef = db
    .collection('messagesByYear')
    .doc(year)
    .collection('messagesByMonth')
    .doc(month)

  try {
    const yearDocRef = db.collection('messagesByYear').doc(year)
    await yearDocRef.set({ year })

    const groupDoc = await messagesByYearAndMonthCollectionRef.get()

    if (groupDoc.exists) {
      await messagesByYearAndMonthCollectionRef.update({
        messages: FieldValue.arrayUnion(messageData),
      })
    }
    else {
      await messagesByYearAndMonthCollectionRef.set({
        messages: FieldValue.arrayUnion(messageData),
      })
    }
  }
  catch (error) {
    console.error('Error Grouping Message:', error)
  }
}

async function groupStoredMessages() {
  const messagesCollectionRef = db.collection('messages')
  const messagesByMonthCollectionRef = db.collection('messagesByMonth')

  try {
    const messagesSnapshot = await messagesCollectionRef.get()

    messagesSnapshot.forEach(async (messageDoc) => {
      const messageData = messageDoc.data()
      const dateYearMonth = moment(Number.parseInt(messageData.sentAt)).format(
        'MMMM-YYYY',
      )

      try {
        const groupDoc = await messagesByMonthCollectionRef
          .doc(dateYearMonth)
          .get()

        if (groupDoc.exists) {
          await messagesByMonthCollectionRef.doc(dateYearMonth).update({
            messages: FieldValue.arrayUnion(messageData),
          })
        }
        else {
          await messagesByMonthCollectionRef.doc(dateYearMonth).set({
            messages: FieldValue.arrayUnion(messageData),
          })
        }
      }
      catch (error) {
        console.error('Error grouping message:', error)
      }
    })
  }
  catch (error) {
    console.error('Error fetching messages:', error)
  }
}

async function groupStoredMessagesByYearAndMonth() {
  const messagesCollectionRef = db.collection('messages')
  try {
    const messagesSnapshot = await messagesCollectionRef.get()

    messagesSnapshot.forEach(async (messageDoc) => {
      const messageData = messageDoc.data()
      if (!messageData.sentAt)
        throw new TypeError('Message sentAt undefined')
      const year = moment(Number.parseInt(messageData.sentAt)).format('YYYY')
      const month = moment(Number.parseInt(messageData.sentAt)).format('MMMM')

      const messagesByYearCollectionRef = db
        .collection('messagesByYear')
        .doc(year)
        .collection('messagesByMonth')
        .doc(month)

      try {
        const yearDocRef = db.collection('messagesByYear').doc(year)
        await yearDocRef.set({ year })

        const doc = await messagesByYearCollectionRef.get()

        if (doc.exists) {
          await messagesByYearCollectionRef.update({
            messages: FieldValue.arrayUnion(messageData),
          })
        }
        else {
          await messagesByYearCollectionRef.set({
            messages: FieldValue.arrayUnion(messageData),
          })
        }
      }
      catch (error) {
        console.error('Error grouping message:', error)
      }
    })
  }
  catch (error) {
    console.error('Error fetching messages:', error)
  }
}

async function deleteMessagesByUsername(username: string) {
  const messagesCollectionRef = db.collection('messages')
  const q = messagesCollectionRef.where('username', '==', username)

  const snapshot = await q.get()

  if (snapshot.empty)
    return

  const batchSize = 500

  let batch = db.batch()
  let count = 0

  for (const doc of snapshot.docs) {
    batch.delete(doc.ref)
    count++

    if (count % batchSize === 0) {
      await batch.commit()
      batch = db.batch()
    }
  }

  if (count % batchSize !== 0) {
    await batch.commit()
  }

  // eslint-disable-next-line no-console
  console.log(`Deleted ${count} document(s) from messages.`)
}

export {
  deleteMessagesByUsername,
  formatMessage,
  groupMessage,
  groupMessageByYearAndMonth,
  groupStoredMessages,
  groupStoredMessagesByYearAndMonth,
  logMessage,
  logSus,
  logTestMessage,
}
