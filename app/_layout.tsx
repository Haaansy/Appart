// app/navigation/AppStack.tsx

import React from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(Auth)" />
        <Stack.Screen name="(Authenticated)" />
      </Stack>
    </GestureHandlerRootView>
  );
};

export default App;
