import { httpsCallable } from "firebase/functions";
import { functions } from "../client";

// create type-safe cloud functions
// T is the type of paramter
// T is the type of result
export const createFunction = <T = any, R = any>(
  name: string
): ((data: T) => Promise<R>) => {
  const callable = httpsCallable(functions, name);
  return async (data: T) => (await callable(data)).data as R;
};
