import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDyRWmv0P5YmchvcItChsk4J7xrwPyCKkQ",
  authDomain: "whereru-fbab7.firebaseapp.com",
  databaseURL: "https://whereru-fbab7-default-rtdb.firebaseio.com",
  projectId: "whereru-fbab7",
  storageBucket: "whereru-fbab7.appspot.com",
  messagingSenderId: "913121432933",
  appId: "1:913121432933:web:bf5e5b052d9d2a442a3d8c"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
