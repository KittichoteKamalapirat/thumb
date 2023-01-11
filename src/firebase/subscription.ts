import { collection, query, where, getDocs } from "firebase/firestore";
import { firestore } from "./client";

export const fetchSubscription = async (uid: string) => {
  const subsRef = collection(firestore, "users", uid, "subscriptions");
  const subsQuery = query(
    subsRef,
    where("status", "in", ["trialing", "active", "past_due", "unpaid"])
  );

  const subs = await getDocs(subsQuery);

  if (subs.docs.length > 0) return subs.docs[0].data();

  return null;
};
