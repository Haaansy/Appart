// app/navigation/AppStack.tsx

import React from 'react';
import { Stack } from 'expo-router';

const AuthenticatedLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="(setup)"/>
    </Stack>
  );
};

export default AuthenticatedLayout;
