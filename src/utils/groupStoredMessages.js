require('dotenv').config()
const moment = require('moment')
const { admin, db } = require('../db')

async function groupStoredMessages () {
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

groupStoredMessages()