import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/assets/styles/colors";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import IconButton from "../components/IconButton";
import {
  getCurrentUser,
  storeUserDataLocally,
  getStoredUserData,
  loginUser,
} from "@/app/Firebase/Services/AuthService";

const LoginScreen = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const [currentUserData, setCurrentUserData] = useState<any>(null); // Store user data here
  const [loading, setLoading] = useState<boolean>(true);

  const handleLogin = async () => {
    const result = await loginUser(email, password);
    if (result instanceof Error) {
      console.error("Login failed:", result.message);
    } else {
      const user = getCurrentUser();
      if (user) {
        await storeUserDataLocally(user); // Store user data in AsyncStorage
        setCurrentUserData(user); // Set the user data in state
      } else {
        const storedData = await getStoredUserData(); // Get stored data if no current user
        setCurrentUserData(storedData);
      }
    }
  };

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
        <Text style={styles.text}>
          Sign In with {`\n`}
          your Account
        </Text>
        <View style={styles.form}>
          <CustomTextInput
            placeholder="Email"
            label="Email"
            onChangeText={setEmail}
          />
          <CustomTextInput
            placeholder="Password"
            label="Password"
            secureTextEntry
            onChangeText={setPassword}
          />
          <Text
            style={{
              color: Colors.primary,
              textAlign: "right",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            Forgot Password?
          </Text>
          <CustomButton
            title="Sign In"
            onPress={handleLogin}
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
          <View style={{ marginTop: 25 }}>
            <IconButton
              icon="email-outline"
              text="Sign up with Email"
              onPress={() => {
                router.navigate("/RegisterScreen" as never);
              }}
              iconSize={25}
              iconColor={Colors.secondaryText}
              backgroundColor={Colors.primaryBackground}
              textColor={Colors.secondaryText}
              borderColor={Colors.secondaryText}
              borderWidth={1}
              style={{ marginBottom: 15 }} // Adds spacing
            />
            <IconButton
              icon="facebook"
              text="Login with Facebook"
              onPress={() => {}}
              iconSize={25}
              iconColor={Colors.secondaryText}
              backgroundColor={Colors.primaryBackground}
              textColor={Colors.secondaryText}
              borderColor={Colors.secondaryText}
              borderWidth={1}
              style={{ marginBottom: 15 }} // Adds spacing
            />
            <IconButton
              icon="google"
              text="Login with Google"
              onPress={() => {}}
              iconSize={25}
              iconColor={Colors.secondaryText}
              backgroundColor={Colors.primaryBackground}
              textColor={Colors.secondaryText}
              borderColor={Colors.secondaryText}
              borderWidth={1}
            />
          </View>
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
  },
  rememberMeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  line: {
    height: 1,
    backgroundColor: Colors.alternate, // Light gray color
    marginVertical: 10,
    width: "40%",
  },
});

export default LoginScreen;
