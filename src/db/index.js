require("dotenv").config();
const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.GOOGLE_CREDS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
});

exports.db = admin.firestore();
exports.admin = admin;
