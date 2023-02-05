import axios from "axios";
import * as admin from "firebase-admin";
import * as fs from "fs";
import { google } from "googleapis";
import { tokensPath } from "./constants";
import { addSubjectToHistory, getNextTestSubject } from "./cronShared";
import { getOAuth2Client } from "./getOAuth2Client";
import { Testing } from "./types";

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

export const updateVideoThumb = async (testing: Testing) => {
  try {
    const { videoId, varis, ori, channelId, history } = testing;
    testing;

    // get url
    const newThumbUrl = getNextTestSubject(
      history,
      ori,
      varis.map((title) => title.value)
    );

    // load the thumb image to local file path
    const { localPath } = await genArrbufFromUrl({
      url: newThumbUrl,
      filename: "name",
      type: "jpg",
    });
    // Get refresh_token from DB

    const tokenPath = tokensPath(channelId);

    const tokens = (
      await admin.firestore().doc(tokenPath).get()
    ).data() as admin.firestore.DocumentData;
    oauth2Client.setCredentials(tokens);

    // Update thumbnail
    await youtube.thumbnails.set({
      videoId,
      media: {
        body: fs.createReadStream(localPath),
      },
    });

    // TODO delete the local loaded image
    await addSubjectToHistory(testing);

    return true;
  } catch (error) {
    console.log("error updateThumbnail", error);
    return null;
  }
};
