import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import { router } from "expo-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Index = () => {
  const [loading, setLoading] = useState<boolean>(true);

  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setLoading(false);
      router.replace("/(Authenticated)/(tabs)/Home");
    } else {
      setLoading(false);
      router.replace("/(Auth)/OnboardingScreen");
    }
  })

  if (loading) {
    return <Text>Loading Index.tsx - Root</Text>;
  }

  return null; // Render nothing because navigation happens in the `useEffect`
};

export default Index;
