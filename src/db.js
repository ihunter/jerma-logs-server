const admin = require('firebase-admin')
const firebase = require("firebase/app")

const serviceAccount = {
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.FIREBASE_CLIENT_EMAIL
}


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jerma-logs.firebaseio.com"
})

const secondaryServiceAccount = {
  "project_id": process.env.DEBT_FIREBASE_PROJECT_ID,
  "private_key": process.env.DEBT_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  "client_email": process.env.DEBT_FIREBASE_CLIENT_EMAIL
}

const secondary = admin.initializeApp({
  credential: admin.credential.cert(secondaryServiceAccount),
  databaseURL: "https://jerma-debt.firebaseio.com"
}, 'secondary')

module.exports.db = admin.firestore()
module.exports.admin = admin

module.exports.debtDB = secondary.database()
module.exports.firebase = firebase

