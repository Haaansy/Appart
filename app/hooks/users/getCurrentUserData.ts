import { View, Text } from 'react-native'
import React from 'react'
import { getAuth } from 'firebase/auth'
import { fetchUserDataFromFirestore } from '@/app/Firebase/Services/DatabaseService'
import UserData from '@/app/types/UserData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import storeCurrentUserDataLocally from './storeCurrentUserDataLocally'

const getCurrentUserData = async () => {
  const user = getAuth().currentUser?.uid;
  if (user) {
    const localUserData = await AsyncStorage.getItem('userData');
    if (localUserData) {
      console.log("User data found locally");
      return JSON.parse(localUserData) as UserData;
    } else {
      console.log("User data not found locally, fetching from Firestore");
      const userData = await fetchUserDataFromFirestore(user);
      if (userData) {
        await storeCurrentUserDataLocally(userData);
        return userData;
      } else {
        console.error("User data not found in Firestore");
        return null;
      }
    }
  } else {
    console.error("User not found");
    return null;
  }
}

export default getCurrentUserData