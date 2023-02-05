/* eslint-disable max-len */
import dayjs from "dayjs";
import * as admin from "firebase-admin";
import { google } from "googleapis";
import { tokensPath } from "./constants";
import { getOAuth2Client } from "./getOAuth2Client";
import { History, TitleTesting } from "./types";

// const { client, secret, redirect } = functions.config().oauth;
// const { video_id } = functions.config().data;
const oauth2Client = getOAuth2Client();

const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

export const updateVideoTitle = async (testing: TitleTesting) => {
  // Get refresh_token from DB
  try {
    const { videoId, variationTitles, originalTitle, channelId, history } =
      testing;

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

    const newTitle = getNextTitle(
      history,
      originalTitle,
      variationTitles.map((title) => title.value)
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

    await addTitleToHistory(testing);

    return {
      newTitle,
      video,
    };
  } catch (error) {
    console.log("error", error);
    return null;
  }
};

const getNextTitle = (history, oriTitle: string, variTitles: string[]) => {
  const allTitles = [oriTitle, ...variTitles];

  let newTitle = "";

  if (history.length === 0) newTitle = variTitles[0];
  else {
    const currentTitle = history.at(-1)?.title as string; // TODO
    const indexInAllTitles = allTitles.indexOf(currentTitle);
    const newTitleIndex = indexInAllTitles + 1;
    // use the next one
    newTitle = allTitles[newTitleIndex >= allTitles.length ? 0 : newTitleIndex];
  }

  return newTitle;
};
const addTitleToHistory = async (testing: TitleTesting) => {
  try {
    const { variationTitles, originalTitle, history, channelId, id } = testing;

    const newTitle = getNextTitle(
      history,
      originalTitle,
      variationTitles.map((title) => title.value)
    );

    const testingRef = await admin
      .firestore()
      .doc(`channels/${channelId}/testings/${id}`);

    const newHistory: History = {
      value: newTitle,
      date: dayjs().toISOString(),
    };

    // Atomically add a new region to the "regions" array field.
    testingRef.update({
      history: admin.firestore.FieldValue.arrayUnion(newHistory),
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
