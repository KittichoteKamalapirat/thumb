import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { CreateThumbnailTestInput } from "../components/CreateThumbTest";
import { CreateTitleTestInput } from "../components/CreateTitleTest";
import { firestore } from "./client";

export const createTesting = async (
  channelId: string,
  input: CreateThumbnailTestInput | CreateTitleTestInput
): Promise<string> => {
  const id = uuidv4();

  const docRef = doc(firestore, "channels", channelId, "testings", id);

  try {
    const params = {
      id,
      startDate: new Date().toISOString(),
      status: "ongoing",
      channelId,
      createdAt: new Date().toISOString(),
      ...input,
    };

    // if add doc (but id won't be the same as key)
    // const colRef = collection(firestore, "channels", channelId, "testings");
    // await addDoc(colRef, input);
    await setDoc(docRef, params);

    return id;
  } catch (error) {
    console.log("error inside create testing", error);
    return "";
  }
};
