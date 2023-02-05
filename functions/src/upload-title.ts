import * as admin from "firebase-admin";
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

export const updateVideoTitle = async (testing: Testing) => {
  // Get refresh_token from DB
  try {
    const { videoId, varis, ori, channelId, history } = testing;

    const tokenPath = tokensPath(channelId);

    const tokens = (
      await admin.firestore().doc(tokenPath).get()
    ).data() as admin.firestore.DocumentData;
    oauth2Client.setCredentials(tokens);

    // Get video
    const result = await youtube.videos.list({
      id: videoId,
      part: "statistics,snippet",
    } as any); // TODOO

    const video = (result as any).data.items[0]; // TODO

    const newTitle = getNextTestSubject(
      history,
      ori,
      varis.map((title) => title.value)
    );

    video.snippet.title = newTitle;

    // Update video
    await youtube.videos.update({
      requestBody: {
        id: videoId as string,
        snippet: {
          title: newTitle,
          categoryId: video.snippet.categoryId, // somehow need this line
        },
      },
      part: "snippet",
    } as any); // TODO

    await addSubjectToHistory(testing);

    return {
      newTitle,
      video,
    };
  } catch (error) {
    console.log("error", error);
    return null;
  }
};
