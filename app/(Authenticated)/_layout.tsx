// app/navigation/AppStack.tsx

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';

const AuthenticatedLayout = () => {
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="(setup)"/>
      <Stack.Screen name="(apartments)"/>
      <Stack.Screen name="(transients)"/>
      <Stack.Screen name="(bookings)"/>
      <Stack.Screen name="(profile)"/>
      <Stack.Screen name="(inbox)"/>
      <Stack.Screen name="(utilities)"/>
      <Stack.Screen name="(review)"/>
      <Stack.Screen name="(archives)"/>
    </Stack>
  );
};

export default AuthenticatedLayout;
