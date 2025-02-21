import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Image, View } from "react-native";
import Swiper from "react-native-swiper";
import Colors from "@/assets/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "@/app/components/CustomButton";
import { router } from "expo-router";
import { checkAuth } from "./Firebase/AuthService";
import { User } from "firebase/auth";

const OnboardingScreen = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <View
      style={{
        flex: 1,
        paddingTop: -insets.top,
        paddingBottom: -insets.bottom,
      }}
    >
      <Swiper
        style={styles.wrapper}
        loop={false}
        showsButtons={false}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.primaryBackground]}
          style={styles.slide}
        >
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Tired of looking for an apartment?</Text>
          <Text style={styles.description}>
            Our app provides wide variety of apartments from nearest to
            cheapest.
          </Text>
          <Image
            source={require("@/assets/images/OnboardingVectors/1.png")}
            style={styles.vector}
          />
        </LinearGradient>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryBackground]}
          style={styles.slide}
        >
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Find Your Perfect Place</Text>
          <Text style={styles.description}>
            We provide personalized recommendations and listings that match your
            unique lifestyle and needs!
          </Text>
          <Image
            source={require("@/assets/images/OnboardingVectors/2.png")}
            style={[styles.vector, { transform: [{ scaleX: -1 }] }]}
          />
        </LinearGradient>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryBackground]}
          style={styles.slide}
        >
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <Text style={styles.text}>Hassle-Free Renting Starts Here</Text>
          <Text style={styles.description}>
            Finding your next home has never been easier. Let’s make your move
            effortless!
          </Text>
          <Image
            source={require("@/assets/images/OnboardingVectors/3.png")}
            style={[styles.vector, { transform: [{ scaleX: -1 }] }]}
          />
          <CustomButton
            title="Get Started"
            onPress={() => {
              router.replace("/(Auth)/LoginScreen" as any);
            }}
            style={[styles.button, { backgroundColor: Colors.primary }]}
          />
        </LinearGradient>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 1,
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 80,
    justifyContent: "center",
    color: Colors.primaryBackground,
    paddingHorizontal: 25,
  },
  description: {
    fontSize: 15,
    justifyContent: "center",
    color: Colors.primaryBackground,
    paddingHorizontal: 25,
  },
  icon: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginTop: 50,
    marginLeft: 25,
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    marginTop: 120,
    marginHorizontal: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  dot: {
    backgroundColor: Colors.border,
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  vector: {
    resizeMode: "stretch",
    alignSelf: "center",
    marginTop: 50,
  },
});

export default OnboardingScreen;
