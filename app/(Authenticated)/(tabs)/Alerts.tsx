import React from "react";
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
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Import GestureHandlerRootView
import { Swipeable } from "react-native-gesture-handler"; // Correct import for Swipeable from gesture-handler
import Colors from "@/assets/styles/colors";
import AlertBox from "@/app/components/Alerts/AlertBox";
import UserData from "@/app/types/UserData";
import Alert from "@/app/types/Alert";
import useUpdateAlertRead from "@/app/hooks/alerts/useUpdateAlertRead";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deleteAlert } from "@/app/Firebase/Services/DatabaseService";

interface AlertsProps {
  alerts: Alert[];
  loading: boolean;
  currentUserData: UserData;
}

const Alerts: React.FC<AlertsProps> = ({
  alerts,
  loading,
  currentUserData,
}) => {
  // Hook for marking alerts as read
  const {
    markAlertAsRead,
    loading: markedAlertLoading,
    error,
  } = useUpdateAlertRead();

  // Handle alert press
  const handleAlertPress = async (alert: Alert) => {
    await markAlertAsRead(alert);

    if (alert.type === "Booking") {
      if (alert.bookingType === "Apartment") {
        router.push(
          `/(Authenticated)/(bookings)/(viewbooking)/${alert.bookingId}?isApartment=true`
        );
      } else {
        router.push(
          `/(Authenticated)/(bookings)/(viewbooking)/${alert.bookingId}?isApartment=false`
        );
      }
    } else {
      // Navigate to conversation screen
    }
  };

  // Blank function for deleting alert
  const handleDeleteAlert = async (alertId: string) => {
    try {
      // Delete alert
      await deleteAlert(alertId);
    } catch (error) {
      console.error("Error deleting alert: ", error);
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={styles.backgroundVector}
      />
      <View style={[styles.container]}>
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
              contentContainerStyle={{ flexGrow: 1 }}
              data={alerts}
              keyExtractor={(item) => item.id ?? Math.random().toString()}
              ListEmptyComponent={
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image
                    source={require("@/assets/images/AI-Character-V1/alert.png")}
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
                    No Alerts Found. {"\n"}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "regular",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      Stay Updated{" "}
                    </Text>
                  </Text>
                </View>
              }
              renderItem={({ item }) => (
                <Swipeable
                  renderRightActions={() => (
                    <View style={styles.deleteButtonContainer}>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteAlert(String(item.id))}
                      >
                        <Ionicons name="trash" style={styles.deleteIcon} />
                      </TouchableOpacity>
                    </View>
                  )}
                >
                  <TouchableOpacity onPress={() => handleAlertPress(item)}>
                    <AlertBox alert={item} />
                  </TouchableOpacity>
                </Swipeable>
              )}
            />
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
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
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    backgroundColor: "red",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  deleteIcon: {
    width: 24,
    height: 24,
    color: "white",
  },
  character: {
    width: "50%",
    height: "50%",
    resizeMode: "cover",
    marginBottom: 10
  }
});

export default Alerts;
