import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVyMHv2WfPiri1QleQEQu349FRHNR44BA",
  authDomain: "cricket-entry.firebaseapp.com",
  projectId: "cricket-entry",
  storageBucket: "cricket-entry.firebasestorage.app",
  messagingSenderId: "593426532642",
  appId: "1:593426532642:web:77f5aa240dd363c7763d7b",
  measurementId: "G-WCL6FBN1FT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
