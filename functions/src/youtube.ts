import * as functions from "firebase-functions";
import * as fs from "fs";
import { google } from "googleapis";
import * as readline from "readline";
import { getOAuth2Client } from "./getOAuth2Client";

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
