import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"; // Correct import
import Home from "./Home";
import Alerts from "./Alerts";
import Bookings from "./Bookings";
import Inbox from "./Inbox";
import Profile from "./Profile";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { StatusBar, Platform, View, Text } from "react-native"; // Import StatusBar, Platform, View, and Text
import getAlerts from "@/app/hooks/alerts/getAlerts"; // Import getAlerts hook
import {
  getCurrentUser,
  getStoredUserData,
} from "@/app/Firebase/Services/AuthService"; // Import getCurrentUser from AuthService
import UserData from "@/app/types/UserData";
import Manage from "./Manage";
import { getAuth } from "firebase/auth";
import useFetchConversations from "@/app/hooks/inbox/useFetchConversation";
import AITest from "./AITest";

// Create the bottom tab navigator
const Tab = createBottomTabNavigator();

interface BadgeIconProps {
  name: string;
  color: string;
  badgeCount: number;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ name, color, badgeCount }) => (
  <View>
    <Ionicons name={name} size={24} color={color} />
    {badgeCount > 0 && (
      <View
        style={{
          position: "absolute",
          right: -6,
          top: -3,
          backgroundColor: "red",
          borderRadius: 6,
          width: 12,
          height: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
          {badgeCount}
        </Text>
      </View>
    )}
  </View>
);

const _layout = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null); // State for current user data
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(0); // State for unread alerts count
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0); // State for unread messages count
  const [Loading, setLoading] = useState<Boolean>(true); // State for loading

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Make sure the user is authenticated first
        const auth = getAuth();
        if (!auth.currentUser) {
          console.log("No authenticated user");
          return;
        }

        const user = await getStoredUserData();
        setCurrentUserData(user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const { alerts, loading: alertLoading } = getAlerts(
    currentUserData?.id || ""
  );

  useEffect(() => {
    if (alerts.length > 0) {
      const unreadAlerts = alerts.filter((alert) => !alert.isRead);
      setUnreadAlertsCount(unreadAlerts.length);
    }
  }, [alerts]);

  const { conversations, loading: conversationsLoading, error: conversationError } = useFetchConversations(String(currentUserData?.id));

  useEffect(() => {
    if (conversations.length > 0) {
      const unreadConversations = conversations.filter((conversation) => 
        conversation.members.some((member) => member.user.id === currentUserData?.id && member.count > 0)
      );

      setUnreadMessagesCount(unreadConversations.length);
    }
  }, [conversations]);

  if (Loading || alertLoading || conversationsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      {Platform.OS === "android" && <StatusBar hidden={true} />}
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "white",
            position: "absolute",
            bottom: 0, // Fix the bottom positioning to 0
            left: 0,
            right: 0,
            elevation: 10, // Optional: add a slight shadow for floating effect
            height: 60, // Adjust height to reduce excess space
            paddingBottom: insets.bottom, // Adjust for bottom inset
            marginHorizontal: 10, // Add margin to the sides
            borderRadius: 15, // Optional: add rounded corners
            marginBottom: 35, // Optional: add margin to the bottom
          },
          tabBarActiveTintColor: Colors.primary, // Active icon color
          tabBarInactiveTintColor: Colors.secondaryText, // Inactive icon color
          tabBarLabelStyle: { fontSize: 12 }, // Style for the label under the icon
          headerShown: false, // Hide the header
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} />
            ),
            tabBarLabel: "Home",
          }}
        >
          {() => (
            <Home
              currentUserData={currentUserData as UserData}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Alerts"
          options={{
            tabBarIcon: ({ color }) => (
              <BadgeIcon
                name="notifications-outline"
                color={color}
                badgeCount={unreadAlertsCount}
              />
            ),
            tabBarLabel: "Alerts",
          }}
        >
          {() => (
            <Alerts
              alerts={alerts}
              loading={alertLoading}
              currentUserData={currentUserData as UserData}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Bookings"
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar-outline" size={24} color={color} />
            ),
            tabBarLabel: "Bookings",
          }}
        >
          {() => <Bookings />}
        </Tab.Screen>
        <Tab.Screen
          name="Inbox"
          options={{
            tabBarIcon: ({ color }) => (
              <BadgeIcon
                name="chatbox-outline"
                color={color}
                badgeCount={unreadMessagesCount}
              />
            ),
            tabBarLabel: "Inbox",
          }}
        >
          {() => <Inbox conversations={conversations} loading={Loading} currentUserData={currentUserData as UserData} />}
        </Tab.Screen>
        {currentUserData?.role === "home owner" && (
          <Tab.Screen
            name="Manage"
            component={Manage}
            options={{
              tabBarIcon: ({ color }) => (
                <Ionicons name="build-outline" size={24} color={color} />
              ),
              tabBarLabel: "Manage",
            }}
          />
        )}
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
            tabBarLabel: "Profile",
          }}
        />
        <Tab.Screen
          name="AITEST"
          component={AITest}
          options={{
            tabBarIcon: ({ color }) => (
              <Ionicons name="person-outline" size={24} color={color} />
            ),
            tabBarLabel: "AI TEST",
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default _layout;
