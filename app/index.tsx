import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      router.replace("/(Authenticated)/(tabs)/Home");
    } else {
      router.replace("/(Auth)/OnboardingScreen");
    }
    setLoading(false);
  })

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return null; // Render nothing because navigation happens in the `useEffect`
};

export default Index;
