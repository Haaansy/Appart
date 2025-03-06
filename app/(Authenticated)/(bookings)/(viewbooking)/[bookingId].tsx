import {
  View,
  Text,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/assets/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import ApartmentScreen from "./ApartmentScreen";
import useBooking from "@/app/hooks/bookings/useBooking";
import Apartment from "@/app/types/Apartment";
import Booking from "@/app/types/Booking";
import TransientScreen from "./TransientScreen";
import Transient from "@/app/types/Transient";

const index = () => {
  const { bookingId, isApartment } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { bookingData, propertyData, loading, error } = useBooking(String(bookingId));
  
  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={[
          styles.backgroundVector,
          { position: "absolute", width: "100%", height: "100%" },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingHorizontal: 25,
          }}
        >
          <View style={styles.titleContainer}>
            <TouchableOpacity>
              <Ionicons
                name="chevron-back"
                size={30}
                color={Colors.primaryBackground}
                onPress={() => {
                  router.back();
                }}
              />
            </TouchableOpacity>
            <Text style={styles.text}>
              { `Review ${'\n'}${isApartment === "true" ? "Apartment" : "Transient"} Booking` }
            </Text>
          </View>
          <Animated.View style={{ flex: 1, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: Colors.primaryBackground,
                borderRadius: 20,
                padding: 15,
                paddingVertical: 25,
                flex: 1,
              }}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                {isApartment === "true" ? (
                  <View>
                    {loading ? (
                      <Text>Loading apartment...</Text>
                    ) : error ? (
                      <Text>{error}</Text>
                    ) : (
                      <ApartmentScreen apartment={propertyData as Apartment} booking={bookingData as Booking} />
                    )}
                  </View>
                ) : (
                  <View>
                    {loading ? (
                      <Text>Loading transient...</Text>
                    ) : error ? (
                      <Text>{error}</Text>
                    ) : (
                      <TransientScreen transient={propertyData as Transient} booking={bookingData as Booking} />
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  titleContainer: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  text: {
    fontSize: 35,
    fontWeight: "bold",
    color: Colors.primaryBackground,
    marginLeft: 15,
  },
  form: {
    marginTop: 15,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 20,
    padding: 15,
    paddingVertical: 25,
    width: "100%",
  },
});

export default index;
