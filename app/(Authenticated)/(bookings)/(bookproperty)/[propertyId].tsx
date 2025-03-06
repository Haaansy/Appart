import {
  View,
  Text,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/assets/styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useApartment } from "@/app/hooks/apartment/useApartment";
import { useTransient } from "@/app/hooks/transient/useTransient";
import ApartmentScreen from "./ApartmentScreen";
import TransientScreen from "./TransientScreen";

const index = () => {
  const { propertyId, isApartment } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const {
    apartment,
    loading: apartmentLoading,
    error: apartmentError,
  } = useApartment(isApartment === "true" ? String(propertyId) : "");

  const {
    transient,
    loading: transientLoading,
    error: transientError,
  } = useTransient(isApartment === "false" ? String(propertyId) : "");

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
              Book {isApartment === "true" ? "Apartment" : "Transient"}
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
                    {apartmentLoading ? (
                      <Text>Loading apartment...</Text>
                    ) : apartmentError ? (
                      <Text>{apartmentError}</Text>
                    ) : (
                      <ApartmentScreen apartment={apartment} />
                    )}
                  </View>
                ) : (
                  <View>
                    {transientLoading ? (
                      <Text>Loading transient...</Text>
                    ) : transientError ? (
                      <Text>{transientLoading}</Text>
                    ) : (
                      <TransientScreen transient={transient}/>
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
