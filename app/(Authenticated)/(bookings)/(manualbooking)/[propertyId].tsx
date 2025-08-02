import { ImageBackground, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import CustomSwitch from "@/app/components/CustomSwitch";
import ExistingAccountForm from "./ExistingAccountForm";
import NoAccountForm from "./NoAccountForm";

const ManualBooking = () => {
  const { propertyId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = React.useState("existing");

  return (
    <>
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
        </View>
        <View
          style={{ marginTop: 50, flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons
            name="chevron-back"
            size={40}
            color={Colors.primaryBackground}
          />
          <Text
            style={{
              marginLeft: 10,
              color: Colors.primaryBackground,
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Walk-ins
          </Text>
        </View>
        <View style={{ marginTop: 20 }}>
          <CustomSwitch
            initialValue={false}
            onValueChange={() => {
              setSelectedTab((prev) =>
                prev === "existing" ? "noAccount" : "existing"
              );
            }}
            leftLabel={"Existing Account"}
            rightLabel={"No Account"}
          />
          {selectedTab === "existing" ? (
            <View style={styles.forms}>
              <ExistingAccountForm />
            </View>
          ) : (
            <View
              style={styles.forms}
            >
              <NoAccountForm />
            </View>
          )}
        </View>
      </View>
    </>
  );
};

export default ManualBooking;

const styles = StyleSheet.create({
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  forms: {
    marginTop: 20,
    height: "100%",
    backgroundColor: Colors.secondaryBackground,
    padding: 25,
    borderRadius: 10,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
