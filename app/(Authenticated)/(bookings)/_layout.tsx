// app/navigation/AppStack.tsx

import React from 'react';
import { Stack } from 'expo-router';

const BookingLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(bookproperty)"/>
      <Stack.Screen name="(viewbooking)"/>
    </Stack>
  );
};

export default BookingLayout;
