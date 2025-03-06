import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import AlertBox from "@/app/components/Alerts/AlertBox";
import UserData from "@/app/types/UserData";
import getAlerts from "@/app/hooks/alerts/getAlerts";
import Alert from "@/app/types/Alert";
import useUpdateAlertRead from "@/app/hooks/alerts/useUpdateAlertRead";
import { router } from "expo-router";

const Alerts = () => {
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState<UserData>(
    {} as UserData
  );

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setCurrentUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Get alerts only if user ID is available
  const { alerts, loading } = getAlerts(currentUserData?.id || "");

  // Hook for marking alerts as read
  const { markAlertAsRead, loading: markedAlertLoading, error } =
    useUpdateAlertRead();

  // Handle alert press
  const handleAlertPress = async (alert: Alert) => {
    await markAlertAsRead(alert);

    if (alert.type === "Booking") {
      if(alert.bookingType === "Apartment") {
        router.push(`/(Authenticated)/(bookings)/(viewbooking)/${alert.bookingId}?isApartment=true`);
      } else {
        router.push(`/(Authenticated)/(bookings)/(viewbooking)/${alert.bookingId}?isApartment=false`);
      }
    } else {
      // Navigate to conversation screen
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primaryBackground} />
      </View>
    );
  }

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={styles.backgroundVector}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <View style={{ flexDirection: "column", marginLeft: 15 }}>
            <Text style={styles.greetings}>
              Hey, {currentUserData?.displayName || "Guest"}!
            </Text>
            <Text style={styles.subtext}>Here are some news for you.</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <View style={styles.form}>
            <FlatList
              data={alerts}
              keyExtractor={(item) => item.id ?? Math.random().toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleAlertPress(item)}>
                  <AlertBox alert={item} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    marginBottom: 110,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  greetings: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryBackground,
  },
  subtext: {
    fontSize: 12,
    fontWeight: "regular",
    color: Colors.primaryBackground,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  form: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
});

export default Alerts;
