import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
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
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Please fill in both email and password.');
      return;
    }

    setLoading(true); // Start loading
    const user = await loginUser(email, password); // Call loginUser
    setLoading(false); // End loading

    if (user) {
      Alert.alert('Login Successful');
      // Navigate to the home screen (or another screen) after successful login
      await storeUserDataLocally(user); // Store user data in AsyncStorage
      router.navigate('/(Authenticated)/(tabs)/Home');
    } else {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  if(loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
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
            <Text style={{ color: Colors.secondaryText, marginHorizontal: 10 }}>
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
            <IconButton
              icon="logo-facebook"
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
              icon="logo-google"
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
