import React, { useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import CustomSwitch from "../components/CustomSwitch";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";
import {
  signupUser
} from "../Firebase/Services/AuthService";
import { setInitialUserData } from "../Firebase/Services/DatabaseService";
import UserData from "../types/UserData";
import { Notifier, Easing, NotifierWrapper } from "react-native-notifier";

const RegisterScreen = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [isHomeOwner, setIsHomeOwner] = useState<boolean>(true);
  const [IsLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    setIsLoading(true);

    try {
      // Validation checks with clearer alerts
      if (!email.trim()) {
        Notifier.showNotification({
          title: "❌ Missing Email",
          description: "Please fill in all fields.",
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          hideOnPress: false,
          containerStyle: {
            marginTop: 50
          },
        });
        setIsLoading(false);
        return;
      }

      // Add email format validation
      if (!isValidEmail(email.trim())) {
        Notifier.showNotification({
          title: "❌ Invalid Email",
          description: "Please check your email format.",
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          hideOnPress: false,
          containerStyle: {
            marginTop: 50
          },
        });
        setIsLoading(false);
        return;
      }

      if (!password.trim()) {
        Notifier.showNotification({
          title: "❌ Missing Password",
          description: "Please fill in all fields.",
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          hideOnPress: false,
          containerStyle: {
            marginTop: 50
          },
        });
        setIsLoading(false);
        return;
      }

      if (!confirmPassword.trim()) {
        Notifier.showNotification({
          title: "❌ Missing Confirm Password",
          description: "Please fill in all fields.",
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          hideOnPress: false,
          containerStyle: {
            marginTop: 50
          },
        });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        Notifier.showNotification({
          title: "❌ Password don't match",
          description: "Make sure to confirm your password correctly.",
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          hideOnPress: false,
          containerStyle: {
            marginTop: 50
          },
        });
        setIsLoading(false);
        return;
      }

      if (password.trim().length < 6) {
        Notifier.showNotification({
          title: "❌ Password must be at least 6 characters",
          description: "Require a stronger password.",
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          hideOnPress: false,
          containerStyle: {
            marginTop: 50
          },
        });
        setIsLoading(false);
        return;
      }

      console.log("Attempting to sign up with email:", email.trim());
      const user = await signupUser(email.trim(), password);

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
          reviews: [],
        };

        // ✅ Save user data to Firestore
        const isUserSaved = await setInitialUserData(user.uid, userData);

        if (isUserSaved) {
          router.replace("/(Authenticated)/(tabs)/Home");
        } else {
          Alert.alert("Error", "Failed to save user data.");
        }
      }
    } catch (error) {}
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
      />
      <NotifierWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
      </TouchableWithoutFeedback>
      </NotifierWrapper>
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
