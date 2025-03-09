// app/navigation/AppStack.tsx

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

const AuthLayout = () => {
  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <>
      <StatusBar hidden={true} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen"/>
        <Stack.Screen name="RegisterScreen"/>
        <Stack.Screen name="OnboardingScreen"/>
      </Stack>
    </>
  );
};

export default AuthLayout;
