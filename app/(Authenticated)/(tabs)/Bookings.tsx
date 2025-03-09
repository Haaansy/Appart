import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import useFetchBookings from "@/app/hooks/bookings/useFetchBookings";
import BookingCard from "@/app/components/BookingComponents/BookingCard";
import { router } from "expo-router";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import UserData from "@/app/types/UserData";

type MainTabType = "Apartment" | "Transient";

const Bookings = () => {
  const [currentUserData, setCurrentUserData] = useState<UserData>(
    {} as UserData
  );
  const SUB_TABS: Record<MainTabType, string[]> = {
    Apartment: [
      ...(currentUserData.role === "tenant" ? ["Pending Invitation"] : []), // Add only if tenant
      "Booked",
      "Viewing Confirmed",
      "Booking Confirmed",
      "Booking Completed",
      "Booking Declined",
    ],
    Transient: [
      "Booked",
      "Booking Confirmed",
      "Booking Completed",
      "Booking Declined",
    ],
  };

  const insets = useSafeAreaInsets();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [activeMainTab, setActiveMainTab] = useState<MainTabType>("Apartment");
  const [activeSubTab, setActiveSubTab] = useState<string>(
    SUB_TABS["Apartment"][0]
  );

  const { bookings, loading, error } = useFetchBookings(
    activeSubTab,
    activeMainTab
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getStoredUserData();
        setCurrentUserData(user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={styles.backgroundVector}
      />
      <View style={[styles.container]}>
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
        <View style={styles.subTabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SUB_TABS[activeMainTab].map((subTab) => {
              const sanitizedKey = `${activeMainTab}-${subTab
                .trim()
                .replace(/\s+/g, "_")}`;

              return (
                <TouchableOpacity
                  key={sanitizedKey} // ✅ Ensure truly unique key
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
              );
            })}
          </ScrollView>
        </View>

        {/* Bookings List */}
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginBottom: 5}}/>
              <Text> Please wait for a moment. </Text>
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : bookings.length === 0 ? (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={require("@/assets/images/AI-Character-V1/sad-reading.png")}
                style={styles.character}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {" "}
                No Bookings Found. {"\n"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (item.type === "Apartment") {
                      router.push(
                        `/(Authenticated)/(bookings)/(viewbooking)/${item.id}?isApartment=true`
                      );
                    } else {
                      router.push(
                        `/(Authenticated)/(bookings)/(viewbooking)/${item.id}?isApartment=false`
                      );
                    }
                  }}
                >
                  <BookingCard booking={item} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  icon: { width: 60, height: 60, resizeMode: "cover" },
  greetings: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryBackground,
  },
  subtext: { fontSize: 12, color: Colors.primaryBackground },
  topBar: { flexDirection: "row", marginTop: 65, alignItems: "center" },

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
  activeMainTab: { backgroundColor: Colors.primary },
  mainTabText: { fontSize: 14, color: "gray" },
  activeMainTabText: { color: "white", fontWeight: "bold" },

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
  activeSubTab: { backgroundColor: Colors.primary },
  subTabText: { fontSize: 12, color: "black" },
  activeSubTabText: { color: "white", fontWeight: "bold" },

  /* Content */
  contentContainer: { flex: 1, marginTop: 10 },
  errorText: { color: "red", textAlign: "center" },
  emptyText: { textAlign: "center", fontSize: 16 },
  bookingItem: {
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
  },
  bookingTitle: { fontSize: 16, fontWeight: "bold" },
  character: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
    marginBottom: 10,
  },
});

export default Bookings;
