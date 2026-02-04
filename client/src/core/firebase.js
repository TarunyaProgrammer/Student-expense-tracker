import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6g4sGbehdlzwhZd8qfhohhg5Gd3lLUjQ",
  authDomain: "student-expense-pwa.firebaseapp.com",
  projectId: "student-expense-pwa",
  storageBucket: "student-expense-pwa.firebasestorage.app",
  messagingSenderId: "411552874736",
  appId: "1:411552874736:web:eb966e20cb10de3c7f8235"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
