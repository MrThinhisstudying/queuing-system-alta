import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4cxz_bPwi6i78iSbt4PLMgD6CBp-C23E",
  authDomain: "queuing-system-d18da.firebaseapp.com",
  projectId: "queuing-system-d18da",
  storageBucket: "queuing-system-d18da.appspot.com",
  messagingSenderId: "408560078559",
  appId: "1:408560078559:web:ff6dbef7cacce60a98636a"
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);