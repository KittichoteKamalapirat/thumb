import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { auth, firestore, functions } from "./client";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/youtube.upload");

export const signInWithGoogle = async () => {
  try {
    console.log("sign in");
    const result = await signInWithPopup(auth, provider);
    console.log("result", result);

    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log("credential", credential);
    const token = credential?.accessToken;
    console.log("token", token);

    const { email, displayName, photoURL, uid, providerData } = result.user;
    console.log("3");
    const newUser = {
      uid,
      name: displayName,
      email,
      avatarUrl: photoURL,
      provider: providerData[0].providerId,
    };

    console.log("newUser", newUser);
    // const docRef = await addDoc(collection(firestore, "users"), newUser);
    const userRef = doc(firestore, "users", uid);

    console.log("5");
    const docRef = await setDoc(userRef, newUser);

    console.log("6");
    return token;
  } catch (error) {
    console.log("error", error);
  }
};

export const logout = () => {
  const response = signOut(auth);
};

export const openCustomerPortal = async () => {
  const functionRef = httpsCallable(
    functions,
    "ext-firestore-stripe-payments-createPortalLink"
  );

  console.log("redirect!");
  const { data } = await functionRef({
    // returnUrl: window.location.origin,
    returnUrl: window.location.origin,
  });

  window.location.assign((data as any)?.url); // todo
};
