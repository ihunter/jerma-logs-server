require('dotenv').config()
const moment = require('moment')
const { admin, db } = require('../db')

async function groupStoredMessages () {
  const messagesCollectionRef = db.collection('messages')
  const messagesByMonthCollectionRef = db.collection('messagesByMonth')

  try {
    const messagesSnapshot = await messagesCollectionRef.get()

    let count = 0
    messagesSnapshot.forEach(async messageDoc => {
      count += 1
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
    
        console.log('Message Grouped Successfully')
      } catch (error) {
        console.log('Error grouping message:', error)
      }
    })
    console.log(count)
  } catch (error) {
    console.log('Error fetching messages:', error)
  }
}

groupStoredMessages()