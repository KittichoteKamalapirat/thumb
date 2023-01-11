/* eslint-disable max-len */
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase/client";

export const createCheckoutSession = async (userUId: string) => {
  try {
    const newCheckoutRef = collection(firestore, "checkout_sessions");
    const newCheckoutSession = {
      price: process.env.NEXT_PUBLIC_STRIPE_PRODUCT_ID,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
    };
    // Create a new checkout session in the subcollection inside this users document
    const collectionRef = collection(
      firestore,
      "users",
      userUId,
      "checkout_sessions"
    );

    const docRef = await addDoc(collectionRef, newCheckoutSession);

    // Wait for the CheckoutSession to get attached by the extension
    onSnapshot(docRef, async (snap) => {
      const { error, url } = snap.data() || {}; // TODO check this

      if (error) {
        console.error(`An error occured: ${error.message}`);
        // this.isLoading = false;
      }
      if (url) {
        window.location.assign(url);
      }
    });
  } catch (error) {
    console.log("error", error);
  }
};
