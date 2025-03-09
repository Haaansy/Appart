// app/navigation/AppStack.tsx

import React from 'react';
import { Stack } from 'expo-router';

const InboxLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false}}>
      <Stack.Screen name="(viewconversation)"/>
    </Stack>
  );
};

export default InboxLayout;
