/* eslint-disable max-len */
import axios from "axios";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as fs from "fs";
import { google } from "googleapis";
import { formatDate } from "./utils/formatDate";

admin.initializeApp();

// const { client, secret, redirect } = functions.config().oauth;
// const { video_id } = functions.config().data;
const video_id = "xxx";

const secretFileName = "client_secret.json";
const SECRET_PATH = `${__dirname}/../${secretFileName}`;
const tokensPath = (channelId: string) => `channels/${channelId}/tokens/token`;

const oauth2Client = new google.auth.OAuth2(
  "720790956280-ou5iv375lrglgjsdaus81tp6but4cd6c.apps.googleusercontent.com",
  "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",
  "http://localhost:5173/"
);

async function updateVideoTitle() {
  // Get refresh_token from DB
  const channelId = (await getChannelId()) as string;
  const tokens = (
    await admin.firestore().doc(tokensPath(channelId)).get()
  ).data() as admin.firestore.DocumentData;
  oauth2Client.setCredentials(tokens);

  // YouTube client
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  // Get video
  const result = await youtube.videos.list({
    id: video_id,
    part: "statistics,snippet",
  } as any); // TODO

  const video = (result as any).data.items[0]; // TODO
  const oldTitle = video.snippet.title;

  const { viewCount } = video.statistics;

  const newTitle = `How RESTful APIs work | this video has ${viewCount} views`;

  video.snippet.title = newTitle;

  // Update video
  const updateResult = await youtube.videos.update({
    requestBody: {
      id: video_id as string,
      snippet: {
        title: newTitle,
        categoryId: video.snippet.categoryId,
      },
    },
    part: "snippet",
  } as any); // TODO

  console.log(updateResult.status);

  return {
    oldTitle,
    newTitle,
    video,
  };
}

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

export const updateThumbnail = functions.https.onCall(
  async ({
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

    // YouTube client
    const youtube = google.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // Update thumbnail
    youtube.thumbnails.set({
      videoId,
      media: {
        body: fs.createReadStream(localPath),
      },
    });

    return true;
  }
);

interface StatProps {
  channelId: string;
  videoIds: string[];
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
        "views,annotationClickThroughRate,annotationCloseRate,averageViewDuration,comments,dislikes,estimatedMinutesWatched,likes,shares,subscribersGained,subscribersLost";

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

export const getVidList = functions.https.onCall(async (channelId: string) => {
  // Get refresh_token from DB

  console.log("get vid list", channelId);

  const tokens = (
    await admin.firestore().doc(tokensPath(channelId)).get()
  ).data() as admin.firestore.DocumentData;

  console.log("tokens", tokens);
  oauth2Client.setCredentials(tokens);

  console.log("1");
  // YouTube client
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
  console.log("2");

  // Get video
  const result = await youtube.search.list({
    part: ["snippet"],
    forMine: true,
    maxResults: 100,
    type: ["video"],
  });

  console.log("videos result", result);
  console.log("videos result len", result.data.items);

  const uploads = result.data.items?.map((item) => ({
    videoId: item.id?.videoId,
    thumbnailUrl: item.snippet?.thumbnails?.default?.url,
    title: item.snippet?.title,
  }));
  console.log("videos result len", result.data.items?.length);

  return uploads;
});

export const getChannel = functions.https.onCall(async () => {
  // Get refresh_token from DB
  const channelId = (await getChannelId()) as string;
  const tokens = (
    await admin.firestore().doc(tokensPath(channelId)).get()
  ).data() as admin.firestore.DocumentData;

  console.log("token", tokens);
  oauth2Client.setCredentials(tokens);

  console.log("1");
  // YouTube client
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
  console.log("2");

  // Get video
  const result = await youtube.channels.list({
    part: ["snippet,contentDetails,statistics"],
    mine: true,
  });

  console.log("videos result", result);

  const data = result.data;
  const items = data.items;
  const playlist = items?.[0].contentDetails?.relatedPlaylists;

  console.log("dataaaa", data);
  console.log("itemsssss", items);
  console.log("playlistss", playlist);
  return;
});

export const updateVideoJob = functions.pubsub
  .schedule("every 3 minutes")
  .onRun((context) => updateVideoTitle());

// OAuth Code
export const createAndSaveTokensReq = functions.https.onRequest(
  async (req, res) => {
    const code = req.body.code;
    const { tokens } = await oauth2Client.getToken(code);
    const { refresh_token } = tokens;

    // TODO get userID
    oauth2Client.setCredentials(tokens);

    const channelId = (await getChannelId()) as string;
    await admin.firestore().doc(tokensPath(channelId)).set({ refresh_token });
    res.send("success");
  }
);

const getChannelId = async () => {
  console.log("get channel id 1");
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  console.log("get channel id 2");
  const result = await youtube.channels.list({
    part: ["snippet"],
    mine: true,
  });
  console.log("get channel id 3");

  const channelId = result.data.items?.[0].id;

  console.log("get channel id 4");
  return channelId;
};

// OAuth Code
export const createAndSaveTokensCall = functions.https // }) //   allowInvalidAppCheckToken: false, // .runWith({
  .onCall(async (code: string) => {
    try {
      console.log("codeeeee 1", code);
      const { tokens } = await oauth2Client.getToken(code);

      console.log("codeeeee 2");
      console.log("tokens", tokens);
      const { refresh_token } = tokens;

      console.log("set credentials");
      oauth2Client.setCredentials(tokens);

      const channelId = (await getChannelId()) as string;
      console.log("codeeee 3");
      console.log("channel id", channelId);

      // TODO get userID

      console.log("codeeeee 4");
      await admin.firestore().doc(tokensPath(channelId)).set({ refresh_token });

      console.log("codeeeee 5");
      return { channelId };
    } catch (error) {
      console.log("error in catch", error);
      return;
    }
  });

export const getAuthURLReq = functions.https.onRequest(async (req, res) => {
  const scopes = [
    "profile",
    "email",
    "https://www.googleapis.com/auth/youtube",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  res.send(url);
});

export const getAuthURLCall = functions.https.onCall(async (req, res) => {
  const scopes = [
    "profile",
    "email",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });

  return url;
});

export const googleLogout = functions.https.onCall(
  async (channelId: string) => {
    const tokens = (
      await admin.firestore().doc(tokensPath(channelId)).get()
    ).data() as admin.firestore.DocumentData;

    console.log("tokens", tokens);
    oauth2Client.revokeToken(tokens.refresh_token);
    // oauth2Client.revokeCredentials();

    return true;
  }
);

export const getOAuth2Client = async () => {
  const content = await fs.readFileSync(SECRET_PATH, "utf8");
  const credentials = JSON.parse(String(content));
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];

  return new google.auth.OAuth2(clientId, clientSecret, redirectUrl);
};

export const getOAuth2ClientRequest = functions.https.onRequest(
  async (req, res) => {
    const client = await getOAuth2Client();
    res.send(client);
  }
);
