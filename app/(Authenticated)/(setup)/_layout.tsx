// app/navigation/AppStack.tsx

import React from 'react';
import { Stack } from 'expo-router';

const SetupLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(initialsetup)"/>
      <Stack.Screen name="(finishsetup)"/>
    </Stack>
  );
};

export default SetupLayout;
