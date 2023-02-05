import dayjs from "dayjs";
import * as functions from "firebase-functions";
import * as fs from "fs";
import { google } from "googleapis";
import * as readline from "readline";
import { getOAuth2Client } from "./getOAuth2Client";
import { Testing } from "./types";

const secretFileName = "client_secret.json";
const tokenFileName = "client_oauth_token.json";
const SECRET_PATH = `${__dirname}/../../${secretFileName}`;
const TOKEN_PATH = `${__dirname}/../../${tokenFileName}`;

console.log("SECRET_PATH", SECRET_PATH);
const OAuth2 = google.auth.OAuth2;

const scope = ["https://www.googleapis.com/auth/youtube.upload"];

export const authAndlistVids = functions.https.onCall(
  async (accessToken: string) => {
    const oauth2Client = getOAuth2Client();

    // const scopes = ["https://www.googleapis.com/auth/youtube.upload"];

    // const url = oauth2Client.generateAuthUrl({
    //   access_type: "offline",
    //   scope: scopes,
    // });

    // console.log("url", url);
    console.log("1111111");
    const youtube = google.youtube("v3");

    console.log("2222222");

    const list = await youtube.channels.list({
      auth: oauth2Client,
      part: ["id"],
      mine: true,
    });
    console.log("listttttttt", list);

    //   listVids();
  }
);

// export const authAndlistVids1 = functions.https.onCall(() => {
//     fs.readFile(SECRET_PATH, function processClientSecrets(err, content) {
//       if (err) {
//         console.log("Error loading client secret file: " + err);
//         return;
//       }

//       authorize(JSON.parse(String(content)), (auth: GoogleAuth<any>) => {
//         const youtube = google.youtube("v3");
//         const list = youtube.channels.list({
//           auth: auth as any,
//           part: ["id"],
//           mine: true,
//         });
//         console.log("list", list);
//       });
//     });

//     //   listVids();
//   });

// const listVids = () => {
//   const youtube = google.youtube("v3");

//   console.log(
//     "youtube"
//     // youtube.videos.list({
//     //   id: "",
//     //   part: "statistics,snippet",
//     // })
//     // youtube.channels.list({ auth, part: ["id"], mine: true })

//     // youtube.channels.list({
//     //     id: ""
//     // })
//   );
// };

/*
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
interface Credentials {
  web: {
    client_secret: string;
    client_id: string;
    redirect_uris: string[];
  };
}
export const authorize = (credentials: Credentials, callback: any) => {
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];

  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      console.log("error reading token");
      getNewToken(oauth2Client, callback);
    } else {
      // token is buffer <Buffer 7b 0a 20 20 ... /> =>
      // turn it to json string

      const json = JSON.parse(String(token));

      oauth2Client.credentials = json;

      callback(oauth2Client);
    }
  });
};

const getNewToken = (oauth2Client: any, callback: any) => {
  // TODO
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope,
  });
  console.log("Authorize this app by visiting this url: ", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const codeFromUrl = process.env.TOKEN_CODE_FROM_URL;

  rl.close();
  oauth2Client.getToken(codeFromUrl, (err: any, token: string) => {
    if (err) {
      console.log("Error while trying to retrieve access token", err);
      return;
    }

    oauth2Client.credentials = token;
    storeToken(token);
    callback(oauth2Client);
  });
};

const storeToken = (token: string) => {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) {
      console.log("error storing token");
      throw err;
    }
    console.log("Token stored to " + TOKEN_PATH);
  });
};

// export const updateVideoTitle = async ({
//   videoId,
//   newTitle,
//   channelId,
// }: {
//   videoId: string;
//   newTitle: string;
//   channelId: string;
// }) => {
//   // Get refresh_token from DB
//   console.log("1");
//   const tokenPath = tokensPath(channelId);
//   console.log(tokenPath);

//   const tokens = (
//     await admin.firestore().doc(tokenPath).get()
//   ).data() as admin.firestore.DocumentData;
//   oauth2Client.setCredentials(tokens);
//   console.log("tokens", tokens);

//   console.log("2");
//   // YouTube client
//   const youtube = google.youtube({
//     version: "v3",
//     auth: oauth2Client,
//   });

//   console.log("3");

//   // Get video
//   const result = await youtube.videos.list({
//     id: videoId,
//     part: "statistics,snippet",
//   } as any); // TODO

//   console.log("4");

//   const video = (result as any).data.items[0]; // TODO
//   const oldTitle = video.snippet.title;

//   // const newTitle = `How RESTful APIs work | this video has ${viewCount} views`;

//   video.snippet.title = newTitle;
//   console.log("5");
//   console.log("video", video);

//   // Update video
//   const updateResult = await youtube.videos.update({
//     requestBody: {
//       id: videoId,
//       snippet: {
//         title: newTitle,
//         categoryId: video.snippet.categoryId,
//       },
//     },
//     part: "snippet",
//   } as any); // TODO

//   console.log("6");
//   console.log("status", updateResult.status);

//   console.log("7");

//   return {
//     oldTitle,
//     newTitle,
//     video,
//   };
// }

export const scheduleCronJob = functions.firestore
  .document("channels/{channelId}/testings/{testingId}")
  .onCreate(async (snap, context) => {
    const test = snap.data() as Testing;
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
