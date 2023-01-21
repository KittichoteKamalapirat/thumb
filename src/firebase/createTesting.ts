import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { FormValues } from "../pages/create-test";
import { firestore } from "./client";
import { Testing } from "./types/Testing.type";

export const createTesting = async (
  channelId: string,
  form: FormValues
): Promise<boolean> => {
  const id = uuidv4();

  const docRef = doc(firestore, "channels", channelId, "testings");

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

    return true;
  } catch (error) {
    console.log("error inside create testing", error);
    return false;
  }
};
