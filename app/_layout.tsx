// app/navigation/AppStack.tsx

import React from "react";
import { Stack } from "expo-router";

const App = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(Auth)" />
      <Stack.Screen name="(Authenticated)" />
    </Stack>
  );
};

export default App;
