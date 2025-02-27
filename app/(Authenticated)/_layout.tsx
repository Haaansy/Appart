// app/navigation/AppStack.tsx

import React from 'react';
import { Stack } from 'expo-router';

const AuthenticatedLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="(setup)"/>
      <Stack.Screen name="(apartments)"/>
      <Stack.Screen name="(transients)"/>
      <Stack.Screen name="(bookings)"/>
    </Stack>
  );
};

export default AuthenticatedLayout;
