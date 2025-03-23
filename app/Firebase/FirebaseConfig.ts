import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
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
const functions = getFunctions(app);

// 🔥 Connect to Emulator in Development
const localhost = "192.168.1.14" // Change this to your local IP

if (__DEV__) {
  console.log("🔥 Connecting to Firebase Emulators...");
  connectFirestoreEmulator(db, localhost, 8080);
  connectAuthEmulator(auth, `http://${localhost}:9099`);
  connectStorageEmulator(storage, localhost, 9199);
  connectFunctionsEmulator(functions, localhost, 5001);
}

// 🔹 Export Firebase Services
// 🔹 Export Firebase Services
export { app, auth, db, storage, firebaseConfig };
