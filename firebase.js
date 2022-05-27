import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCpkOt8_yy0JJtZWv9gK3TB-UIjRAfRvRA",
    authDomain: "twitter-385e2.firebaseapp.com",
    projectId: "twitter-385e2",
    storageBucket: "twitter-385e2.appspot.com",
    messagingSenderId: "926115226496",
    appId: "1:926115226496:web:1ac615354c1cce744fd765",
    measurementId: "G-700ZJYJRT8"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp(); //exclusivo next.js
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };