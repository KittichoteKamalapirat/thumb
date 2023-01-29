/* eslint-disable max-len */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { google } from "googleapis";
import { tokensPath } from "./constants";
import { getOAuth2Client } from "./getOAuth2Client";

const oauth2Client = getOAuth2Client();

// OAuth Code

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

      const channelId = (await getChannelId()) as string; // need to set credentials before using this
      console.log("codeeee 3");
      console.log("channel id", channelId);

      // TODO get userID

      console.log("codeeeee 4");
      await admin.firestore().doc(tokensPath(channelId)).set({ refresh_token });

      console.log("codeeeee 5");
      return { channelId };
    } catch (error) {
      console.log("error in catch", error);
      return { channelId: "" };
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

export const getAuthURLCall = functions.https.onCall(async () => {
  console.log("111");

  const scopes = [
    "profile",
    "email",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/yt-analytics.readonly",
  ];

  console.log("222");
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log("333");

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

export const getOAuth2ClientRequest = functions.https.onRequest(
  async (req, res) => {
    const client = await getOAuth2Client();
    res.send(client);
  }
);
