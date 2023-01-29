import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
// import { updateThumbnail } from "./fireship";
import { ThumbnailTesting } from "./types";
import dayjs from "dayjs";
import { updateVideoTitle } from "./fireship";

export const scheduleCronJob = functions.firestore
  .document("channels/{channelId}/testings/{testingId}")
  .onCreate(async (snap, context) => {
    const test = snap.data() as ThumbnailTesting;
    console.log("updateddddd");
    console.log("testttt", test);
    console.log("testingId", context.params.testingId);
    console.log("channelId", context.params.channelId);
    // const thumbUrl = test.variationThumbUrl;
    // const channelId = test.channelId;
    // can do context

    // Get the start and end dates of the test
    const startDate = test.startDate;
    const videoId = test.videoId;

    // const thumbnailUrl = test.thumbnailUrl;

    // Calculate the number of days between start and end date
    console.log("start date", startDate);

    const endDate = dayjs()
      .add(test.duration || 0, "day")
      .toDate();
    const diffTime = Math.abs(
      endDate.getTime() / 1000 - new Date(startDate).getTime() / 1000
    ); // make second to make it less precise // TODO

    const msIn1Day = 1000 * 60 * 60 * 24;
    const diffDays = Math.ceil(diffTime / msIn1Day);

    console.log("diffTime", diffTime);
    console.log("diffDays", diffDays);

    // const diffDays;

    const updateThumbDates = [...Array(test.duration).keys()].map((i) => {
      //   return dayjs().add(i + 1);
      return dayjs().add(i * 10, "minute");
    });

    // Schedule a function to run every day for the duration of the test

    updateThumbDates.forEach((date) => {
      console.log("date", date.format("HH:mm:ss"));
      // Schedule the function to run at 12am every day
      const scheduledFunction = functions.pubsub
        // .schedule(`0 0 ${scheduledTime.getUTCHours()} * * *`)
        // .schedule(`every 5 seconds`)
        .schedule(date.toISOString())
        .timeZone("UTC")
        .onRun(async (context) => {
          console.log("context", context);
          console.log("1");
          try {
            // Update the thumbnail using the YouTube API here
            // using the videoId, thumbnailUrl and scheduledDate as parameters
            console.log(
              `Updating thumbnail for video ${videoId} on ${date.toISOString()}`
            );
            // const result = await updateThumbnail({
            //   videoId,
            //   thumbUrl,
            //   channelId,
            // });
            // console.log("update thumbnail result", result);
            return;
          } catch (error) {
            console.error(error);
            throw new functions.https.HttpsError("internal", error);
          }
        });
      console.log("123");
      scheduledFunction("", {}); // without this empty object  =>  Cannot read properties of undefined (reading 'params')
      console.log("456");
    });
  });

// export const listScheduledFunctions = functions.https.onRequest(
//   async (req, res) => {
//     try {
//       const jobs = await functions.pubsub.schedule();
//       res.send(jobs);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send(error);
//     }
//   }
// );

// export const helloWorldPubsub = functions.pubsub
//   .schedule("every 5 seconds")
//   .onRun(() => console.log("Hello, World!!"));

export const createHelloPubsub = functions.https.onCall(async () => {
  console.log("1");
  const dateString = dayjs().add(10, "minute").toISOString();

  const helloWorldPubsub = functions.pubsub
    .schedule(dateString)
    .onRun(() => console.log("Hello, World programmatically!!", dateString));
  console.log("2");

  helloWorldPubsub("", {});
  console.log("3");
  return true;
});

export const updateTitleEveryMinute = functions.pubsub
  .schedule("* * * * *")
  .onRun(async () => {
    try {
      const snapshot = await admin
        .firestore()
        .collectionGroup("testings")
        .get();
      const tests = snapshot.docs.map((doc) => doc.data());
      console.log("tets", tests);
      //   const result = await updateVideoTitle({
      //     channelId: "UCR1-y0yMG0onXbQXxoT8QdQ",
      //     videoId: "dbf0Y19pqL4",
      //     newTitle: dayjs().format("HH mm ss"),
      //   });
      console.log("222222");
      //   console.log("result", result);
      return true;
    } catch (error) {
      return null;
    }
  });

// export const logAfter10Sec = functions.pubsub
//   .schedule(dayjs().add(10, "minute").toISOString())
//   .onRun(async () => {
//     try {
//       console.log("minute");

//       return true;
//     } catch (error) {
//       return null;
//     }
//   });
