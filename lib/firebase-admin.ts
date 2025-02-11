import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export const initializeFirebase = () => {
  initializeApp({
    credential: applicationDefault(),
  });
};

// verify idToken and return user data
export const verifyIdToken = async (idToken: string) => {
  try {
    // gets uid from idToken
    const { uid } = await getAuth().verifyIdToken(idToken);
    // gets userData from uid and return it
    return await getAuth().getUser(uid);
  } catch (error: any) {
    // error handling
    throw new Error(error.code?.split("/")[1]?.split("-")?.join(" "));
  }
};
