import CustomButton from "@/app/components/CustomButton";
import { updateUserData } from "@/app/Firebase/Services/DatabaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { Animated, ImageBackground, View, Image, Text, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles/styles";
import PageOne from "./pages/pageOne";
import PageTwo from "./pages/pageTwo";
import PageThree from "./pages/pageThree";
import Colors from "@/assets/styles/colors";

// Pages array with components
const pages = [PageOne, PageTwo, PageThree];

export default function MultiStepForm() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const fadeAnim = new Animated.Value(1);
  const [formData, setFormData] = useState({
    displayName: "",
    photoUrl: "",
    coverUrl: "",
  });
  const [loading, setLoading] = useState(false);

  // Function to update form data
  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    try {
      const currentUser = await AsyncStorage.getItem("userData");
      if (!currentUser) {
        console.error("Error: No user found in AsyncStorage");
        return;
      }

      const user = JSON.parse(currentUser || "{}");
      if (!user.id) {
        console.error("Error: User ID is missing in AsyncStorage data", user);
        return;
      }

      // Ensure the latest formData is used
      const updatedUser = {
        displayName: formData.displayName,
        photoUrl: formData.photoUrl,
        coverUrl: formData.coverUrl,
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

        await AsyncStorage.setItem(
          "userData",
          JSON.stringify({ ...user, ...updatedUser })
        );
      } else {
        setLoading(true);
        await updateUserData(user.id, updatedUser);
        setLoading(false);
        router.replace("/(Authenticated)/(tabs)/Home");
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
    }
  };

  const CurrentPage = pages[step]; // Get current page component

  if(loading) {
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
        <Text style={styles.text}>Finish Setting Up you Account.</Text>
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
            disabled={!isValid} // Now controlled by displayName validation in PageOne
            style={[
              !isValid
                ? styles.disabledButton
                : { backgroundColor: Colors.primary },
            ]}
          />
        </View>
      </View>
    </>
  );
}