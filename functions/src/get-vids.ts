/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { google } from "googleapis";
import { tokensPath } from "./constants";
import { getOAuth2Client } from "./getOAuth2Client";

// const { client, secret, redirect } = functions.config().oauth;
// const { video_id } = functions.config().data;
const oauth2Client = getOAuth2Client();

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

export const getVidList = functions.https.onCall(async (channelId: string) => {
  // Get refresh_token from DB

  const tokens = (
    await admin.firestore().doc(tokensPath(channelId)).get()
  ).data() as admin.firestore.DocumentData;

  oauth2Client.setCredentials(tokens);

  // Get video
  const result = await youtube.search.list({
    part: ["snippet"],
    forMine: true,
    maxResults: 100,
    type: ["video"],
  });

  const uploads = result.data.items?.map((item) => ({
    videoId: item.id?.videoId,
    thumbnailUrl: item.snippet?.thumbnails?.default?.url,
    title: item.snippet?.title,
  }));

  return uploads;
});
