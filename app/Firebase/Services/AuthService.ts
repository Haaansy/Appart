// src/services/AuthServices.ts

import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '@/app/Firebase/FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserDataFromFirestore } from './DatabaseService';

// ✅ Manually Handle Auth Persistence in React Native
const storeUserSession = async (user: any) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user session:", error);
  }
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    storeUserSession(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in user:', error);
    return null;
  }
};

export const signupUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    storeUserSession(userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up user:', error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('userData'); // Remove user from AsyncStorage on logout
    await AsyncStorage.removeItem('user'); // Remove user from AsyncStorage on logout
  } catch (error) {
    console.error('Error logging out user:', error);
  }
};

