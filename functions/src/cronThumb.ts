import dayjs from "dayjs";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Testing } from "./types";
import { updateVideoThumb } from "./upload-thumb";

export const updateThumbEveryDay = functions.pubsub
  // .schedule("* * * * *")
  .schedule("0 0 * * *") // minute hour day month day(week)
  .onRun(async () => {
    console.log("update thumbnail every day at midnight");
    try {
      const snapshot = await admin
        .firestore()
        .collectionGroup("testings")
        .where("type", "==", "thumb")
        .where("status", "==", "ongoing")
        .get();

      const tests = snapshot.docs.map((doc) => doc.data()) as Testing[];

      // update thumb for each test
      const promiseArray = tests.map(async (test) => {
        const { startDate, duration, channelId, id } = test;
        if (!duration) return null;
        const endDate = dayjs(startDate).add(duration, "day");
        const now = dayjs();
        if (endDate.isBefore(now)) {
          // 1. don't update thumb
          // 2. make as complete
          const testingRef = await admin
            .firestore()
            .doc(`channels/${channelId}/testings/${id}`);

          const input: Partial<Testing> = { status: "complete" };

          testingRef.set(input, { merge: true });
          return;
        } else {
          // 1. update thumb
          return await updateVideoThumb(test);
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
