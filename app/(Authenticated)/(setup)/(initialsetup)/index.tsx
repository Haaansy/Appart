import { updateUserData } from "@/app/Firebase/Services/DatabaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";
import React, { useState } from "react";
import { Animated, BackHandler, ImageBackground, View, Image, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles/styles";
import CustomButton from "@/app/components/CustomButton";
import PageOne from "./pages/pageOne";
import PageTwo from "./pages/pageTwo";
import PageThree from "./pages/pageThree";

// Pages array with components
const pages = [PageOne, PageTwo, PageThree];

export default function MultiStepForm() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const fadeAnim = new Animated.Value(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    sex: "",
    birthDate: {
      month: "",
      day: "",
      year: "",
    },
    phoneNumber: "",
    emergencyContact: "",
    emergentContactNumber: "",
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true; // Prevent back action
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
  
      return () => subscription.remove();
    }, [])
  );

  // Function to update form data
  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    console.log(formData)
  };

  const handleNext = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("currentUser");

      if (!currentUser) {
        console.error("Error: No user found in AsyncStorage");
        return;
      }

      const user = JSON.parse(currentUser || "{}");

      if (!user.id) {
        console.error("Error: User ID is missing in AsyncStorage data", user);
        return;
      }

      // Define updatedUser before using it
      const updatedUser = {
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        sex:
          formData.sex === "Male" || formData.sex === "Female"
            ? formData.sex
            : undefined,
        birthDate: formData.birthDate || null,
        phoneNumber: formData.phoneNumber || "",
        emergencyContact: formData.emergencyContact || "",
        emergentContactNumber: formData.emergentContactNumber || "",
      };

      if (step < pages.length - 1) {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setStep(step + 1);
          fadeAnim.setValue(1);
        });

        console.log("Updated User:", updatedUser);
        await AsyncStorage.setItem(
          "currentUser",
          JSON.stringify({ ...user, ...updatedUser })
        );
      } else {
        await updateUserData(user.id, updatedUser); // Use `user.id` instead of `user.uid`

        // Navigate to Home after successful update
        router.replace("/(Authenticated)/(tabs)/Home");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  };

  const CurrentPage = pages[step]; // Get current page component

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
        <Text style={styles.text}>We want to know more about you.</Text>
        <View style={styles.form}>
          {/* Dots at the Top */}
          <View style={styles.dotsContainer}>
            {pages.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, step === index && styles.activeDot]}
              />
            ))}
          </View>

          {/* Animated Page Content */}
          <Animated.View style={{ opacity: fadeAnim, marginTop: 20 }}>
            <CurrentPage
              formData={formData}
              updateFormData={updateFormData}
              onValidation={(valid) => setIsValid(valid)}
            />
          </Animated.View>

          {/* Proceed Button */}
          <CustomButton
            title={step === pages.length - 1 ? "Done" : "Proceed"}
            onPress={handleNext}
            disabled={!isValid}
            style={!isValid ? styles.disabledButton : {}}
          />
        </View>
      </View>
    </>
  );
}