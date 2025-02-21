// src/services/AuthServices.ts

import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@/app/Firebase/FirebaseConfig'; // Import Firebase initialization
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage
import { fetchUserDataFromFirestore } from './DatabaseService';
import { UserData } from '@/app/types/UserData';

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
export const storeUserDataLocally = async (user: User) => {
  try {
    fetchUserDataFromFirestore(user.uid)
    .then(userData => { 
      // Store user data in AsyncStorage
      AsyncStorage.setItem('currentUser', JSON.stringify(userData));
    })
  } catch (error) {
    console.error('Error storing user data locally:', error);
  }
};

// Function to get the stored user data
export const getStoredUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null; // Return parsed user data or null
  } catch (error) {
    console.error('Error retrieving user data from local storage:', error);
    return null;
  }
};
