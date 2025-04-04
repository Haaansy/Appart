import React, { useEffect, useState, useRef } from "react";
import { Text, StyleSheet, Image, View, Animated, TouchableOpacity } from "react-native";
import PagerView from "react-native-pager-view";
import Colors from "@/assets/styles/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "@/app/components/CustomButton";
import { router } from "expo-router";

const OnboardingScreen = () => {
  const insets = useSafeAreaInsets(); // Get safe area insets
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);

  const slides = [
    {
      title: "Tired of looking for an apartment?",
      description: "Our app provides wide variety of apartments from nearest to cheapest.",
      image: require("@/assets/images/OnboardingVectors/1.png"),
      imageStyle: {}
    },
    {
      title: "Find Your Perfect Place",
      description: "We provide personalized recommendations and listings that match your unique lifestyle and needs!",
      image: require("@/assets/images/OnboardingVectors/2.png"),
      imageStyle: { transform: [{ scaleX: -1 }] }
    },
    {
      title: "Hassle-Free Renting Starts Here",
      description: "Finding your next home has never been easier. Let's make your move effortless!",
      image: require("@/assets/images/OnboardingVectors/3.png"),
      imageStyle: { transform: [{ scaleX: -1 }] }
    },
  ];

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              currentPage === index && styles.activeDot
            ]}
            onPress={() => {
              pagerRef.current?.setPage(index);
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        paddingTop: -insets.top,
        paddingBottom: -insets.bottom,
      }}
    >
      <PagerView
        ref={pagerRef}
        style={styles.wrapper}
        initialPage={0}
        onPageSelected={(e) => {
          setCurrentPage(e.nativeEvent.position);
        }}
      >
        {slides.map((slide, index) => (
          <LinearGradient
            key={index}
            colors={[Colors.primary, Colors.primaryBackground]}
            style={styles.slide}
          >
            <Image
              source={require("@/assets/images/Icons/Dark-Icon.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            <Image
              source={slide.image}
              style={[styles.vector, slide.imageStyle]}
            />
            {index === slides.length - 1 && (
              <CustomButton
                title="Get Started"
                onPress={() => {
                  router.replace("/(Auth)/LoginScreen");
                }}
                style={[styles.button, { backgroundColor: Colors.primary }]}
              />
            )}
          </LinearGradient>
        ))}
      </PagerView>
      <Pagination />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
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
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
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
