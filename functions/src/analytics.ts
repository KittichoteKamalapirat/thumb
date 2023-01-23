/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { google } from "googleapis";
import { tokensPath } from "./constants";
import { getOAuth2Client } from "./getOAuth2Client";
import { StatsResponse } from "./StatsResponse";
import { formatDate } from "./formatDate";

const oauth2Client = getOAuth2Client();

interface StatProps {
  channelId: string;
  videoIds: string[];
  date: string;
}

interface OneVidStatProps {
  channelId: string;
  videoId: string;
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

      console.log("1");

      const analytics = google.youtubeAnalytics({
        version: "v2",
        auth: oauth2Client,
      });
      console.log("2");

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
      const todayStr = formatDate(today);

      const startDate = new Date("2000-01-01");
      const startStr = formatDate(startDate);

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

export const getStatsOneVid = functions.https.onCall(
  async ({
    channelId,
    videoId,
    date,
  }: OneVidStatProps): Promise<StatsResponse | null> => {
    try {
      const tokens = (
        await admin.firestore().doc(tokensPath(channelId)).get()
      ).data() as admin.firestore.DocumentData;

      oauth2Client.setCredentials(tokens);

      const analytics = google.youtubeAnalytics({
        version: "v2",
        auth: oauth2Client,
      });

      const metrics =
        "views,annotationClickThroughRate,annotationClickableImpressions,annotationCloseRate,averageViewDuration,comments,dislikes,estimatedMinutesWatched,likes,shares,subscribersGained,subscribersLost";

      const data = await analytics.reports.query({
        dimensions: "video",
        filters: `video==${videoId}`,
        ids: "channel==MINE",
        metrics,
        endDate: date,
        startDate: date,
      });

      console.log("data", data);
      const results = data && data.data && data.data.rows ? data.data.rows : [];
      const keys = ["videoId", ...metrics.split(",")];

      const responseArr = results.map((item: string[]) => {
        const temp = {};
        for (let i = 0; i < keys.length; i++) temp[keys[i]] = item[i];
        return temp as StatsResponse;
      });
      console.log("responsee", responseArr);
      return responseArr[0];
    } catch (error) {
      console.log("error getting stats", error);
      return null;
    }
  }
);
