import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDkW-tUby6b3PziHXJrtSeXIp4m9qDPnm0",
  authDomain: "nternshare.firebaseapp.com",
  projectId: "nternshare",
  storageBucket: "nternshare.firebasestorage.app",
  messagingSenderId: "698784688539",
  appId: "1:698784688539:web:e7587240600008a2efd93e",
  measurementId: "G-SJWNR7YZTE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
