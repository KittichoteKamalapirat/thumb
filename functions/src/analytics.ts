/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { google } from "googleapis";
import { calculateTestResult, SummaryItem } from "./calculateTestResult";
import { tokensPath } from "./constants";
import { formatDateForGoogle } from "./formatDateForGoogle";
import { getOAuth2Client } from "./getOAuth2Client";
import { StatsResponse } from "./StatsResponse";

import { Testing } from "./types";

const oauth2Client = getOAuth2Client();

const analytics = google.youtubeAnalytics({
  version: "v2",
  auth: oauth2Client,
});

interface StatProps {
  channelId: string;
  videoIds: string[];
  date: string;
}

export const getStats = functions.https.onCall(
  async ({ channelId, videoIds }: StatProps) => {
    try {
      // Get refresh_token from DB

      const tokens = (
        await admin.firestore().doc(tokensPath(channelId)).get()
      ).data() as admin.firestore.DocumentData;

      console.log("tokens", tokens);
      oauth2Client.setCredentials(tokens);

      // const metrics =
      //   "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained";

      const metrics =
        "views,annotationClickThroughRate,annotationCloseRate,annotationClickableImpressions,averageViewDuration,comments,dislikes,estimatedMinutesWatched,likes,shares,subscribersGained,subscribersLost";

      const videosStr = videoIds.join(","); // "video==elmrkjxUBYw,zRKfWdvD4eo"
      console.log("3");
      console.log("videos", videosStr);
      // Get video
      // const data = await analytics.reports.query({
      //   metrics,
      // });
      const today = new Date();
      const todayStr = formatDateForGoogle(today);

      const startDate = new Date("2000-01-01");
      const startStr = formatDateForGoogle(startDate);

      console.log("today", todayStr);
      console.log("startStr", startStr);
      const data = await analytics.reports.query({
        dimensions: "video",
        filters: `video==${videosStr}`,
        ids: "channel==MINE",
        metrics,
        endDate: todayStr,
        startDate: startStr,
      });

      console.log("4");
      console.log("data", data);
      const results = data && data.data && data.data.rows ? data.data.rows : [];
      const keys = ["videoId", ...metrics.split(",")];

      const response = results.map((item: string[]) => {
        const temp: Record<string, string> = {};
        for (let i = 0; i < keys.length; i++) temp[keys[i]] = item[i];
        return temp;
      });
      console.log("response", response);
      return response;
    } catch (error) {
      console.log("error getting stats", error);
      return;
    }
  }
);

// get stats of all variation and summarize it
export const getStatsOneVid = functions.https.onCall(
  async (testing: Testing): Promise<SummaryItem[] | null> => {
    console.log("calllllll");

    try {
      const { channelId, videoId, id } = testing;
      const tokens = (
        await admin.firestore().doc(tokensPath(channelId)).get()
      ).data() as admin.firestore.DocumentData;

      oauth2Client.setCredentials(tokens);

      const metrics =
        "views,annotationClickThroughRate,annotationClickableImpressions,annotationCloseRate,averageViewDuration,comments,dislikes,estimatedMinutesWatched,likes,shares,subscribersGained,subscribersLost";

      const testingPath = `channels/${channelId}/testings/${id}`;

      const testingData = (
        await admin.firestore().doc(testingPath).get()
      ).data() as Testing; // TODO should be title or thumb testing type

      console.log("testingData history", testingData.history);
      console.log("video id", videoId);
      console.log(
        "date",
        formatDateForGoogle(new Date("2023-01-01T07:49:07.764Z"))
      );

      const formattedArray: SummaryItem[] = await Promise.all(
        testingData.history.map(async (history) => {
          console.log(history);
          const data = await analytics.reports.query({
            dimensions: "video",
            filters: `video==${videoId}`,
            ids: "channel==MINE",
            metrics,
            endDate: formatDateForGoogle(new Date(history.date)),
            startDate: formatDateForGoogle(new Date(history.date)),
          });

          console.log("google data", data);

          const formatted = formatResponse(data, metrics, videoId);

          console.log("formatteddd", formatted);

          const responseWithTestSubject = {
            ...formatted,
          } as SummaryItem;
          responseWithTestSubject.subject = history.value; // thumb url or title

          return responseWithTestSubject;
        })
      );

      const calculated = calculateTestResult(formattedArray);
      console.log("calculateArrayyy", calculated);

      // console.log("data", data);

      // const formatted = formatResponse(data, metrics);

      return calculated;
    } catch (error) {
      console.log("error getting stats", error);
      return null;
    }
  }
);

const allZeroRow = (videoId: string) => [
  videoId,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
]; // 12 metrices

const formatResponse = (
  data: any,
  metrics: string,
  videoId: string
): StatsResponse => {
  console.log("lennnn", data.data.rows.length);

  // length will eithe by 1 (a lot of data) or 0 (no value)
  const results =
    data && data.data && data.data.rows.length !== 0
      ? data.data.rows
      : [allZeroRow(videoId)]; // empty array is truthy // note: has to be array of array

  data.data.rows.map((row) => console.log("rowwww", row));

  const keys = ["videoId", ...metrics.split(",")];

  const responseArr = results.map((item: string[]) => {
    const temp = {};
    for (let i = 0; i < keys.length; i++) temp[keys[i]] = item[i];
    return temp as StatsResponse;
  });
  console.log("responsee", responseArr);
  return responseArr[0];
};
