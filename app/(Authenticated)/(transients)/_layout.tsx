// app/navigation/AppStack.tsx

import React from "react";
import { Stack } from "expo-router";

const TransientLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(viewtransient)" />
      <Stack.Screen name="(edittransient)" />
      <Stack.Screen name="(addtransient)" />
    </Stack>
  );
};

export default TransientLayout;
