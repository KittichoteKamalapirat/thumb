import dayjs from "dayjs";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { FormValues } from "../pages/create-test";
import { firestore } from "./client";
import { DurationType, Testing } from "./types/Testing.type";

export interface CreateThumbnailTestingInput {
  videoId: string;
  durationType: DurationType;
  duration?: number;
  originalThumbUrl: string;
  variationThumbUrl: string;
}
export const createTesting = async (
  channelId: string,
  form: FormValues
): Promise<string> => {
  const id = uuidv4();

  const docRef = doc(firestore, "channels", channelId, "testings", id);

  try {
    const unixDate = dayjs().valueOf();
    const input: Testing = {
      id,
      startDate: unixDate,
      type: "thumbnail",
      status: "ongoing",
      channelId,
      ...form,
    };

    // if add doc (but id won't be the same as key)
    // const colRef = collection(firestore, "channels", channelId, "testings");
    // await addDoc(colRef, input);
    await setDoc(docRef, input);

    return id;
  } catch (error) {
    console.log("error inside create testing", error);
    return "";
  }
};
