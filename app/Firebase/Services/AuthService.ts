// src/services/AuthServices.ts

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@/app/Firebase/FirebaseConfig'; // Import Firebase initialization
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage
import { fetchUserDataFromFirestore } from './DatabaseService';

// Function to get the current logged-in user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Function to listen for authentication state changes
export const listenToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user); // Call the callback with the user or null
  });
};

// Function for user login
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
};

// Function for user signup
export const signupUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up user:', error);
    return null;
  }
};

// Function to logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('currentUser'); // Remove user from AsyncStorage on logout
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};

// Function to store user data locally
/**
 * Stores user data locally by fetching it from Firestore and saving it to AsyncStorage.
 *
 * @param {User} user - The user object containing the user's unique identifier (uid).
 * @returns {Promise<void>} A promise that resolves when the user data has been successfully stored locally.
 *
 * @throws Will log an error message if there is an issue fetching the user data from Firestore or storing it in AsyncStorage.
 */
export const storeUserDataLocally = async (user: User) => {
  try {
    const userData = await fetchUserDataFromFirestore(user.uid);

    if (userData) {
      const updatedUserData = { ...userData, id: user.uid }; // Ensure 'id' is stored correctly
      await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUserData));
    } else {
      console.error("Error: No user data found in Firestore");
    }
  } catch (error) {
    console.error("Error storing user data locally:", error);
  }
};

/**
 * Retrieves the stored user data from local storage.
 *
 * @returns {Promise<any | null>} A promise that resolves to the parsed user data if it exists, or null if it doesn't.
 * @throws Will log an error message to the console if there is an issue retrieving the data.
 */

export const getStoredUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null; // Return parsed user data or null
  } catch (error) {
    console.error('Error retrieving user data from local storage:', error);
    return null;
  }
};
