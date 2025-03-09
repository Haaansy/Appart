// app/navigation/AppStack.tsx

import React, { useEffect } from "react";
import { Stack } from "expo-router";
import * as NavigationBar from "expo-navigation-bar";

const UtilitiesLayout = () => {
  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(image-viewer)" />
    </Stack>
  );
};

export default UtilitiesLayout;
