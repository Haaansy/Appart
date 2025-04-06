import { View, Text } from 'react-native'
import React from 'react'
import UserData from '@/app/types/UserData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

const storeCurrentUserDataLocally = async (userData: UserData) => {
  const user = getAuth().currentUser?.uid;
  if (!user) {
    console.error("User not authenticated");
    return null;
  }

  if (user) {
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    console.log("User data stored locally");
  } else {
    console.error("Error: User cannot be saved");
    return null;
  }
}

export default storeCurrentUserDataLocally