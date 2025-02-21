import React, { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View, Text, Image, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import IconButton from "@/app/components/IconButton";
import CustomSwitch from "@/app/components/CustomSwitch";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";

const Home = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [isApartment, setIsApartment] = React.useState(true); // For switching between apartments and transients

  const [currentUserData, setCurrentUserData] = useState<any>(null); // Store the user data
  const [loading, setLoading] = useState<boolean>(true); // Track loading state

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getStoredUserData(); // Get stored user data
      setCurrentUserData(userData); // Set the data in state
      setLoading(false); // Set loading to false
    };

    fetchUserData(); // Call the function on mount
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={styles.backgroundVector}
      ></ImageBackground>
      <View
        style={{
          paddingTop: -insets.top,
          paddingBottom: -insets.bottom,
          paddingHorizontal: 25,
        }}
      >
        <View style={styles.topBar}>
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <View style={{ flexDirection: "column", marginLeft: 15 }}>
            <Text style={styles.greetings}>Hey, {currentUserData["display_name"]}</Text>
            <Text style={styles.subtext}>Looking for somewhere to stay?</Text>
          </View>
          <IconButton
            icon="search"
            onPress={() => {}}
            style={{
              marginLeft: "auto",
              height: 55,
              justifyContent: "center",
              alignItems: "center",
            }}
            iconColor={Colors.primary}
            iconSize={24}
            width={60}
            borderWidth={0}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <CustomSwitch
            initialValue={isApartment}
            onValueChange={setIsApartment}
            leftLabel={"Apartments"}
            rightLabel={"Transients"}
          />
        </View>
      </View>
    </>
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
});

export default Home;
