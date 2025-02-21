// app/navigation/AppStack.tsx

import React from 'react';
import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen"/>
      <Stack.Screen name="RegisterScreen"/>
      <Stack.Screen name="OnboardingScreen"/>
    </Stack>
  );
};

export default AuthLayout;
