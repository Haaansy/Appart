import { View, Text } from 'react-native'
import React from 'react'
import { fetchUserDataFromFirestore } from '@/app/Firebase/Services/DatabaseService';
import UserData from '@/app/types/UserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import storeCurrentUserDataLocally from './storeCurrentUserDataLocally';

const refreshCurrentUserData = async () => {
  const user = getAuth().currentUser?.uid;
  if (user) {
    console.log("User data not found locally, fetching from Firestore");
      const userData = await fetchUserDataFromFirestore(user);
      if (userData) {
        await storeCurrentUserDataLocally(userData);
        console.log("User Data refreshed and stored locally");
        return userData;
      } else {
        console.error("User data not found in Firestore");
        return null;
      }
  } else {
    console.error("User not found");
    return null;
  }
}

export default refreshCurrentUserData