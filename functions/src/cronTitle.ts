import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import dayjs from "dayjs";
import { Testing } from "./types";
import { updateVideoTitle } from "./upload-title";

export const updateTitleEveryDay = functions.pubsub
  // .schedule("* * * * *")
  .schedule("0 0 * * *") // minute hour day month day(week)
  .onRun(async () => {
    console.log("update title every day at midnight");
    try {
      const snapshot = await admin
        .firestore()
        .collectionGroup("testings")
        .where("type", "==", "title")
        .where("status", "==", "ongoing")
        .get();

      const tests = snapshot.docs.map((doc) => doc.data()) as Testing[];

      // update title for each test
      const promiseArray = tests.map(async (test) => {
        const { startDate, duration, channelId, id } = test;
        if (!duration) return null;
        const endDate = dayjs(startDate).add(duration, "day");
        const now = dayjs();
        if (endDate.isBefore(now)) {
          // 1. don't update title
          // 2. make as complete
          const testingRef = await admin
            .firestore()
            .doc(`channels/${channelId}/testings/${id}`);

          const input: Partial<Testing> = { status: "complete" };

          testingRef.set(input, { merge: true });
          return;
        } else {
          // 1. update title
          return await updateVideoTitle(test);
        }
      });

      const results = await Promise.all(promiseArray);

      console.log("results", results);
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  });
