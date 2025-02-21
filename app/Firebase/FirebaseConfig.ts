import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU5fkl6mbNzavpKSTkapI8vKnsTjKspAs",
  authDomain: "appart-2e3ae.firebaseapp.com",
  projectId: "appart-2e3ae",
  storageBucket: "appart-2e3ae.firebasestorage.app",
  messagingSenderId: "341434552239",
  appId: "1:341434552239:web:108704561a220f424f695a",
  measurementId: "G-7KXCVJF0E5",
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Use initializeAuth with React Native Persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// 🔹 Initialize Other Firebase Services
const db = getFirestore(app);
const storage = getStorage(app);

// 🔹 Export Firebase Services
export { app, auth, db, storage };
