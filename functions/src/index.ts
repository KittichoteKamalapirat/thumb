import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export * from "./analytics";
export * from "./upload-title";
export * from "./upload-thumb";
export * from "./get-vids";
// export * from "./youtube";
export * from "./cron";
export * from "./auth";
