import React, { useRef, useState } from "react";
import { ImageBackground, StyleSheet, View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import CustomSwitch from "../components/CustomSwitch";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const RegisterScreen = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [isTenant, setIsTenant] = useState<boolean>(true);

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
        <Image
          source={require("@/assets/images/Icons/Dark-Icon.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Create Account</Text>
        <View style={styles.form}>
          <CustomSwitch
            onValueChange={setIsTenant}
            leftLabel={"As a Tenant"}
            rightLabel={"As an Owner"}
            initialValue={isTenant}
          />
          <View style={{ marginVertical: 15 }}>
            <CustomTextInput placeholder="Email" label="Email" />
            <CustomTextInput
              placeholder="Password"
              label="Password"
              secureTextEntry
            />
            <CustomTextInput
              placeholder="ConfirmPassword"
              label="ConfirmPassword"
              secureTextEntry
            />
          </View>
          <CustomButton
            title="Create Account"
            onPress={() => {}}
            style={{ backgroundColor: Colors.primary }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 25,
            }}
          >
            <View style={styles.line} />
            <Text style={{ color: Colors.secondaryText, marginHorizontal: 10 }}>
              OR
            </Text>
            <View style={styles.line} />
          </View>
          <Text
            style={{
              color: Colors.primary,
              textAlign: "center",
              marginTop: 25,
              textDecorationLine: "underline",
            }}
            onPress={() => {
              // Navigate to login screen
              router.back();
            }}
            >
              Already have an account?
            </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 60,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 25,
    color: Colors.primaryBackground,
  },
  form: {
    marginTop: 15,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 20,
    padding: 15,
    paddingVertical: 25,
    width: "100%",
    height: "100%",
  },
  line: {
    height: 1,
    backgroundColor: Colors.alternate, // Light gray color
    marginVertical: 10,
    width: "40%",
  },
});

export default RegisterScreen;
