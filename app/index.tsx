import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import {
  storeUserDataLocally,
  listenToAuthState,
} from "@/app/Firebase/Services/AuthService";

const Index = () => {
  // Firebase User Documents Query
  const [currentUserData, setCurrentUserData] = useState<any>(null); // Store user data here
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = listenToAuthState(async (user) => {
      setLoading(true);
      if (user) {
        await storeUserDataLocally(user); // Store user data in AsyncStorage
        setCurrentUserData(user); // Update the component with the logged-in user data
        router.replace("(Authenticated)/(tabs)/Home" as any); // Redirect to the authenticated part of the app
      } else {
        setCurrentUserData(null); // No user logged in, reset state
        router.replace("(Auth)/OnboardingScreen" as any); // Redirect to the onboarding screen
      }
      setLoading(false);
    });
  
    // Cleanup the listener when component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return null; // Render nothing because navigation happens in the `useEffect`
};

export default Index;
