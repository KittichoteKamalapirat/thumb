import fs from "fs";
import { GoogleAuth } from "google-auth-library";
import { JSONClient } from "google-auth-library/build/src/auth/googleauth";
import { google } from "googleapis";
import readline from "readline";
import axios from "axios";

const OAuth2 = google.auth.OAuth2;

const categoryIds = {
  Entertainment: "24",
  Music: "10",
  Education: "27",
  ScienceTechnology: "28",
};

// const secretFileName = "client_secret_rain_channel.json";
const secretFileName = "client_secret_shane_channel.json";
const SECRET_PATH = `${__dirname}/../${secretFileName}`;
const TOKEN_PATH = `${__dirname}/../client_oauth_token.json`;

// If modifying these scopes,
// delete your previously saved credentials in client_secret.json
const SCOPES = ["https://www.googleapis.com/auth/youtube.upload"];

interface UploadVideoInput {
  vidPathInStorage: string;
  thumbPathInStorage: string;
  title: string;
  filename: string;
  description: string;
  tags: string[];
}

export const loadSecret = () => {
  fs.readFile(SECRET_PATH, (err, content) => {
    if (err) {
      console.log("Error loading client secret file: " + err);
      return;
    }
    // Authorize a client with the loaded credentials,
    // then call the YouTube API.
    authorize(JSON.parse(String(content)), (auth: GoogleAuth<JSONClient>) => {
      console.log("auth", auth);
      return auth;
    });
  });
};

interface UploadToYoutubeInput {
  auth: GoogleAuth<JSONClient>;
  title: string;
  description: string;
  tags: string[];
  filename: string;
  vidUrl: string;
  thumbUrl: string;
}

const uploadToYoutube = async ({
  auth,
  filename,
  title,
  description,
  tags,
  vidUrl,
  thumbUrl,
}: UploadToYoutubeInput) => {
  console.log("4");
  const youtube = google.youtube("v3");

  const vidRes = await axios.get(vidUrl, { responseType: "arraybuffer" });
  const vidBuffer = Buffer.from(vidRes.data, "binary");
  const localVidPath = `${__dirname}/../tmp/${filename}.mp4`;
  fs.writeFileSync(localVidPath, vidBuffer);

  const thumbRes = await axios.get(thumbUrl, { responseType: "arraybuffer" });
  const thumbBuffer = Buffer.from(thumbRes.data, "binary");
  const localThumbPath = `${__dirname}/../tmp/${filename}.jpg`;
  fs.writeFileSync(localThumbPath, thumbBuffer);

  youtube.videos.insert(
    {
      auth,
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId: categoryIds.ScienceTechnology,
          defaultLanguage: "en",
          defaultAudioLanguage: "en",
        },
        status: {
          privacyStatus: "private",
        },
      },
      media: {
        body: fs.createReadStream(localVidPath),
      },
    },
    (err, response) => {
      if (err) {
        console.log("The insert API returned an error : " + err);
        return;
      }

      console.log("Video uploaded. Uploading the thumbnail now.");
      youtube.thumbnails.set(
        {
          auth: auth,
          videoId: response?.data.id || "",
          media: {
            body: fs.createReadStream(localThumbPath),
          },
        },
        (err, response) => {
          if (err) {
            console.log("The set API returned an error: " + err);
            return;
          }
          console.log(response?.data);
        }
      );
    }
  );
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials, callback) => {
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

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
const getNewToken = (oauth2Client, callback) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url: ", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const codeFromUrl = process.env.TOKEN_CODE_FROM_URL;

  rl.close();
  oauth2Client.getToken(codeFromUrl, (err, token) => {
    if (err) {
      console.log("Error while trying to retrieve access token", err);
      return;
    }

    oauth2Client.credentials = token;
    storeToken(token);
    callback(oauth2Client);
  });
};

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
const storeToken = (token) => {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) {
      console.log("error storing token");
      throw err;
    }
    console.log("Token stored to " + TOKEN_PATH);
  });
};
