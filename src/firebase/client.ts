import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { MyUpload } from "../components/CreateThumbTest";
import { SummaryItem } from "../pages/testing";
import { firebaseConfig } from "./config";
import { Testing } from "./types/Testing.type";
import { createFunction } from "./utils/createFunction";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, "us-central1");

connectFirestoreEmulator(firestore, "localhost", 8080); // remove this line when using cloud firestore
connectStorageEmulator(storage, "localhost", 9199);
connectFunctionsEmulator(functions, "localhost", 5001);

export const googleLogout = createFunction<string, boolean>("googleLogout");
export const getStatsOneVid = createFunction<Testing, SummaryItem[] | null>(
  "getStatsOneVid"
);
export const getAuthURLCall = createFunction<null, string>("getAuthURLCall");
export const getVidList = createFunction<string, MyUpload[]>("getVidList");
export const createAndSaveTokens = createFunction<
  string,
  { channelId: string }
>("createAndSaveTokens");

// export const getVidList = httpsCallable(functions, "getVidList");
// export const googleLogout = httpsCallable(functions, "googleLogout");
// export const getStats = httpsCallable(functions, "getStats");
// export const logAfter10Sec = httpsCallable(functions, "logAfter10Sec");
// export const createHelloPubsub = httpsCallable(functions, "createHelloPubsub");
// export const getStatsOneVid = httpsCallable(functions, "getStatsOneVid");
// export const updateTitleEveryMinute = httpsCallable(
//   functions,
//   "updateTitleEveryMinute"
// );
// export const createAndSaveTokensCall = httpsCallable(
//   functions,
//   "createAndSaveTokensCall"
// );
// export const listVideos = httpsCallable(functions, "authAndlistVids");
// export const getAuthURLCall = httpsCallable(functions, "getAuthURLCall");
// export const createAndSaveTokens = httpsCallable(
//   functions,
//   "createAndSaveTokens"
// );
