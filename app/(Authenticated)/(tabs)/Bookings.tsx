import React, { act, useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import Booked from "../(bookings)/pages/Booked";
import BookingCard from "@/app/components/BookingComponents/BookingCard";

type MainTabType = "Apartments" | "Transients";

const SUB_TABS: Record<MainTabType, string[]> = {
  Apartments: [
    "For Approval",
    "For Viewing",
    "Booking Approved",
    "Booking Completed",
    "Declined",
  ],
  Transients: [
    "For Approval",
    "Booking Approved",
    "Booking Completed",
    "Declined",
  ],
};

const Bookings = () => {
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("Apartments");
  const [activeSubTab, setActiveSubTab] = useState<string>(
    SUB_TABS["Apartments"][0]
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setCurrentUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
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
        {/* Header */}
        <View style={styles.topBar}>
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <View style={{ flexDirection: "column", marginLeft: 15 }}>
            <Text style={styles.greetings}>
              Hey, {currentUserData?.displayName || "Guest"}!
            </Text>
            <Text style={styles.subtext}>Here are your bookings.</Text>
          </View>
        </View>

        {/* Main Tabs */}
        <View style={styles.mainTabsContainer}>
          {Object.keys(SUB_TABS).map((tab) => {
            const typedTab = tab as MainTabType;
            return (
              <TouchableOpacity
                key={typedTab}
                style={[
                  styles.mainTab,
                  activeMainTab === typedTab && styles.activeMainTab,
                ]}
                onPress={() => {
                  setActiveMainTab(typedTab);
                  setActiveSubTab(SUB_TABS[typedTab][0]); // Reset sub-tab
                }}
              >
                <Text
                  style={[
                    styles.mainTabText,
                    activeMainTab === typedTab && styles.activeMainTabText,
                  ]}
                >
                  {typedTab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Sub Tabs */}
        <View
          style={styles.subTabsContainer}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {SUB_TABS[activeMainTab].map((subTab) => (
              <TouchableOpacity
                key={subTab}
                style={[
                  styles.subTab,
                  activeSubTab === subTab && styles.activeSubTab,
                ]}
                onPress={() => setActiveSubTab(subTab)}
              >
                <Text
                  style={[
                    styles.subTabText,
                    activeSubTab === subTab && styles.activeSubTabText,
                  ]}
                >
                  {subTab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Placeholder */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>
            Showing: {activeMainTab} - {activeSubTab}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
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

  /* Main Tabs */
  mainTabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    marginTop: 20,
    elevation: 2,
  },
  mainTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeMainTab: {
    backgroundColor: Colors.primary,
  },
  mainTabText: {
    fontSize: 14,
    color: "gray",
  },
  activeMainTabText: {
    color: "white",
    fontWeight: "bold",
  },

  /* Sub Tabs */
  subTabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: Colors.primaryBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  subTab: {
    justifyContent: "center",
    paddingHorizontal: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    backgroundColor: "#e0e0e0",
    height: 25,
  },
  activeSubTab: {
    backgroundColor: Colors.primary,
  },
  subTabText: {
    fontSize: 12,
    color: "black",
  },
  activeSubTabText: {
    color: "white",
    fontWeight: "bold",
  },

  /* Content Display */
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primaryBackground
  },
  contentText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
});

export default Bookings;
