import "dotenv/config";
import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: applicationDefault(),
  databaseURL: "https://jerma-logs.firebaseio.com",
});

const db = getFirestore(app);

export { db };
