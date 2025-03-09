// src/services/AuthServices.ts

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@/app/Firebase/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserDataFromFirestore } from './DatabaseService';

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const listenToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
};

export const signupUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up user:', error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('currentUser'); // Remove user from AsyncStorage on logout
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};

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

export const getStoredUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null; // Return parsed user data or null
  } catch (error) {
    console.error('Error retrieving user data from local storage:', error);
    return null;
  }
};
