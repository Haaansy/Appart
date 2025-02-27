// app/navigation/AppStack.tsx

import React from "react";
import { Stack } from "expo-router";

const ApartmentsLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(viewapartment)" />
      <Stack.Screen name="(editapartment)" />
      <Stack.Screen name="(addapartment)" />
    </Stack>
  );
};

export default ApartmentsLayout;
