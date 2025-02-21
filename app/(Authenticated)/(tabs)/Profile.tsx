import { View, Text, Alert } from 'react-native'
import React from 'react'
import CustomButton from '@/app/components/CustomButton'
import { logoutUser } from '@/app/Firebase/Services/AuthService'
import { router } from 'expo-router'

const Profile = () => {

  const handleLogout = async () => {
    try {
      await logoutUser(); // Call logoutUser function to log out the user
      Alert.alert('Logged out successfully');
      // You can navigate the user to the login screen or any other screen after logout
      router.replace("/");
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout failed', 'Please try again');
    }
  };

  return (
    <View>
      <CustomButton
        title="Logout"
        onPress={() => {handleLogout()}} // Add the logout function here
        style={{ marginTop: 50 }}
      />
    </View>
  )
}

export default Profile