// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoMBSsK-jTM0IkNwwqJTD19zKOaHLPdcs",
  authDomain: "bookhive-7f498.firebaseapp.com",
  projectId: "bookhive-7f498",
  storageBucket: "bookhive-7f498.firebasestorage.app",
  messagingSenderId: "213107461626",
  appId: "1:213107461626:web:8c0c3ed414101e221a2843",
  measurementId: "G-SCNDB6D7ER",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);

if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      const analytics = getAnalytics(firebaseApp);
    }
  });
}

export const signinWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const signupWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signinWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};
