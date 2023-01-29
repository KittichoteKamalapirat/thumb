/* eslint-disable max-len */
import axios from "axios";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
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

const genArrbufFromUrl = async ({
  url,
  filename,
  type,
}: {
  url: string;
  filename: string;
  type: "mp3" | "mp4" | "jpg";
}) => {
  // process aud
  const res = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data, "binary");
  const localPath = `${__dirname}/../tmp/${filename}.${type}`;
  fs.writeFileSync(localPath, buffer);

  return { localPath };
};

export const updateThumbnailCall = functions.https.onCall(
  async ({
    videoId,
    thumbUrl,
    channelId,
  }: {
    videoId: string;
    thumbUrl: string;
    channelId: string;
  }) => {
    return updateThumbnail({ videoId, thumbUrl, channelId });
  }
);

export const updateThumbnail = async ({
  videoId,
  thumbUrl,
  channelId,
}: {
  videoId: string;
  thumbUrl: string;
  channelId: string;
}) => {
  console.log("updateeeee", videoId, thumbUrl);
  const { localPath } = await genArrbufFromUrl({
    url: thumbUrl,
    filename: "name",
    type: "jpg",
  });
  // Get refresh_token from DB
  const tokens = (
    await admin.firestore().doc(tokensPath(channelId)).get()
  ).data() as admin.firestore.DocumentData;
  oauth2Client.setCredentials(tokens);

  // Update thumbnail
  youtube.thumbnails.set({
    videoId,
    media: {
      body: fs.createReadStream(localPath),
    },
  });

  return true;
};
