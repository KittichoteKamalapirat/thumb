import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import dayjs from "dayjs";
import { TitleTesting } from "./types";
import { updateVideoTitle } from "./upload-title";

export const updateTitleEveryMinute = functions.pubsub
  .schedule("* * * * *")
  .onRun(async () => {
    console.log("aaaaaa");

    try {
      const snapshot = await admin
        .firestore()
        .collectionGroup("testings")
        .where("type", "==", "title")
        .where("status", "==", "ongoing")
        .get();
      console.log("type is title and ongoing");
      const tests = snapshot.docs.map((doc) => doc.data()) as TitleTesting[];
      console.log("tets", tests);

      // update thumbnail for each test
      const promiseArray = tests.map(async (test) => {
        const { startDate, duration, channelId, id } = test;
        if (!duration) return null;
        const endDate = dayjs(startDate).add(duration, "day");
        const now = dayjs();
        if (endDate.isBefore(now)) {
          const testingRef = await admin
            .firestore()
            .doc(`channels/${channelId}/testings/${id}`);

          const input: Partial<TitleTesting> = { status: "complete" };

          testingRef.set(input, { merge: true });
          return;
        } else {
          return await updateVideoTitle(test);
        }
      });
      console.log("promiseArray", promiseArray);

      const results = await Promise.all(promiseArray);

      // const result = await updateVideoTitle({
      //   channelId: "UCR1-y0yMG0onXbQXxoT8QdQ",
      //   videoId: "dbf0Y19pqL4",
      //   newTitle: dayjs().format("HH mm ss"),
      // });
      console.log("22222");
      console.log(results);

      //   console.log("result", result);
      return true;
    } catch (error) {
      return null;
    }
  });
