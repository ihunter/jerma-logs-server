require("dotenv").config();
const admin = require("firebase-admin");
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID)
console.log("USER:", process.env.USER)
console.log("CHANNEL:", process.env.CHANNEL)

const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://jerma-logs.firebaseio.com",
});

exports.db = admin.firestore();
exports.admin = admin;
