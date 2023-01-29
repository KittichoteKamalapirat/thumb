import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1");

connectFirestoreEmulator(firestore, "localhost", 8080); // remove this line when using cloud firestore
connectStorageEmulator(storage, "localhost", 9199);
connectFunctionsEmulator(functions, "localhost", 5001);

export const createAndSaveTokens = httpsCallable(
  functions,
  "createAndSaveTokens"
);

export const listVideos = httpsCallable(functions, "authAndlistVids");
export const getAuthURLCall = httpsCallable(functions, "getAuthURLCall");
export const getVidList = httpsCallable(functions, "getVidList");
export const googleLogout = httpsCallable(functions, "googleLogout");
export const updateThumbnail = httpsCallable(functions, "updateThumbnail");
export const getStats = httpsCallable(functions, "getStats");
export const logAfter10Sec = httpsCallable(functions, "logAfter10Sec");
export const createHelloPubsub = httpsCallable(functions, "createHelloPubsub");
export const getStatsOneVid = httpsCallable(functions, "getStatsOneVid");
export const updateTitleEveryMinute = httpsCallable(
  functions,
  "updateTitleEveryMinute"
);

export const createAndSaveTokensCall = httpsCallable(
  functions,
  "createAndSaveTokensCall"
);
