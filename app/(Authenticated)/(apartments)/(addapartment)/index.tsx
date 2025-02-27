import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Text,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/app/components/CustomButton";
import PageOne from "./pages/PageOne";
import styles from "./styles/styles";
import Colors from "@/assets/styles/colors";
import PageTwo from "./pages/PageTwo";
import PageThree from "./pages/PageThree";
import PageFour from "./pages/PageFour";
import { createApartment } from "@/app/Firebase/Services/DatabaseService";
import { getApartments } from "@/app/hooks/apartment/getApartments";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import { UserData } from "@/app/types/UserData";

const pages = [PageOne, PageTwo, PageThree, PageFour];

const Index = () => {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [formData, setFormData] = useState({
    images: [],
    title: "",
    status: "Available",
    address: "",
    price: 0,
    securityDeposit: 0,
    description: "",
    tags: [],
    bedRooms: 0,
    bathRooms: 0,
    kitchen: 0,
    livingRooms: 0,
    parking: 0,
    area: 0,
    levels: 1,
    maxTentants: 1,
    electricIncluded: false,
    waterIncluded: false,
    internetIncluded: false,
    houseRules: [],
    requirements: [],
    leaseTerms: [],
    coordinates: [0, 0],
    createdAt: Date.now(),
  });
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        AsyncStorage.removeItem("uploadedImages")
          .then(() => console.log("Uploaded images cleared from AsyncStorage"))
          .catch((error) =>
            console.error("Error clearing uploaded images:", error)
          );
      };
    }, [])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getStoredUserData();
      setCurrentUser(userData);
    };

    fetchUserData();
  }, []);

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [key]: value };
      console.log(isValid);
      console.log(updatedFormData);
      return updatedFormData;
    });
  };

  const handleNext = () => {
    if (step < pages.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setStep(step + 1);
        fadeAnim.setValue(1);
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setStep(step - 1);
        fadeAnim.setValue(1);
      });
    }
  };

  const handlePublish = async () => {
    if (!currentUser) {
      console.error("Current user is null. Cannot publish apartment.");
      Alert.alert("Error", "User data is missing. Please try again.");
      return;
    }

    try {
      console.log("Publishing apartment with data:", formData);

      const newApartmentID = await createApartment(formData);

      if (newApartmentID) {
        console.log("New apartment created with ID:", newApartmentID);

        router.push(
          `/(Authenticated)/(tabs)/Home`
        );
      } else {
        console.error("Failed to create an apartment");
        Alert.alert(
          "Error",
          "Failed to create an apartment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error during apartment creation:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const onInputFocus = (key: string) => {
    const input = inputRefs.current[key];
    if (input && scrollViewRef.current) {
      setTimeout(() => {
        input.measureLayout(scrollViewRef.current as any, (_x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 50, animated: true });
        });
      }, 300);
    }
  };

  const CurrentPage = pages[step];

  if (isLoading || !currentUser) {
    return <ActivityIndicator size="large" color={Colors.primary} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={[
          styles.backgroundVector,
          { position: "absolute", width: "100%", height: "100%" },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingHorizontal: 25,
          }}
        >
          <View style={styles.titleContainer}>
            <Image
              source={require("@/assets/images/Icons/Dark-Icon.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>Add a {"\n"} New Apartment</Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim, flex: 1, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: Colors.primaryBackground,
                borderRadius: 20,
                padding: 15,
                paddingVertical: 25,
                flex: 1,
              }}
            >
              <View style={styles.stepIndicatorContainer}>
                {pages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.stepIndicator,
                      {
                        backgroundColor:
                          index === step ? Colors.primary : Colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
              <ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps="handled"
              >
                <View>
                  <CurrentPage
                    formData={formData}
                    updateFormData={updateFormData}
                    onValidation={setIsValid}
                    inputRefs={inputRefs}
                    onInputFocus={onInputFocus}
                    onBack={handleBack}
                  />
                  <CustomButton
                    title={step === pages.length - 1 ? "Publish" : "Proceed"}
                    onPress={
                      step === pages.length - 1 ? handlePublish : handleNext
                    }
                    disabled={!isValid}
                  />
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Index;
