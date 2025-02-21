import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Correct import
import Home from './Home';
import Alerts from './Alerts';
import Bookings from './Bookings';
import Inbox from './Inbox';
import Profile from './Profile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/assets/styles/colors';

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

const _layout = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'white',
          position: 'absolute', 
          bottom: 0,  // Fix the bottom positioning to 0
          left: 0,
          right: 0,
          elevation: 10, // Optional: add a slight shadow for floating effect
          height: 60, // Adjust height to reduce excess space
          paddingBottom: insets.bottom,  // Adjust for bottom inset
          marginHorizontal: 10,  // Add margin to the sides
          borderRadius: 15,  // Optional: add rounded corners
          marginBottom: 35,  // Optional: add margin to the bottom
        },
        tabBarActiveTintColor: Colors.primary,  // Active icon color
        tabBarInactiveTintColor: Colors.secondaryText,  // Inactive icon color
        tabBarLabelStyle: { fontSize: 12 },  // Style for the label under the icon
        headerShown: false,  // Hide the header
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="notifications-outline" size={24} color={color} />,
          tabBarLabel: 'Alerts',
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={Bookings}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="calendar-outline" size={24} color={color} />,
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={Inbox}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="mail-outline" size={24} color={color} />,
          tabBarLabel: 'Inbox',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default _layout;
