import dayjs from "dayjs";
import * as admin from "firebase-admin";
import { TestHistory, Testing } from "./types";

// subject == TitleOrThumb
export const getNextTestSubject = (history, ori: string, varis: string[]) => {
  const allTestSubjects = [ori, ...varis];

  let newSubject = "";

  if (history.length === 0) newSubject = varis[0];
  else {
    const currentSubject = history.at(-1)?.title as string; // TODO
    const indexInAllSubjects = allTestSubjects.indexOf(currentSubject);
    const newSubjectIndex = indexInAllSubjects + 1;
    // use the next one
    newSubject =
      allTestSubjects[
        newSubjectIndex >= allTestSubjects.length ? 0 : newSubjectIndex
      ];
  }

  return newSubject;
};

export const addSubjectToHistory = async (testing: Testing) => {
  try {
    const { varis, ori, history, channelId, id } = testing;

    const newSubject = getNextTestSubject(
      history,
      ori,
      varis.map((subject) => subject.value)
    );

    const testingRef = await admin
      .firestore()
      .doc(`channels/${channelId}/testings/${id}`);

    const newHistory: TestHistory = {
      value: newSubject,
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
