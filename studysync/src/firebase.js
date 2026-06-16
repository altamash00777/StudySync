import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0M2KLaNAZaeul5juyTRhuQYQZm9u3nTg",
  authDomain: "studysync2-2d712.firebaseapp.com",
  projectId: "studysync2-2d712",
  storageBucket:
    "studysync2-2d712.firebasestorage.app",
  messagingSenderId: "708873369494",
  appId:
    "1:708873369494:web:08783ba4669f0f19bb0fb7",
  measurementId: "G-02TGVJVZBM",
};

const app = initializeApp(firebaseConfig);

// Firestore Database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);

export default app;