import React, { useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import CustomSwitch from "../components/CustomSwitch";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import {
  signupUser,
  storeUserDataLocally,
} from "../Firebase/Services/AuthService";
import { setInitialUserData } from "../Firebase/Services/DatabaseService";
import { UserData } from "../types/UserData";

const RegisterScreen = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [isHomeOwner, setIsHomeOwner] = useState<boolean>(true);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSignup = async () => {
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      setIsLoading(false);
      return;
    }

    const user = await signupUser(email, password);
    setIsLoading(false);

    if (user) {
      const userData: UserData = {
        email: user.email,
        role: isHomeOwner ? "home owner" : "tenant",
        id: "",
        firstName: "",
        lastName: "",
        birthDate: {
          month: "",
          day: "",
          year: "",
        },
        emergencyContact: "",
        emergentContactNumber: "",
        coverUrl: "",
        sex: "",
        displayName: "",
        photoUrl: "",
        phoneNumber: "",
        isAdmin: false,
      };

      // ✅ Save user data to Firestore
      const isUserSaved = await setInitialUserData(user.uid, userData);

      if (isUserSaved) {
        // ✅ Store user data locally
        await storeUserDataLocally(user);
        router.replace("/(Authenticated)/(tabs)/Home");
      } else {
        Alert.alert("Error", "User not saved.");
      }
    } else {
      Alert.alert("Error", "cant create.");
    }
  };

  if (IsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
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
        <Image
          source={require("@/assets/images/Icons/Dark-Icon.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Create Account</Text>
        <View style={styles.form}>
          <CustomSwitch
            onValueChange={setIsHomeOwner}
            leftLabel={"As a Tenant"}
            rightLabel={"As an Owner"}
            initialValue={isHomeOwner}
          />
          <View style={{ marginVertical: 15 }}>
            <CustomTextInput
              placeholder="Email"
              label="Email"
              value={email}
              onChangeText={setEmail}
            />
            <CustomTextInput
              placeholder="Password"
              label="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <CustomTextInput
              placeholder="ConfirmPassword"
              label="ConfirmPassword"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <CustomButton
            title="Create Account"
            onPress={handleSignup}
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
