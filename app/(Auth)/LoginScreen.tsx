import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Easing,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Colors from "@/assets/styles/colors";
import CustomTextInput from "../components/CustomTextInput";
import CustomButton from "../components/CustomButton";
import IconButton from "../components/IconButton";
import { loginUser } from "@/app/Firebase/Services/AuthService";
import { Notifier } from "react-native-notifier";

const LoginScreen = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true); // Start loading
    try {
      if (!email.trim() || !password.trim()) {
        Notifier.showNotification({
          title: "❌ Missing Email or Password",
          description: "Please fill in all fields.",
          duration: 3000,
          showAnimationDuration: 800,
          showEasing: Easing.bounce,
          hideOnPress: false,
          containerStyle: {
            marginTop: 50,
          },
        });
        setLoading(false); // End loading
        return;
      }

      const user = await loginUser(email, password); // Call loginUser

      if (user) {
        setLoading(false); // End loading
        router.replace("/(Authenticated)/(tabs)/Home");
      }
    } catch (error) {
      setLoading(false); // End loading
      Alert.alert(
        "Login failed",
        "Please check your credentials and try again."
      );
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Logging In.</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("@/assets/images/Vectors/background.png")}
          style={styles.backgroundVector}
        ></ImageBackground>
        <View
          style={{
            paddingTop: -insets.top,
            paddingBottom: -insets.bottom,
            paddingHorizontal: 25,
            flex: 1,
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
              onChangeText={(value) => setEmail(value)}
              value={email}
            />
            <CustomTextInput
              placeholder="Password"
              label="Password"
              secureTextEntry
              onChangeText={(value) => setPassword(value)}
              value={password}
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
              <Text
                style={{ color: Colors.secondaryText, marginHorizontal: 10 }}
              >
                OR
              </Text>
              <View style={styles.line} />
            </View>
            <View style={{ marginTop: 25 }}>
              <IconButton
                icon="mail-outline"
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
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
