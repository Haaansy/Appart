import { View, Text, Alert } from "react-native";
import React from "react";
import { logoutUser } from "@/app/Firebase/Services/AuthService";
import CustomButton from "@/app/components/CustomButton";
import { router } from "expo-router";

const index = () => {
  const handleLogout = async () => {
    try {
      await logoutUser();
      Alert.alert("Logged out successfully");
      router.replace("/(Auth)/LoginScreen");
    } catch (error) {
      console.error("Error during logout:", error);
      Alert.alert("Logout failed", "Please try again");
    }
  };

  return (
    <View>
      <CustomButton title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default index;
